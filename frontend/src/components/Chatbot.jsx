import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react'

const INITIAL_MESSAGE = {
  id: 1,
  role: 'bot',
  text: "Hi! I'm TruthLens Assistant 🤖\n\nI can help you understand the fact-check report, explain why a claim was flagged, or answer questions about the verification process.\n\nWhat would you like to know?",
  time: new Date(),
}

const SUGGESTED_QUESTIONS = [
  "Why was this flagged as fake?",
  "What sources did you use?",
  "How confident is this result?",
  "Explain the evidence breakdown",
]

// Simulated bot responses based on keywords
const getBotResponse = (message) => {
  const msg = message.toLowerCase()

  if (msg.includes('fake') || msg.includes('flagged') || msg.includes('misinformation')) {
    return "The content was flagged based on **cross-referencing with 14 premium news sources** including Reuters, AP, and BBC. Key indicators included:\n\n• Unverified statistical claims\n• Source misattribution\n• Timeline inconsistencies\n\nOur neural engine detected a 94% probability of misinformation."
  }
  if (msg.includes('source') || msg.includes('database')) {
    return "We verified against **48+ global news databases** including:\n\n• Associated Press (AP)\n• Reuters Fact Check\n• BBC Verify\n• WHO Infodemic Tracker\n• Google Fact Check Tools\n\nAll checks happened in real-time within ~1.2 seconds."
  }
  if (msg.includes('confident') || msg.includes('confidence') || msg.includes('accurate') || msg.includes('accuracy')) {
    return "Our current confidence score for this report is **94%** — classified as **High Confidence**.\n\nThis means:\n• Neural Sync: 98%\n• Source Consensus: 92%\n• Metadata Integrity: 100%\n\nScores above 85% are considered highly reliable verdicts."
  }
  if (msg.includes('evidence') || msg.includes('breakdown') || msg.includes('explain')) {
    return "The evidence breakdown shows:\n\n**✅ Global News Hubs** — AP, Reuters, BBC confirmed the original source context with 98% match.\n\n**✅ Temporal Consistency** — The creation timestamp strictly aligns with verified historical events.\n\nThe claim-vs-reality table highlights where the original claim diverged from verified facts."
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! 👋 I'm here to help you understand your TruthLens fact-check report. Feel free to ask me anything about the results, the methodology, or the sources used!"
  }
  if (msg.includes('thank')) {
    return "You're welcome! 🙌 Remember — staying informed is the first step to fighting misinformation. Is there anything else I can help you with?"
  }
  if (msg.includes('how') && msg.includes('work')) {
    return "TruthLens AI works in **4 steps**:\n\n1. **Ingest** — We parse your claim or video URL\n2. **Transcribe** — For video/audio, we extract spoken claims\n3. **Cross-reference** — We compare against 48+ news databases\n4. **Score** — Our neural model outputs a confidence verdict\n\nThe entire process typically takes under 2 seconds!"
  }

  return "That's a great question! Based on the current report, I can tell you that our AI analyzed the claim against multiple verified news sources and detected significant inconsistencies.\n\nFor detailed technical methodology, you can check our **About** page or ask me a more specific question about the report findings!"
}

const ChatMessage = ({ msg }) => {
  const isBot = msg.role === 'bot'
  const formattedText = msg.text.split('\n').map((line, i) => {
    // Bold text: **text**
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <span key={i}>
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        {i < msg.text.split('\n').length - 1 && <br />}
      </span>
    )
  })

  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${isBot
        ? 'bg-gradient-to-br from-[#0066FF] to-[#0050CB] text-white'
        : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isBot
        ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
        : 'bg-gradient-to-r from-[#0066FF] to-[#0050CB] text-white rounded-tr-sm'
        }`}>
        {formattedText}
        <div className={`text-[10px] mt-1.5 ${isBot ? 'text-slate-300' : 'text-white/50'}`}>
          {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

const TypingIndicator = () => (
  <div className="flex gap-3 animate-in fade-in duration-300">
    <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#0066FF] to-[#0050CB] text-white shadow-sm">
      <Bot className="w-4 h-4" />
    </div>
    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  </div>
)

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Allow external components to open the chat via custom event
  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('openChat', handler)
    return () => window.removeEventListener('openChat', handler)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Show unread badge after 3s if chat not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasUnread(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const sendMessage = (text) => {
    const userMsg = text || inputValue.trim()
    if (!userMsg) return

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      text: userMsg,
      time: new Date(),
    }])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot thinking delay
    const delay = 900 + Math.random() * 800
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: getBotResponse(userMsg),
        time: new Date(),
      }])
    }, delay)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE])
    setInputValue('')
    setIsTyping(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Open chat assistant"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-[0_8px_32px_rgba(0,102,255,0.4)] flex items-center justify-center transition-all duration-300 ${isOpen
          ? 'bg-slate-700 rotate-[360deg]'
          : 'bg-gradient-to-br from-[#0066FF] to-[#0050CB] hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,102,255,0.5)]'
          } active:scale-95`}
      >
        {isOpen
          ? <X className="w-6 h-6 text-white" />
          : <MessageCircle className="w-6 h-6 text-white" />
        }
        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400 fill-mode-both">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#0066FF] to-[#0050CB] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-black text-sm tracking-tight">TruthLens Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              title="Reset conversation"
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50 min-h-0" style={{ maxHeight: '340px' }}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="flex-shrink-0 px-3 py-2 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/15 rounded-xl text-[11px] font-bold transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about the report..."
              rows={1}
              className="flex-1 resize-none outline-none text-sm text-slate-700 placeholder-slate-300 font-medium leading-relaxed max-h-24 bg-transparent"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 bg-gradient-to-r from-[#0066FF] to-[#0050CB] text-white rounded-xl flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
