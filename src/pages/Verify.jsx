import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Zap, Search, Link as LinkIcon, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const Verify = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('text')

  return (
    <main className="flex-1 pt-40 pb-20 px-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center space-y-4 mb-20">
         <h1 className="text-5xl font-display font-black text-on-surface tracking-tight">{t('verify.title')}</h1>
         <p className="text-slate-500 font-medium">{t('verify.subtitle')}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 p-8 border border-slate-100 ghost-border relative overflow-hidden">
        <div className="flex bg-slate-100 p-2 rounded-2xl mb-8">
           <button 
             onClick={() => setActiveTab('text')}
             className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'text' ? 'bg-white shadow-lg text-primary' : 'text-slate-500 hover:text-on-surface'}`}
           >
             <FileText className="w-4 h-4" />
             {t('verify.tabs.text')}
           </button>
           <button 
             onClick={() => setActiveTab('url')}
             className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'url' ? 'bg-white shadow-lg text-primary' : 'text-slate-500 hover:text-on-surface'}`}
           >
             <LinkIcon className="w-4 h-4" />
             {t('verify.tabs.url')}
           </button>
        </div>

        <div className="space-y-8">
           <div className="relative">
              <textarea 
                placeholder={t('verify.placeholder')}
                className="w-full h-48 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-3xl p-8 outline-none text-lg font-medium transition-all resize-none shadow-inner"
              />
              <div className="absolute right-6 bottom-6 flex gap-2">
                 <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Scan Depth: Standard
                 </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                 <input type="checkbox" className="w-6 h-6 rounded-lg accent-primary" defaultChecked />
                 <div>
                    <div className="font-bold text-on-surface text-sm uppercase tracking-widest">{t('verify.toggle_deep')}</div>
                    <div className="text-xs text-slate-400 font-medium">Multi-layered neural scan</div>
                 </div>
              </label>
              <label className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                 <input type="checkbox" className="w-6 h-6 rounded-lg accent-primary" defaultChecked />
                 <div>
                    <div className="font-bold text-on-surface text-sm uppercase tracking-widest">{t('verify.toggle_source')}</div>
                    <div className="text-xs text-slate-400 font-medium">Audit worldwide databases</div>
                 </div>
              </label>
           </div>

           <Link to="/report" className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
              <Search className="w-6 h-6" />
              {t('verify.scan_btn')}
           </Link>
        </div>
      </div>
    </main>
  )
}

export default Verify
