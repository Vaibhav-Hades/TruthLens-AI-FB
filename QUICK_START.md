# 🎯 QUICK START - 10 MINUTES TO DEMO

## ✅ What's Ready

### Task A: Multilingual TTS ✅ COMPLETE
Your ChatbotWidget **already has full native browser TTS**!
- Speaks AI responses in native languages (Hindi, Telugu, Tamil, Bengali, etc.)
- Volume toggle button in header
- No code needed - just test it!

### Task B: Audio Extraction Backend ✅ READY
Brand new FastAPI backend with complete infrastructure:
- ✅ `server.py` - FastAPI app with `/extract-audio` endpoint
- ✅ `requirements.txt` - All dependencies (yt-dlp, Whisper, FastAPI)
- ✅ Frontend integration files ready
- ✅ Complete documentation

---

## 🚀 Start in 3 Commands

### **Terminal 1: Start Backend**
```powershell
cd "d:\TruthLens FRONT-END\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --reload --host 127.0.0.1 --port 8000
```

### **Terminal 2: Start Frontend**
```powershell
cd "d:\TruthLens FRONT-END\TruthLensAi"
npm run dev
```

### **Terminal 3: Access**
- Frontend: http://localhost:5174
- Backend API: http://127.0.0.1:8000/docs

---

## 📁 Files Created

```
backend/
├── server.py                    # FastAPI server (ready to run)
├── requirements.txt             # All dependencies
├── .env.example                # Configuration template
├── README.md                    # Detailed backend docs
└── audioExtractionService.js   # Frontend API client

HACKATHON_INTEGRATION_GUIDE.md  # Complete integration tutorial
```

---

## ⚡ Quick Integration Steps

1. **Copy Service**: `backend/audioExtractionService.js` → `src/services/`
2. **Create Hook**: `src/hooks/useAudioExtraction.js` (code in guide)
3. **Create Component**: `src/components/AudioExtractor.jsx` (code in guide)
4. **Add Route**: Add `/extract` route in `App.jsx`

---

## 🎬 Demo Workflow

1. **Chat Widget Demo**
   - Speak in Telugu to bot
   - Bot replies entirely in Telugu
   - 🔊 Audio plays automatically

2. **Audio Extraction Demo**
   - Paste YouTube URL
   - Backend downloads + transcribes
   - Show transcript with timestamps

3. **Integration Demo**
   - Transcript → ChatbotWidget for analysis
   - Results on Report page

---

## ✅ Pre-Demo Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend running on port 5174
- [ ] Test one YouTube video beforehand (model caches)
- [ ] TTS volume audible
- [ ] Have backup video URLs ready

---

## 📚 Detailed Docs

- **Backend Setup**: `backend/README.md`
- **Full Integration**: `HACKATHON_INTEGRATION_GUIDE.md`
- **API Docs**: http://127.0.0.1:8000/docs (interactive Swagger)

---

## 🆘 Quick Troubleshooting

```
Backend won't start?
→ Check: pip install -r requirements.txt completed
→ Install FFmpeg: choco install ffmpeg

CORS errors?
→ Backend CORS pre-configured for localhost

TTS not working?
→ Already works! Just test ChatbotWidget

Slow transcription?
→ Normal! First run = 30s (model loads). After cached.
```

---

**You're ready! Start with Terminal 1, then Terminal 2. 🚀**
