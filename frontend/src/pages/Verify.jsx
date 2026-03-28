import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Link as LinkIcon, FileText, Activity, Globe, Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const langCodeMap = {
   en: 'en-IN',
   hi: 'hi-IN',
   te: 'te-IN',
   ta: 'ta-IN',
   bn: 'bn-IN',
   zh: 'zh-CN',
   ja: 'ja-JP',
   ko: 'ko-KR',
   ar: 'ar-SA',
   fr: 'fr-FR',
   es: 'es-ES',
}

const Verify = () => {
   const { t, i18n } = useTranslation()
   const navigate = useNavigate()
   const [inputText, setInputText] = useState('')
   const [isScanning, setIsScanning] = useState(false)
   const [scanStatus, setScanStatus] = useState('')
   const [deepScan, setDeepScan] = useState(true)
   const [sourceVerify, setSourceVerify] = useState(true)

   const [ttsState, setTtsState] = useState('idle')

   useEffect(() => {
      return () => window.speechSynthesis && window.speechSynthesis.cancel();
   }, []);

   const generatedSummary = inputText.trim() ? inputText.trim() : "";
   const wordCount = generatedSummary.split(/\s+/).filter(w => w.length > 0).length;
   const charCount = generatedSummary.length;

   const handleSpeak = () => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(generatedSummary);
      utterance.lang = langCodeMap[i18n.language] || 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setTtsState('playing');
      utterance.onend = () => setTtsState('finished');
      utterance.onerror = () => setTtsState('idle');

      window.speechSynthesis.speak(utterance);
   }

   const handleStop = () => {
      window.speechSynthesis.cancel();
      setTtsState('idle');
   }

   const previewData = React.useMemo(() => {
      if (!inputText.trim()) return null;

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = inputText.match(urlRegex);
      if (!urls) return null;

      const urlToProcess = urls[0];

      try {
         new URL(urlToProcess);
      } catch {
         return null;
      }

      const ytMatch = urlToProcess.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (ytMatch && ytMatch[1]) {
         return { type: 'youtube', id: ytMatch[1] };
      }

      const igMatch = urlToProcess.match(/(?:instagram\.com\/(?:p|reel|reels)\/)([A-Za-z0-9_-]+)/i);
      if (igMatch && igMatch[1]) {
         return { type: 'instagram', id: igMatch[1] };
      }

      const domain = new URL(urlToProcess).hostname;
      return { type: 'news_article', domain, url: urlToProcess };
   }, [inputText]);

   const handleScan = async (e) => {
      e.preventDefault()
      if (!inputText.trim()) return
      setIsScanning(true)
      setScanStatus('Cross-referencing sources...')

      try {
         setScanStatus('Analyzing with TruthLens AI...')
         const { analyzeAPI } = await import('../utils/api')
         const result = await analyzeAPI.analyze(inputText, previewData?.type || 'text')

         setScanStatus('Generating report...')
         setTimeout(() => {
            navigate('/report', {
               state: {
                  url: inputText,
                  type: previewData?.type,
                  domain: previewData?.domain,
                  result: result
               }
            })
         }, 600)
      } catch (err) {
         console.error('Backend error:', err)
         setScanStatus('Backend unavailable — make sure Spring Boot is running on port 8080')
         setTimeout(() => {
            setIsScanning(false)
            setScanStatus('')
         }, 3000)
      }
   }

   return (
      <main className="flex-1 pt-40 pb-20 px-6 w-full relative mesh-bg min-h-screen">
         <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-both">
            <div className="text-center space-y-4 mb-16">
               <h1 className="text-5xl md:text-6xl font-display font-black text-[--color-on-surface] tracking-tight">{t('verify.title')}</h1>
               <p className="text-[--color-muted] font-medium text-lg max-w-lg mx-auto">{t('verify.subtitle')}</p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-[--color-border] shadow-[0_32px_80px_rgba(0,0,0,0.06)] p-8 relative overflow-hidden">
               <div className="space-y-8">
                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-3 ml-2">
                        <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary shadow-sm">
                           <LinkIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-display font-black tracking-tight text-[--color-on-surface]">
                           Paste a claim, video, or news link
                        </h3>
                     </div>

                     <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent-cyan to-primary rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500 animate-[gradient-shift_3s_ease_infinite] bg-[length:200%_200%]"></div>
                        <textarea
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           placeholder="Drop a YouTube, Instagram, or News Website link, or type a claim..."
                           className="relative w-full h-36 bg-white/80 backdrop-blur-md border border-[--color-border] focus:border-transparent rounded-3xl p-6 outline-none text-lg font-medium transition-all resize-none shadow-inner z-10 text-[--color-on-surface]"
                        />
                     </div>
                  </div>

                  {previewData && (
                     <div className="animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
                        {previewData.type === 'youtube' && (
                           <div className="bg-slate-50 p-4 rounded-[2rem] border border-[--color-border] shadow-sm mt-4">
                              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-slate-900 border border-[--color-border]">
                                 <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${previewData.id}`}
                                    title="YouTube preview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                 ></iframe>
                              </div>
                           </div>
                        )}
                        {previewData.type === 'instagram' && (
                           <div className="bg-slate-50 p-4 rounded-[2rem] border border-[--color-border] shadow-sm mt-4 flex justify-center">
                              <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-inner border border-[--color-border]">
                                 <iframe
                                    src={`https://www.instagram.com/p/${previewData.id}/embed`}
                                    className="w-full"
                                    height="480"
                                    frameBorder="0"
                                    scrolling="no"
                                    allowTransparency="true"
                                 ></iframe>
                              </div>
                           </div>
                        )}
                        {previewData.type === 'news_article' && (
                           <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 shadow-inner mt-4 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                              <Globe className="w-10 h-10 text-primary/80 mb-2 drop-shadow-sm" />
                              <h4 className="font-display font-black text-xl text-[--color-on-surface] truncate w-full max-w-md">{previewData.domain}</h4>
                              <p className="text-xs font-medium text-[--color-muted] break-all max-w-sm px-4 relative z-10">{previewData.url}</p>
                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                                 <Activity className="w-3 h-3 animate-pulse" /> News Analyzer Active
                              </div>
                           </div>
                        )}

                        {previewData && (
                           <div className="bg-primary/5 p-6 rounded-[1.5rem] border border-primary/20 mt-4 flex items-start gap-4 shadow-inner">
                              <div className="p-2 bg-white rounded-lg shadow-sm text-primary shrink-0">
                                 <Activity className="w-5 h-5 animate-pulse" />
                              </div>
                              <div>
                                 <h4 className="font-display font-black text-sm tracking-widest uppercase text-primary mb-1">Awaiting Scan</h4>
                                 <p className="text-xs font-medium text-[--color-muted] leading-relaxed">
                                    Our AI will automatically scan this content deeply, extract the core claims, and verify their accuracy in real-time once you hit verify.
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {inputText.trim().length > 0 && !previewData && (
                     <div className="bg-slate-50 border border-slate-200 shadow-inner rounded-2xl p-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-500 relative">
                        {(!('speechSynthesis' in window)) && (
                           <div className="mb-3 text-xs font-bold text-amber-600 bg-amber-100/50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                              ⚠️ {t('verify.tts_not_supported', "Text-to-speech not supported")} (Try Chrome)
                           </div>
                        )}
                        <h4 className="flex items-center gap-2 font-black text-sm text-[--color-on-surface] uppercase tracking-widest mb-3">
                           <FileText className="w-4 h-4 text-primary" /> Auto Summary
                        </h4>
                        <p className="text-[--color-on-surface] text-lg leading-relaxed font-medium mb-4 break-words">
                           {generatedSummary}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-blue-100">
                           <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>{wordCount} Words</span>
                              <span>{charCount} Characters</span>
                              {ttsState === 'playing' && (
                                 <span className="text-primary flex items-center gap-1">
                                    <Volume2 className="w-3 h-3 animate-pulse" /> {t('verify.listening_in', "Speaking in")} {i18n.language.toUpperCase()}
                                 </span>
                              )}
                           </div>

                           {ttsState !== 'playing' ? (
                              <button onClick={handleSpeak} className="flex items-center justify-center gap-3 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
                                 <Volume2 className="w-5 h-5" />
                                 {ttsState === 'finished' ? t('verify.listen_again', "Listen Again") : t('verify.listen', "Listen to Summary")}
                              </button>
                           ) : (
                              <button onClick={handleStop} className="flex items-center justify-center gap-3 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-md active:scale-95">
                                 <div className="flex items-end gap-0.5 h-5">
                                    {[3, 5, 4, 6, 3].map((h, i) => (
                                       <div key={i} className="w-1 bg-white rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: `${h * 3}px`, animationDelay: `${i * 100}ms` }} />
                                    ))}
                                 </div>
                                 {t('verify.pause', "Pause")}
                              </button>
                           )}
                        </div>
                     </div>
                  )}

                  <div className="pt-6 grid md:grid-cols-2 gap-5">
                     <div
                        onClick={() => setDeepScan(!deepScan)}
                        className={`flex items-center justify-between p-6 rounded-[1.5rem] cursor-pointer transition-all duration-300 border ${deepScan ? 'bg-primary/5 border-primary/20 shadow-[0_4px_16px_rgba(0,102,255,0.06)]' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                     >
                        <div className="flex flex-col gap-1">
                           <div className={`font-bold text-sm uppercase tracking-widest transition-colors ${deepScan ? 'text-primary' : 'text-[--color-on-surface]'}`}>{t('verify.toggle_deep')}</div>
                           <div className="text-xs text-[--color-muted] font-medium">{t('verify.deep_desc')}</div>
                        </div>
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${deepScan ? 'bg-primary' : 'bg-slate-300'}`}>
                           <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${deepScan ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                     </div>

                     <div
                        onClick={() => setSourceVerify(!sourceVerify)}
                        className={`flex items-center justify-between p-6 rounded-[1.5rem] cursor-pointer transition-all duration-300 border ${sourceVerify ? 'bg-primary/5 border-primary/20 shadow-[0_4px_16px_rgba(0,102,255,0.06)]' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                     >
                        <div className="flex flex-col gap-1">
                           <div className={`font-bold text-sm uppercase tracking-widest transition-colors ${sourceVerify ? 'text-primary' : 'text-[--color-on-surface]'}`}>{t('verify.toggle_source')}</div>
                           <div className="text-xs text-[--color-muted] font-medium">{t('verify.source_desc')}</div>
                        </div>
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${sourceVerify ? 'bg-primary' : 'bg-slate-300'}`}>
                           <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${sourceVerify ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-4 relative">
                     <button
                        onClick={handleScan}
                        disabled={isScanning || !inputText.trim()}
                        className={`w-full group relative overflow-hidden bg-gradient-to-r from-[#0066FF] to-[#0050CB] text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest shadow-[0_8px_32px_rgba(0,102,255,0.3)] transition-all flex items-center justify-center gap-3 text-lg ${isScanning ? 'pointer-events-none' : 'hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none'}`}
                     >
                        {isScanning ? (
                           <span className="flex items-center gap-3 relative z-10">
                              <Activity className="w-5 h-5 animate-pulse" />
                              <span className="animate-pulse">{scanStatus}</span>
                           </span>
                        ) : (
                           <span className="flex items-center gap-3 relative z-10">
                              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                              Verify Content
                           </span>
                        )}

                        {!isScanning && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                        {isScanning && <div className="absolute inset-0 bg-primary/20 animate-[pulse-ring_2s_ease-out_infinite] rounded-[1.5rem]"></div>}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </main>
   )
}

export default Verify
