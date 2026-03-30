import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Mic, Send, Volume2, VolumeX, Globe, Loader2, User, Bot, Copy, Trash2, Download, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobalToast } from '../context/ToastContext';
import { storage } from '../utils/storage';
import { getSuggestions } from '../utils/suggestions';

const SYSTEM_PROMPT = `You are Sam, a customer success specialist at TechHub. You are live on a video call with a real customer. Your voice is warm, casual, and confident. Keep responses extremely concise (1-3 sentences max).
CRITICAL LANGUAGE RULE: You MUST always reply ENTIRELY in the exact same language the user speaks or writes to you. NOT A SINGLE WORD OF ENGLISH is allowed if the user speaks another language (like Telugu, Hindi, Spanish, etc). For example, if they speak Telugu, your entire response must be in Telugu script.
IF the user asks to open the analyzer or verify page, include exactly "[ACTION: OPEN_ANALYZER]".
IF the user asks to go home or to the dashboard, include exactly "[ACTION: OPEN_HOME]".
IF the user asks you to switch your language (e.g., "Speak Telugu", "हिंदी बात करो"), include "[ACTION: LANG_XX]" where XX is the 2-letter code (en, hi, te, ta, bn, es, fr, zh, ar) and reply entirely in that language.`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)' },
  { code: 'es-ES', name: 'Español' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'zh-CN', name: '中文 (Chinese)' },
  { code: 'ar-SA', name: 'العربية (Arabic)' },
];

const uiText = {
  'en-US': { listening: 'Listening...', message: 'Message Sam...', ai: 'TechHub AI', greeting: "Hey there! I'm Sam from TechHub Support. How can I help you today?", err: "Network Error" },
  'te-IN': { listening: 'వింటున్నాను...', message: 'సందేశం పంపండి...', ai: 'టెక్ హబ్ AI', greeting: "నమస్కారం! నేను టెక్ హబ్ నుండి సామ్ ని. నేనెలా సహాయపడగలను?", err: "నెట్‌వర్క్ లోపం" },
  'hi-IN': { listening: 'सुन रहा हूँ...', message: 'संदेश भेजें...', ai: 'टेक-हब AI', greeting: "नमस्ते! मैं टेकहब से सैम हूँ। मैं आपकी कैसे मदद कर सकता हूँ?", err: "नेटवर्क त्रुटि" },
  'ta-IN': { listening: 'கேட்கிறேன்...', message: 'செய்தி அனுப்பு...', ai: 'டெக் ஹப் AI', greeting: "வணக்கம்! நான் சாம். நான் உங்களுக்கு எப்படி உதவ முடியும்?", err: "பிணைய பிழை" }
};

const getUI = (lang, key) => (uiText[lang] || uiText['en-US'])[key] || uiText['en-US'][key];

