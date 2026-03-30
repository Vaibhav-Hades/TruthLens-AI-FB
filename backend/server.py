import os
import tempfile
import whisper
import json
from pathlib import Path
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import logging
from typing import List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="TruthLens AI Analysis API",
    description="Complete fact-checking, sentiment analysis, and trend monitoring",
    version="2.0.0"
)

# Allow CORS for React frontend (Vite on localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model once at startup (base model = 140MB, faster)
MODEL = None

# In-memory trend storage (in production, use database)
TRENDS_DATA = {
    "keywords": {},
    "sources": {},
    "verification_history": []
}

@app.on_event("startup")
async def load_model():
    global MODEL
    logger.info("Loading Whisper model...")
    MODEL = whisper.load_model("base")
    logger.info("✅ Whisper model loaded successfully")

# ==================== REQUEST/RESPONSE MODELS ====================

class AudioExtractionRequest(BaseModel):
    url: str

class TranscriptSegment(BaseModel):
    start: float
    end: float
    text: str

class AudioExtractionResponse(BaseModel):
    success: bool
    transcript: str
    segments: List[TranscriptSegment]
    language: str
    duration: float

class SentimentAnalysisRequest(BaseModel):
    text: str
    language: str = "en"

class SentimentAnalysisResponse(BaseModel):
    success: bool
    sentiment: str  # "positive", "negative", "neutral", "mixed"
    confidence: float  # 0-100
    emotion_scores: dict
    bias_indicators: List[str]
    manipulation_tactics: List[str]

class FactExtractionRequest(BaseModel):
    text: str
    language: str = "en"

class Fact(BaseModel):
    claim: str
    confidence: float
    category: str  # "statistical", "biographical", "event", "quote", etc.
    keywords: List[str]

class FactExtractionResponse(BaseModel):
    success: bool
    facts: List[Fact]
    summary: str
    key_phrases: List[str]

class TrendMonitoringResponse(BaseModel):
    success: bool
    trending_keywords: List[dict]
    trending_sources: List[dict]
    recent_verifications: List[dict]
    patterns: dict

class HealthResponse(BaseModel):
    status: str
    whisper_model: str
    version: str

# ==================== HEALTH CHECK ====================

@app.get("/health", tags=["Health"], response_model=HealthResponse)
async def health_check():
    """Check API health and model status"""
    return {
        "status": "ok",
        "whisper_model": "base-model" if MODEL else "not-loaded",
        "version": "2.0.0"
    }

# ==================== AUDIO/VIDEO EXTRACTION ====================

