import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, ShieldCheck, AlertTriangle, XCircle, Plus, FileText, Activity, Link as LinkIcon, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const mockHistory = [
   { id: 1, text: "Global markets crash amid new regulations restricting international trade...", status: "misleading", confidence: 68, date: "2 hrs ago", type: "text" },
   { id: 2, text: "https://news.example.com/breaking/10928/stock-market-crash", status: "fake", confidence: 91, date: "5 hrs ago", type: "url" },
   { id: 3, text: "New scientific breakthrough in quantum computing promises faster processing...", status: "real", confidence: 95, date: "1 day ago", type: "text" },
   { id: 4, text: "Politician caught on tape admitting to widespread electoral fraud operations in 2024...", status: "fake", confidence: 88, date: "2 days ago", type: "text" },
   { id: 5, text: "Health experts warn of incoming severe flu season variant affecting major cities...", status: "misleading", confidence: 72, date: "3 days ago", type: "text" },
   { id: 6, text: "https://research.example.org/study-findings-2024", status: "real", confidence: 98, date: "4 days ago", type: "url" }
]

const statusConfig = {
   real: { icon: <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500', glow: 'hover:shadow-[0_16px_40px_rgba(16,185,129,0.12)]' },
   fake: { icon: <XCircle className="w-3.5 h-3.5 stroke-[3]" />, color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500', glow: 'hover:shadow-[0_16px_40px_rgba(244,63,94,0.12)]' },
   misleading: { icon: <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500', glow: 'hover:shadow-[0_16px_40px_rgba(245,158,11,0.12)]' }
}

const History = () => {
   const { t } = useTranslation()
   const [searchTerm, setSearchTerm] = useState('')

   const filtered = mockHistory.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))

   return (
      <main className="flex-1 w-full relative mesh-bg min-h-screen pt-40 pb-20 px-6">
         <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-left duration-1000 fill-mode-both">
               <div>
                  <h1 className="text-4xl md:text-5xl font-display font-black text-[--color-on-surface] tracking-tight mb-3">{t('history.title')}</h1>
                  <p className="text-[--color-muted] font-medium text-lg">Review your past fact-checks and tracking logs.</p>
               </div>
               <Link to="/verify" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-[1.25rem] font-black uppercase tracking-widest transition-all shadow-[0_8px_32px_rgba(0,102,255,0.3)] flex items-center gap-3 shrink-0 hover:-translate-y-1 active:scale-95 text-xs border border-[--color-primary-dark]">
                  <Plus className="w-5 h-5" /> {t('history.new_btn')}
               </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-10 animate-in fade-in zoom-in duration-1000 delay-200 fill-mode-both">
               <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent-cyan/30 rounded-[1.5rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-[--color-border] flex items-center px-6 py-4 focus-within:border-primary/50 transition-colors shadow-sm">
                     <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                     <input
                        type="text"
                        placeholder={t('history.search_placeholder')}
                        className="w-full bg-transparent border-none outline-none ml-4 text-sm font-medium text-[--color-on-surface] placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>
               <button className="bg-white/90 backdrop-blur-xl px-8 py-4 rounded-[1.5rem] border border-[--color-border] flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm text-slate-600 active:scale-95">
                  <Filter className="w-4 h-4" /> {t('history.filter')}
               </button>
            </div>

            {filtered.length === 0 ? (
               <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-[--color-border] p-16 flex flex-col items-center text-center shadow-[0_32px_80px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom duration-1000 delay-300 fill-mode-both">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white">
                     <Activity className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-[--color-on-surface] mb-2">{t('history.empty')}</h3>
                  <p className="text-slate-500 text-sm font-medium max-w-sm">You haven't scanned anything matching this search recently.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((item, idx) => {
                     const config = statusConfig[item.status]

                     let dateTranslated = item.date;
                     if (item.date.includes('hrs')) dateTranslated = `2 ${t('history.time.hours_ago')}`;
                     else if (item.date.includes('1 day')) dateTranslated = `1 ${t('history.time.day_ago')}`;
                     else if (item.date.includes('2 days')) dateTranslated = `2 ${t('history.time.days_ago')}`;
                     else if (item.date.includes('3 days')) dateTranslated = `3 ${t('history.time.days_ago')}`;
                     else if (item.date.includes('4 days')) dateTranslated = `4 ${t('history.time.days_ago')}`;

                     return (
                        <Link key={item.id} to="/report" className={`bg-white rounded-[1.5rem] border border-[--color-border] border-l-4 ${config.border} flex flex-col justify-between p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 min-h-[220px] animate-in fade-in slide-in-from-bottom duration-700 fill-mode-both group ${config.glow}`} style={{ animationDelay: `${300 + (idx * 100)}ms` }}>
                           <div className="flex items-center justify-between mb-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${config.bg} ${config.color}`}>
                                 {config.icon} {t(`report.status.${item.status}`)}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                                 {item.type === 'url' ? <LinkIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                 {dateTranslated}
                              </span>
                           </div>

                           <p className="line-clamp-2 text-[--color-on-surface] font-bold text-[1.05rem] mb-8 leading-snug">{item.text}</p>

                           <div className="flex items-end justify-between mt-auto">
                              <div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('history.confidence')}</div>
                                 <div className="text-5xl font-display font-black gradient-text tracking-tighter leading-none">{item.confidence}%</div>
                              </div>
                              <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                                 <ArrowRight className="w-4 h-4" />
                              </div>
                           </div>
                        </Link>
                     )
                  })}
               </div>
            )}
         </div>
      </main>
   )
}

export default History
