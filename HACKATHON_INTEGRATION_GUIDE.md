# 🎖️ HACKATHON INTEGRATION GUIDE - TruthLens AI

**Complete Setup Instructions for Both Frontend TTS & Backend Audio Extraction**

---

## 📋 TASK A: MULTILINGUAL TEXT-TO-SPEECH (Testing Existing Implementation)

Your ChatbotWidget already has this fully implemented! Here's how to verify it works:

### **The Complete TTS Code in Your App:**

```javascript
// File: src/components/ChatbotWidget.jsx

// 1. SPEAK FUNCTION (CORE)
const handleSpeak = (text, lang) => {
  if (!ttsEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;  // 'en-US', 'hi-IN', 'te-IN', 'ta-IN', etc.
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  const voices = window.speechSynthesis.getVoices();
  const voicePrefix = lang.split('-')[0];
  const voice = voices.find(v => v.lang.includes(lang) || v.lang.includes(voicePrefix));
  if (voice) utterance.voice = voice;
  
  window.speechSynthesis.speak(utterance);
};

// 2. AUTO-TRIGGER IN SENDMESSAGE
const sendMessage = async (textOverride) => {
  // ... API call to Gemini ...
  let reply = data.candidates[0].content.parts[0].text;
  setMessages([...newMessages, { role: 'assistant', content: reply }]);
  
  // ✅ THIS AUTOMATICALLY SPEAKS THE RESPONSE
  handleSpeak(reply, finalLang);
};

// 3. VOLUME TOGGLE IN UI
<button 
  onClick={() => { setTtsEnabled(!ttsEnabled); window.speechSynthesis?.cancel(); }} 
  className={`p-1.5 rounded-full transition-colors ${ttsEnabled ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
>
  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
</button>
```

### **What You Can Do (Optional Enhancements for Hackathon):**

If you want to add a **speak button per message** or **replay button**, here's the code:

```javascript
// Add this function to ChatbotWidget.jsx
const speakMessage = (text, lang) => {
  handleSpeak(text, lang);
};

// Then add this button in the message display (inside the chat area map):
{msg.role === 'assistant' && (
  <button
    onClick={() => speakMessage(msg.content, selectedLang)}
    className="mt-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded text-primary transition-colors"
    title="Replay audio"
  >
    🔊 Replay
  </button>
)}
```

**Status: ✅ COMPLETE - Works as-is**

---

## 🎯 TASK B: AUDIO EXTRACTION BACKEND (Complete New Setup)

### **Part 1: Backend Installation & Launch**

#### **Step 1.1: Create Python Virtual Environment**

```powershell
# Navigate to backend directory
cd "d:\TruthLens FRONT-END\backend"

# Create venv
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies (this takes ~5-10 minutes, includes Whisper model download)
pip install -r requirements.txt
```

#### **Step 1.2: Start the Backend Server**

```powershell
# With auto-reload (development)
uvicorn server:app --reload --host 127.0.0.1 --port 8000

# Should see:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Loading Whisper model...
# INFO:     Whisper model loaded successfully
```

✅ **Backend is ready!**

---

### **Part 2: Frontend Integration**

#### **Step 2.1: Copy Service File**

Copy the service file to your frontend:

```
Copy: backend/audioExtractionService.js
To:   TruthLensAi/src/services/audioExtractionService.js
```

#### **Step 2.2: Create Audio Extraction Hook**

Create file: `TruthLensAi/src/hooks/useAudioExtraction.js`

```javascript
import { useState } from 'react';
import AudioExtractionService from '../services/audioExtractionService';

export const useAudioExtraction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const extractAudio = async (videoUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await AudioExtractionService.extractAudio(videoUrl);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkBackend = async () => {
    return await AudioExtractionService.checkHealth();
  };

  return { extractAudio, checkBackend, loading, error, result };
};
```

#### **Step 2.3: Add UI Component**

Create file: `TruthLensAi/src/components/AudioExtractor.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useAudioExtraction } from '../hooks/useAudioExtraction';
import { Download, Copy, AlertCircle } from 'lucide-react';

