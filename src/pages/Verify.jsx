import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Link as LinkIcon, FileText, Activity, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Verify = () => {
   const { t } = useTranslation()
   const navigate = useNavigate()
   const [activeTab, setActiveTab] = useState('text')
   const [inputText, setInputText] = useState('')
   const [isScanning, setIsScanning] = useState(false)
   const [scanStatus, setScanStatus] = useState('')
   const [deepScan, setDeepScan] = useState(true)
   const [sourceVerify, setSourceVerify] = useState(true)

   const handleScan = (e) => {
      e.preventDefault()
      setIsScanning(true)
      setScanStatus('Cross-referencing sources...')

      setTimeout(() => {
         setScanStatus('Analyzing metadata...')
         setTimeout(() => {
            navigate('/report')
         }, 1500)
      }, 1500)
   }

   return (
      <main className="flex-1 pt-40 pb-20 px-6 w-full relative mesh-bg min-h-screen">
         <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-both">
            <div className="text-center space-y-4 mb-16">
               <h1 className="text-5xl md:text-6xl font-display font-black text-[--color-on-surface] tracking-tight">{t('verify.title')}</h1>
               <p className="text-[--color-muted] font-medium text-lg max-w-lg mx-auto">{t('verify.subtitle')}</p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-[--color-border] shadow-[0_32px_80px_rgba(0,0,0,0.06)] p-8 relative overflow-hidden">
               <div className="relative flex bg-slate-100/80 p-1.5 rounded-2xl mb-10 overflow-hidden">
                  <div className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-[#0066FF] to-[#0050CB] rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-md" style={{ transform: activeTab === 'text' ? 'translateX(0)' : 'translateX(100%)' }}></div>

                  <button
                     onClick={() => setActiveTab('text')}
                     className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors duration-300 ${activeTab === 'text' ? 'text-white' : 'text-slate-500 hover:text-[--color-on-surface]'}`}
                  >
                     <FileText className="w-4 h-4" />
                     {t('verify.tabs.text')}
                  </button>
                  <button
                     onClick={() => setActiveTab('url')}
                     className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors duration-300 ${activeTab === 'url' ? 'text-white' : 'text-slate-500 hover:text-[--color-on-surface]'}`}
                  >
                     <LinkIcon className="w-4 h-4" />
                     {t('verify.tabs.url')}
                  </button>
               </div>

               <div className="space-y-8">
                  <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent-cyan to-primary rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500 animate-[gradient-shift_3s_ease_infinite] bg-[length:200%_200%]"></div>
                     <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('verify.placeholder')}
                        className="relative w-full h-48 bg-white/60 backdrop-blur-md border border-[--color-border] focus:border-transparent rounded-3xl p-8 outline-none text-lg font-medium transition-all resize-none shadow-inner z-10 text-[--color-on-surface]"
                     />

                     <div className={`absolute left-0 -bottom-8 flex items-center gap-2 px-2 transition-all duration-500 ${inputText.length > 5 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                        <Globe className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-[--color-muted] uppercase tracking-widest">Detected: <span className="text-primary ml-1">English</span></span>
                     </div>
                  </div>

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
                              {t('verify.scan_btn')}
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