@app.post("/extract-audio", tags=["Audio Processing"], response_model=AudioExtractionResponse)
async def extract_audio(request: AudioExtractionRequest):
    """Extract audio from video URL and transcribe using Whisper"""
    temp_dir = tempfile.mkdtemp()
    
    try:
        audio_path = os.path.join(temp_dir, "audio.mp3")
        
        # Download audio using yt-dlp (supports 1000+ platforms)
        logger.info(f"📥 Downloading from: {request.url}")
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': os.path.join(temp_dir, 'audio'),
            'quiet': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=True)
        
        logger.info("🎵 Audio downloaded, transcribing...")
        
        # Transcribe with Whisper
        if not MODEL:
            raise Exception("Whisper model not loaded")
            
        result = MODEL.transcribe(audio_path, language=None, verbose=False)
        
        # Extract segments
        segments = [
            TranscriptSegment(
                start=segment["start"],
                end=segment["end"],
                text=segment["text"].strip()
            ) for segment in result.get("segments", [])
        ]
        
        logger.info(f"✅ Transcription complete: {len(segments)} segments")
        
        return AudioExtractionResponse(
            success=True,
            transcript=" ".join([seg.text for seg in segments]),
            segments=segments,
            language=result.get("language", "unknown"),
            duration=result.get("duration", 0)
        )
        
    except Exception as e:
        logger.error(f"❌ Error extracting audio: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        # Cleanup
        import shutil
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

# ==================== SENTIMENT ANALYSIS ====================

def simple_sentiment_analysis(text: str) -> dict:
    """Simple sentiment analysis without external dependencies"""
    text_lower = text.lower()
    
    # Positive indicators
    positive_words = {"good", "great", "excellent", "amazing", "wonderful", "fantastic", "love", "best", "perfect", "brilliant"}
    # Negative indicators
    negative_words = {"bad", "awful", "terrible", "horrible", "hate", "worst", "ugly", "stupid", "wrong", "fail"}
    # Neutral/Mixed indicators
    intense_words = {"must", "always", "never", "definitely", "absolutely", "certainly"}
    
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    intense_count = sum(1 for word in intense_words if word in text_lower)
    
    # Determine sentiment
    if pos_count > neg_count:
        sentiment = "positive"
        confidence = min(100, 50 + (pos_count * 10))
    elif neg_count > pos_count:
        sentiment = "negative"
        confidence = min(100, 50 + (neg_count * 10))
    else:
        sentiment = "neutral"
        confidence = 50
    
    if intense_count > 3:
        sentiment = "mixed" if sentiment == "neutral" else f"{sentiment}_strong"
        confidence = min(100, confidence + 15)
    
    # Calculate emotion scores
    emotions = {
        "joy": pos_count * 15,
        "anger": neg_count * 15,
        "fear": ("threat" in text_lower or "danger" in text_lower) and 30 or 0,
        "surprise": ("shocking" in text_lower or "unexpected" in text_lower) and 25 or 0,
        "sadness": ("sad" in text_lower or "depressed" in text_lower) and 30 or 0,
    }
    
    return {
        "sentiment": sentiment,
        "confidence": min(100, confidence),
        "emotions": emotions,
        "intensity": intense_count
    }

@app.post("/analyze-sentiment", tags=["NLP"], response_model=SentimentAnalysisResponse)
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """Analyze sentiment, emotions, and manipulation tactics in text"""
    try:
        logger.info(f"🔍 Analyzing sentiment for: {request.text[:50]}...")
        
        analysis = simple_sentiment_analysis(request.text)
        
        # Detect manipulation tactics
        manipulation_indicators = {
            "fear_mongering": ["urgent", "crisis", "emergency", "threat", "danger", "catastrophe"],
            "appeal_to_authority": ["experts say", "scientists confirm", "studies show", "researchers found"],
            "bandwagon": ["everyone believes", "most people", "trending", "viral", "popular"],
            "loaded_language": ["obviously", "clearly", "undeniable", "absolutely"],
            "strawman": ["they claim", "the opposition", "critics argue"],
        }
        
        text_lower = request.text.lower()
        detected_tactics = []
        
        for tactic, keywords in manipulation_indicators.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_tactics.append(tactic)
        
        # Detect bias indicators
        bias_indicators = []
        if any(word in text_lower for word in ["only", "never", "always"]):
            bias_indicators.append("absolutist_language")
        if "us vs them" in text_lower or "us against them" in text_lower:
            bias_indicators.append("in_group_bias")
        if any(word in text_lower for word in ["should", "must", "ought to"]):
            bias_indicators.append("prescriptive_language")
        
        logger.info(f"✅ Sentiment analysis complete: {analysis['sentiment']}")
        
        return SentimentAnalysisResponse(
            success=True,
            sentiment=analysis['sentiment'],
            confidence=analysis['confidence'],
            emotion_scores=analysis['emotions'],
            bias_indicators=bias_indicators,
            manipulation_tactics=detected_tactics
        )
        
    except Exception as e:
        logger.error(f"❌ Error analyzing sentiment: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== FACT EXTRACTION ====================

def extract_facts_simple(text: str) -> List[Fact]:
    """Simple fact extraction using pattern matching"""
    facts = []
    
    # Split into sentences
    sentences = text.split('.')
    
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 10:
            continue
        
        # Detect different types of facts
        if any(word in sentence.lower() for word in ["%", "percent", "million", "thousand", "billion"]):
            facts.append(Fact(
                claim=sentence,
                confidence=75,
                category="statistical",
                keywords=["number", "statistic", "data"]
            ))
        elif any(word in sentence.lower() for word in ["said", "announced", "declared", "stated"]):
            facts.append(Fact(
                claim=sentence,
                confidence=70,
                category="quote",
                keywords=["statement", "quote"]
            ))
        elif any(word in sentence.lower() for word in ["in 20", "on", "at", "during"]):
            facts.append(Fact(
                claim=sentence,
                confidence=80,
                category="event",
                keywords=["date", "time", "event"]
            ))
        elif len(sentence) > 20:
            # Generic claim
            facts.append(Fact(
                claim=sentence,
                confidence=60,
                category="general",
                keywords=["claim"]
            ))
    
    return facts[:10]  # Limit to 10 facts

@app.post("/extract-facts", tags=["NLP"], response_model=FactExtractionResponse)
async def extract_facts(request: FactExtractionRequest):
    """Extract verifiable facts and key claims from text"""
    try:
        logger.info(f"📋 Extracting facts from: {request.text[:50]}...")
        
        facts = extract_facts_simple(request.text)
        
        # Generate summary
        if facts:
            summary = f"Found {len(facts)} verifiable claims: {', '.join([f.category for f in facts[:3]])}..."
        else:
            summary = "No explicit claims detected"
        
        # Extract key phrases (simple approach)
        words = request.text.lower().split()
        key_phrases = list(set([w for w in words if len(w) > 6]))[:5]
        
        logger.info(f"✅ Fact extraction complete: {len(facts)} facts found")
        
        return FactExtractionResponse(
            success=True,
            facts=facts,
            summary=summary,
            key_phrases=key_phrases
        )
        
    except Exception as e:
        logger.error(f"❌ Error extracting facts: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== TREND MONITORING ====================

@app.post("/log-verification", tags=["Trends"])
async def log_verification(verification: dict):
    """Log verification for trend analysis"""
    try:
        logger.info(f"📊 Logging verification: {verification.get('claim', 'N/A')[:30]}...")
        
        # Extract keywords
        text = verification.get("claim", "")
        words = text.lower().split()
        
        for word in words:
            if len(word) > 4:  # Only track meaningful words
                if word not in TRENDS_DATA["keywords"]:
                    TRENDS_DATA["keywords"][word] = {"count": 0, "verdicts": {}}
                
                TRENDS_DATA["keywords"][word]["count"] += 1
                verdict = verification.get("verdict", "unknown")
                TRENDS_DATA["keywords"][word]["verdicts"][verdict] = \
                    TRENDS_DATA["keywords"][word]["verdicts"].get(verdict, 0) + 1
        
        # Track source
        source = verification.get("source", "unknown")
        if source not in TRENDS_DATA["sources"]:
            TRENDS_DATA["sources"][source] = {"count": 0}
        TRENDS_DATA["sources"][source]["count"] += 1
        
        # Add to history
        TRENDS_DATA["verification_history"].append({
            "timestamp": datetime.now().isoformat(),
            "claim": text[:100],
            "verdict": verification.get("verdict", "unknown")
        })
        
        # Keep only last 1000 entries
        if len(TRENDS_DATA["verification_history"]) > 1000:
            TRENDS_DATA["verification_history"] = TRENDS_DATA["verification_history"][-1000:]
        
        logger.info("✅ Verification logged")
        
        return {"success": True}
        
    except Exception as e:
        logger.error(f"❌ Error logging verification: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/get-trends", tags=["Trends"], response_model=TrendMonitoringResponse)
async def get_trends():
    """Get trending keywords and patterns"""
    try:
        logger.info("📈 Generating trend report...")
        
        # Get top keywords
        trending_keywords = sorted(
            [{"keyword": k, "count": v["count"], "verdicts": v["verdicts"]} 
             for k, v in TRENDS_DATA["keywords"].items()],
            key=lambda x: x["count"],
            reverse=True
        )[:10]
        
        # Get top sources
        trending_sources = sorted(
            [{"source": k, "count": v["count"]} 
             for k, v in TRENDS_DATA["sources"].items()],
            key=lambda x: x["count"],
            reverse=True
        )[:10]
        
        # Get recent verifications
        recent = TRENDS_DATA["verification_history"][-20:] if TRENDS_DATA["verification_history"] else []
        
        # Calculate patterns
        verdicts = {}
        for entry in TRENDS_DATA["verification_history"]:
            verdict = entry.get("verdict", "unknown")
            verdicts[verdict] = verdicts.get(verdict, 0) + 1
        
        logger.info("✅ Trend report generated")
        
        return TrendMonitoringResponse(
            success=True,
            trending_keywords=trending_keywords,
            trending_sources=trending_sources,
            recent_verifications=recent,
            patterns={"verdict_distribution": verdicts}
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating trends: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== COMBINED ANALYSIS ====================

class CombinedAnalysisRequest(BaseModel):
    text: str
    language: str = "en"
    include_sentiment: bool = True
    include_facts: bool = True

@app.post("/analyze-all", tags=["Analysis"])
async def analyze_all(request: CombinedAnalysisRequest):
    """Perform all analyses at once: sentiment + fact extraction"""
    try:
        logger.info("🔬 Running comprehensive analysis...")
        
        results = {
            "sentiment": None,
            "facts": None,
            "overall_credibility": 0
        }
        
        if request.include_sentiment:
            sentiment_req = SentimentAnalysisRequest(text=request.text, language=request.language)
            sentiment_res = await analyze_sentiment(sentiment_req)
            results["sentiment"] = sentiment_res.dict()
        
        if request.include_facts:
            facts_req = FactExtractionRequest(text=request.text, language=request.language)
            facts_res = await extract_facts(facts_req)
            results["facts"] = facts_res.dict()
        
        # Calculate overall credibility (0-100)
        score = 70
        if results["sentiment"]:
            if results["sentiment"]["manipulation_tactics"]:
                score -= len(results["sentiment"]["manipulation_tactics"]) * 5
            if results["sentiment"]["bias_indicators"]:
                score -= len(results["sentiment"]["bias_indicators"]) * 3
        
        results["overall_credibility"] = max(0, min(100, score))
        
        logger.info(f"✅ Comprehensive analysis complete (credibility: {results['overall_credibility']}%)")
        
        return results
        
    except Exception as e:
        logger.error(f"❌ Error in comprehensive analysis: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== ROOT ====================

@app.get("/", tags=["Root"])
def read_root():
    """API root endpoint"""
    return {
        "app": "TruthLens AI",
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "extract_audio": "/extract-audio (POST)",
            "sentiment_analysis": "/analyze-sentiment (POST)",
            "fact_extraction": "/extract-facts (POST)",
            "trend_monitoring": "/get-trends (GET)",
            "combined": "/analyze-all (POST)",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