const ChatbotWidget = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useGlobalToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(storage.getUserLanguage() || 'en-US');
  const [messages, setMessages] = useState(() => {
    const saved = storage.getChatHistory();
    return saved.length > 0 ? saved : [{ role: 'assistant', content: getUI('en-US', 'greeting'), timestamp: new Date().toISOString() }];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Save messages to localStorage
  useEffect(() => {
    storage.saveChatHistory(messages);
  }, [messages]);

  // Save language preference
  useEffect(() => {
    storage.setUserLanguage(selectedLang);
  }, [selectedLang]);

  // Clean up speech synthesis
  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const handleSpeak = (text, lang) => {
    if (!ttsEnabled) {
      console.log('❌ TTS disabled by user');
      return;
    }
    
    if (!window.speechSynthesis) {
      console.error('❌ speechSynthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      console.warn('⚠️ No voices loaded, waiting for voices to load...');
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        console.log('✅ Voices loaded:', voices.length);
      };
    }
    
    // Find best matching voice
    const voicePrefix = lang.split('-')[0];
    const matchedVoice = voices.find(v => v.lang.includes(lang) || v.lang.startsWith(voicePrefix));
    
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      console.log('✅ Voice selected:', matchedVoice.name, '(' + matchedVoice.lang + ')');
    } else {
      console.warn('⚠️ No matching voice for', lang, 'Available voices:', voices.map(v => v.lang).slice(0, 5));
    }
    
    utterance.onstart = () => console.log('🔊 Speaking...');
    utterance.onend = () => console.log('✅ Speech complete');
    utterance.onerror = (e) => console.error('❌ Speech error:', e.error);
    
    window.speechSynthesis.speak(utterance);
  };

  const recognitionRef = useRef(null);

  // Copy message to clipboard
  const copyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(index);
    addToast('✅ Message copied!', 'success', 2000);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Clear chat history
  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      setMessages([{ role: 'assistant', content: getUI(selectedLang, 'greeting'), timestamp: new Date().toISOString() }]);
      storage.clearChatHistory();
      addToast('🗑️ Chat cleared', 'info', 2000);
    }
  };

  // Export conversation
  const exportConversation = () => {
    const text = messages
      .map((msg, i) => {
        const time = new Date(msg.timestamp).toLocaleTimeString();
        const role = msg.role === 'user' ? 'You' : 'Sam';
        return `[${time}] ${role}:\n${msg.content}`;
      })
      .join('\n\n---\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sam-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    addToast('📥 Conversation exported!', 'success', 2000);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    window.speechSynthesis?.cancel();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = selectedLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    let preExistingText = inputText.trim();
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const combined = (preExistingText + ' ' + finalTranscript).trim() + ' ' + interimTranscript;
      setInputText(combined.trim());
      
      if (finalTranscript) {
         preExistingText = (preExistingText + ' ' + finalTranscript).trim();
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessage = async (textOverride) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputText;
    if (!textToSend.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: textToSend, timestamp: new Date().toISOString() }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    
    try {
       const reqBody = {
          contents: [
             { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
             { role: 'model', parts: [{ text: "Understood. I am Sam from TechHub." }] },
             ...newMessages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
             }))
          ],
          generationConfig: {
             temperature: 0.7,
          }
       };
       
       const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify(reqBody)
       });
       
       const data = await res.json();
       if (!res.ok) {
           throw new Error(data.error?.message || `API Error ${res.status}`);
       }

       if (data.candidates && data.candidates[0].content?.parts[0]?.text) {
          let reply = data.candidates[0].content.parts[0].text;
          
          if (reply.includes('[ACTION: OPEN_ANALYZER]')) {
             navigate('/verify');
             reply = reply.replace('[ACTION: OPEN_ANALYZER]', '').trim();
          }
          if (reply.includes('[ACTION: OPEN_HOME]')) {
             navigate('/dashboard');
             reply = reply.replace('[ACTION: OPEN_HOME]', '').trim();
          }
          
          let finalLang = selectedLang;
          const langMatch = reply.match(/\[ACTION: LANG_([a-z]{2})\]/i);
          if (langMatch) {
             const code = langMatch[1].toLowerCase();
             finalLang = languages.find(l => l.code.startsWith(code))?.code || 'en-US';
             setSelectedLang(finalLang);
             if (i18n && i18n.changeLanguage) {
                i18n.changeLanguage(code);
             }
             reply = reply.replace(langMatch[0], '').trim();
          }

          setMessages([...newMessages, { role: 'assistant', content: reply, timestamp: new Date().toISOString() }]);
          addToast('✅ Message sent!', 'success', 1500);
          
          // Force enable TTS and speak immediately
          console.log('📢 Bot responding, triggering speech...');
          setTtsEnabled(true); // Make sure TTS is enabled
          
          // Small delay to ensure state updates
          setTimeout(() => {
            console.log('🔊 Now speaking:', reply.substring(0, 50) + '...');
            handleSpeak(reply, finalLang);
          }, 100);
       } else {
          setMessages([...newMessages, { role: 'assistant', content: `Oops! Generated response format error.`, timestamp: new Date().toISOString() }]);
          addToast('❌ Response format error', 'error', 2000);
       }
    } catch (err) {
       setMessages([...newMessages, { role: 'assistant', content: `Connectivity Issue: ${err.message}. Please check your API Key.`, timestamp: new Date().toISOString() }]);
       addToast('❌ ' + err.message, 'error', 3000);
    } finally {
       setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[600px] shadow-2xl rounded-[2rem] overflow-hidden border border-slate-200/60 bg-slate-50 flex flex-col transform origin-bottom-right transition-all duration-300 animate-in slide-in-from-bottom-5 zoom-in-95 backdrop-blur-3xl">
          
          {/* Header */}
          <div className="bg-white px-5 py-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-10 relative border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shadow-inner">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg leading-tight tracking-tight">Sam</h3>
                   <span className="text-xs text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">TechHub AI</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                <button 
                  onClick={exportConversation}
                  className="p-1.5 rounded-full text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                  title="Export Chat"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={clearChat}
                  className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setTtsEnabled(!ttsEnabled); window.speechSynthesis?.cancel(); }} 
                  className={`p-1.5 rounded-full transition-colors ${ttsEnabled ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  title={ttsEnabled ? "Mute Voice" : "Enable Voice"}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => {
                    console.log('🔊 Testing voice...');
                    const testMsg = selectedLang.startsWith('en') ? 'Voice test successful' : 'Audio test working';
                    handleSpeak(testMsg, selectedLang);
                  }} 
                  className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Test Voice"
                >
                  🔊
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full cursor-pointer hover:border-primary/50 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <select 
                 value={selectedLang}
                 onChange={(e) => setSelectedLang(e.target.value)}
                 className="bg-transparent text-xs font-bold text-slate-600 outline-none w-full cursor-pointer appearance-none"
              >
                 {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                 ))}
              </select>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50">
            {messages.map((msg, i) => (
               <div key={i} className={`flex items-end gap-2 max-w-[85%] group ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-slate-200' : 'bg-primary'}`}>
                     {msg.role === 'user' ? <User className="w-3 h-3 text-slate-500" /> : <Bot className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm relative ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'}`}>
                     {msg.content}
                     <button 
                       onClick={() => copyMessage(msg.content, i)}
                       className={`absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full ${msg.role === 'user' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'} shadow-sm`}
                     >
                       <Copy className="w-3 h-3" />
                     </button>
                    </div>
                    <span className={`text-[11px] font-medium px-1 ${msg.role === 'user' ? 'text-slate-500 text-right' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
               </div>
            ))}
            {isLoading && (
               <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                     <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
               </div>
            )}
            {!isLoading && messages.length <= 1 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                <Lightbulb className="w-8 h-8 text-slate-300" />
                <p className="text-sm text-slate-500 font-medium text-center">Try asking me something...</p>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {getSuggestions(selectedLang).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        console.log('📝 Suggestion clicked:', suggestion);
                        sendMessage(suggestion);
                      }}
                      className="text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all active:scale-95 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-slate-100 flex items-center gap-2">
            <button 
              onClick={toggleListening}
              className={`p-3.5 rounded-full shrink-0 transition-all ${isListening ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-primary'}`}
              title={isListening ? "Stop Listening" : "Speak"}
            >
              <Mic className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all shadow-inner">
               <input 
                 type="text" 
                 value={inputText}
                 onChange={e => setInputText(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder={isListening ? getUI(selectedLang, 'listening') : getUI(selectedLang, 'message')}
                 className="w-full py-3.5 bg-transparent outline-none text-[15px] text-slate-700 placeholder:text-slate-400"
               />
            </div>
            <button 
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className={`p-3.5 rounded-full shrink-0 transition-all shadow-sm ${!inputText.trim() || isLoading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-[#0050CB] hover:-translate-y-0.5 hover:shadow-md active:scale-95'}`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -ml-0.5" />}
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-[#0050CB] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,102,255,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,102,255,0.5)] active:scale-95 flex items-center justify-center group cursor-pointer"
        >
          <MessageSquare className="w-7 h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
