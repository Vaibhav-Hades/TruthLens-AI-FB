import React from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, ArrowLeft, Download, Share2, BarChart3, Database, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const Report = () => {
  const { t, i18n } = useTranslation()

  return (
    <main className="flex-1 pt-40 pb-20 px-6 max-w-6xl mx-auto w-full animate-in fade-in zoom-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
         <div className="flex items-center gap-6">
            <Link to="/verify" className="p-3 bg-white rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
               <ArrowLeft className="w-5 h-5 text-slate-500" />
            </Link>
            <h1 className="text-5xl font-display font-black text-on-surface tracking-tight">{t('report.title')}</h1>
            <div className="px-5 py-2 bg-green-500 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-green-500/20">
               {t('report.status.real')}
            </div>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
               <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-95 shadow-xl shadow-primary/20">
               <Share2 className="w-4 h-4" /> Share
            </button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5 ghost-border border border-slate-50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] flex items-center justify-center p-6">
                  <ShieldCheck className="w-12 h-12 text-primary opacity-20" />
               </div>
               <h2 className="text-2xl font-display font-black text-on-surface mb-8 tracking-tight">{t('report.confidence')}</h2>
               <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative aspect-square flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                        <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary" strokeDasharray="283" strokeDashoffset="17" />
                     </svg>
                     <div className="absolute flex flex-col items-center">
                        <span className="text-7xl font-display font-black text-on-surface tracking-tight">94%</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">High Confidence</span>
                     </div>
                  </div>
                  <div className="space-y-6">
                     {[
                        { label: 'Neural Sync', value: 98 },
                        { label: 'Source Consensus', value: 92 },
                        { label: 'Metadata Integrity', value: 100 }
                     ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                           <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                              <span className="text-slate-500">{item.label}</span>
                              <span className="text-primary">{item.value}%</span>
                           </div>
                           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, transitionDelay: `${idx * 200}ms` }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-black tracking-tight">{t('report.details')}</h2>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary">Live Data</div>
               </div>
               <div className="grid gap-4">
               {[
                  { title: 'Global News Hubs', match: '98% Exact Match', desc: 'Associated Press, Reuters, BBC News confirmed source.' },
                  { title: 'Temporal Consistency', match: 'Timestamp Validated', desc: 'Creation date aligns with observed historical events.' }
               ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold tracking-tight">{item.title}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-400">{item.match}</span>
                     </div>
                     <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
               ))}
               </div>
            </div>
         </div>

         <div className="space-y-10">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-primary/5 ghost-border border border-slate-50">
               <h3 className="text-lg font-display font-black text-on-surface mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> {t('report.metadata')}
               </h3>
               <div className="space-y-4">
                  {[
                     { label: 'Ingestion ID', val: 'TL-X920-VERITY' },
                     { label: 'Scan Depth', val: 'Neural L4 (Deep)' },
                     { label: 'Language', val: i18n.language.toUpperCase() },
                     { label: 'Provider', val: 'AP Consensus' }
                  ].map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{item.label}</span>
                        <span className="text-xs font-black text-on-surface tracking-tight">{item.val}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-primary/5 p-10 rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col items-center text-center space-y-6 group">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-display font-black text-on-surface uppercase tracking-widest text-sm mb-2">Need More Clarity?</h4>
                  <p className="text-slate-500 text-xs font-medium px-4">Consult our specialized Fact-Check Assistant for a deep dive.</p>
               </div>
               <button className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">Start Chat</button>
            </div>
         </div>
      </div>
    </main>
  )
}

export default Report