const AudioExtractor = () => {
  const { extractAudio, checkBackend, loading, error, result } = useAudioExtraction();
  const [videoUrl, setVideoUrl] = useState('');
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    checkBackend().then(setBackendConnected);
  }, []);

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    
    try {
      await extractAudio(videoUrl);
    } catch (err) {
      console.error('Extraction failed:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.transcript);
    alert('Transcript copied!');
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([result.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    element.click();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6">🎙️ Audio Transcription</h2>

      {!backendConnected && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-700 text-sm">
            <strong>Backend not connected.</strong> Ensure Python server is running on port 8000
          </p>
        </div>
      )}

      <form onSubmit={handleExtract} className="mb-6">
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste YouTube, Instagram, or TikTok URL..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={loading || !backendConnected}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? '⏳ Processing...' : '✨ Extract'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-semibold">❌ Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-bold">Language</p>
              <p className="text-lg font-bold">{result.language.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-bold">Duration</p>
              <p className="text-lg font-bold">{result.duration.toFixed(1)}s</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 uppercase font-bold">Segments</p>
              <p className="text-lg font-bold">{result.segments.length}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">📝 Full Transcript</p>
            <p className="text-sm text-slate-700 leading-relaxed">{result.transcript}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button
              onClick={downloadTranscript}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>

          {result.segments.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="font-semibold mb-3">⏱️ Segments with Timestamps</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.segments.map((seg, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-primary font-mono text-xs flex-shrink-0">
                      [{seg.start.toFixed(1)}s]
                    </span>
                    <span className="text-slate-700">{seg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioExtractor;
```

#### **Step 2.4: Add Route to Your App**

In `TruthLensAi/src/App.jsx`:

```javascript
// Add import
import AudioExtractor from './components/AudioExtractor';

// Add route (wherever your routing is configured)
<Route path="/extract" element={<AudioExtractor />} />

// Add navigation link in Navbar
<Link to="/extract" className="nav-link">🎙️ Extract Audio</Link>
```

---

### **Part 3: Testing**

#### **Test 1: API Health Check**
```bash
# In terminal
curl http://127.0.0.1:8000/health

# Expected:
# {"status":"ok","service":"TruthLens Audio Extraction"}
```

#### **Test 2: Extract from YouTube**
```bash
curl -X POST http://127.0.0.1:8000/extract-audio \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://youtu.be/dQw4w9WgXcQ\"}"
```

#### **Test 3: UI Test**
1. Open http://localhost:5174/extract
2. Paste a YouTube/Instagram URL
3. Click "Extract"
4. Wait 30-60 seconds (first time downloads Whisper model)
5. See transcript with timestamps!

---

## 🎬 Hackathon Demo Flow

**Complete Demo in 3 Minutes:**

1. **Open ChatbotWidget Demo**
   - User speaks Telugu to bot
   - Bot responds entirely in Telugu script
   - 🔊 Response automatically plays in Telugu voice
   - Show Volume toggle button works

2. **Switch to Audio Extractor**
   - Paste YouTube video link
   - Show extraction + transcription happening
   - Display formatted transcript with timestamps
   - Copy/Download buttons work

3. **Show Integration Potential**
   - Transcript flows to ChatbotWidget
   - Bot analyzes transcription
   - Results displayed in Report page

---

## 📦 Project File Structure

```
d:\TruthLens FRONT-END/
├── TruthLensAi/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatbotWidget.jsx        (✅ TTS already here)
│   │   │   └── AudioExtractor.jsx       (📝 NEW - created above)
│   │   ├── hooks/
│   │   │   └── useAudioExtraction.js    (📝 NEW - created above)
│   │   ├── services/
│   │   │   └── audioExtractionService.js (📝 NEW - copy from backend folder)
│   │   └── App.jsx                       (✏️ Add route)
│   ├── package.json
│   └── vite.config.js
│
└── backend/                              (📝 NEW folder)
    ├── server.py                         (✅ FastAPI server)
    ├── requirements.txt                  (✅ Dependencies)
    ├── .env.example                      (✅ Config template)
    ├── README.md                         (✅ Setup guide)
    ├── audioExtractionService.js         (✅ Frontend service)
    └── venv/                             (auto-created)
```

---

## ⚡ Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Backend already CORS-enabled for localhost |
| "Module not found" | Run `pip install -r requirements.txt` in venv |
| "FFmpeg not found" | Install: `choco install ffmpeg` (Windows) |
| Slow transcription | Normal! First run loads Whisper (~30s). Cached after |
| Backend not responding | Check if `uvicorn server:app --reload` is running |
| TTS doesn't work | Enable microphone permissions + check browser support |

---

## 🏆 Production Checklist

Before final demo:

- [ ] Backend running: `uvicorn server:app --host 127.0.0.1 --port 8000`
- [ ] Frontend running: `npm run dev`
- [ ] Both on localhost (no internet required for demo)
- [ ] Test video URL before demo (pre-download model)
- [ ] TTS volume audible (test beforehand)
- [ ] Have backup YouTube URL ready
- [ ] Document shows multilingual support

---

**You're ready to demo! 🚀**

Questions? Check the backend/README.md for detailed backend docs.
