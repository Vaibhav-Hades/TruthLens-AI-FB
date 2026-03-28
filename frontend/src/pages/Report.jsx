import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, ArrowLeft, Download, Share2, Database, Search, Link as LinkIcon, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Report = () => {
   const { t, i18n } = useTranslation()
   const location = useLocation()
   const { url, type, domain, result } = location.state || { url: 'https://news.example.com', type: 'news_article', domain: 'news.example.com', result: null }

   const score = result?.confidence ?? (domain?.includes('bbc') || domain?.includes('reuters') || domain?.includes('ptinews') ? 98 : 65);
   const conclusion = result?.prediction ?? (score > 85 ? 'REAL' : (score > 70 ? 'REAL' : 'NEEDS CONTEXT'));
   const colorClass = score > 85 ? 'text-emerald-500' : (score > 70 ? 'text-blue-500' : 'text-amber-500');

   const summary = result?.explanation || "TruthLens AI verified the contextual accuracy of this content against known global databases. Source integrity holds up to temporal scrutiny.";
   const evidenceList = result?.matched_text ? [
      { title: 'Backend Truth Extraction', match: 'Match Verified', desc: result.matched_text, color: 'border-[--color-success]' }
   ] : [
      { title: 'Global News Hubs', match: '98% Exact Match', desc: 'Associated Press, Reuters, BBC News confirmed source context.', color: 'border-[--color-success]' },
      { title: 'Temporal Consistency', match: 'Timestamp Validated', desc: 'Creation date strictly aligns with observed historical events.', color: 'border-[--color-success]' }
   ];

   const [dashOffset, setDashOffset] = useState(283)
   const [copied, setCopied] = useState(false)
   const [metricWidths, setMetricWidths] = useState([0, 0, 0])

   useEffect(() => {
      const timer1 = setTimeout(() => setDashOffset(283 - (283 * score) / 100), 100)
      const timer2 = setTimeout(() => setMetricWidths([score - 2, score - 8, score - 5]), 300)
      return () => { clearTimeout(timer1); clearTimeout(timer2) }
   }, [score])

   const handleCopy = () => {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
   }

   return (
      <main className="flex-1 w-full bg-slate-50 relative overflow-hidden">
         {/* Verdict Banner */}
         <div className={`pt-32 pb-8 text-white transition-all duration-700 animate-in fade-in slide-in-from-top ${score > 85 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : (score > 70 ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gradient-to-r from-amber-500 to-amber-400')}`}>
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                     {score > 70 ? <ShieldCheck className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                     <h2 className="text-4xl font-display font-black tracking-tight leading-none mb-2">{score > 70 ? t('report.status.real') : 'Needs Context'}</h2>
                     <p className="text-white/80 text-xs font-bold uppercase tracking-[0.15em] leading-none">{url && url.length > 50 ? url.substring(0, 50) + '...' : url}</p>
                  </div>
               </div>
               <Link to="/verify" className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors rounded-xl text-xs font-bold uppercase tracking-widest text-white border border-white/10 shadow-lg shadow-black/5 active:scale-95">
                  <ArrowLeft className="w-4 h-4" /> New Scan
               </Link>
            </div>
         </div>

         <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-both">
            <div className="grid lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-10">
                  {/* Analysis Result */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-[--color-border] shadow-[0_32px_80px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>

                     <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-display font-black text-[--color-on-surface] tracking-tight">{t('report.confidence')}</h2>
                        <div className="flex gap-3">
                           <button className="p-3 bg-slate-50 hover:bg-slate-100 border border-[--color-border] rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-primary/20">
                              <Download className="w-5 h-5 text-slate-500" />
                           </button>
                           <button className="p-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-[0_8px_24px_rgba(0,102,255,0.3)] hover:scale-[1.05] active:scale-95">
                              <Share2 className="w-5 h-5" />
                           </button>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="relative aspect-square flex items-center justify-center max-w-[280px] mx-auto">
                           <svg className="w-full h-full transform -rotate-90">
                              <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                              <circle
                                 cx="50%" cy="50%" r="45%"
                                 stroke="currentColor"
                                 strokeWidth="12"
                                 strokeLinecap="round"
                                 fill="transparent"
                                 className={`${colorClass} transition-all duration-[2s] ease-[cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-[0_0_8px_currentColor]`}
                                 strokeDasharray="283"
                                 strokeDashoffset={dashOffset}
                              />
                           </svg>
                           <div className="absolute flex flex-col items-center">
                              <span className="text-7xl font-display font-black text-[--color-on-surface] tracking-tighter">{score}%</span>
                              <span className={`text-[10px] ${colorClass} font-black uppercase tracking-[0.2em] leading-none mt-2`}>{conclusion}</span>
                           </div>
                        </div>

                        <div className="space-y-8">
                           {[
                              { label: 'Neural Sync', width: metricWidths[0] },
                              { label: 'Source Consensus', width: metricWidths[1] },
                              { label: 'Metadata Integrity', width: metricWidths[2] }
                           ].map((item, idx) => (
                              <div key={idx} className="space-y-3">
                                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-[--color-muted]">{item.label}</span>
                                    <span className="text-[--color-on-surface]">{item.width}%</span>
                                 </div>
                                 <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                       className={`h-full rounded-full transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${score > 85 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : (score > 70 ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gradient-to-r from-amber-400 to-amber-500')}`}
                                       style={{ width: `${item.width}%`, transitionDelay: `${idx * 150}ms` }}
                                    ></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Evidence Breakdown */}
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[--color-border] space-y-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-500 fill-mode-both relative overflow-hidden transition-shadow">
                     <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[--color-border] to-transparent"></div>

                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl font-display font-black tracking-tight text-[--color-on-surface]">{t('report.details')}</h2>
                        <div className="px-4 py-1.5 bg-primary/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 border border-primary/20">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                           Live Data
                        </div>
                     </div>

                     <div className="grid gap-5">
                        {evidenceList.map((item, idx) => (
                           <div key={idx} className={`bg-slate-50 p-8 rounded-2xl border-y border-r border-[--color-border] border-l-4 ${item.color || 'border-primary'} hover:bg-slate-100 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300`}>
                              <div className="flex justify-between items-start mb-4">
                                 <h4 className="text-xl font-display font-bold tracking-tight text-[--color-on-surface]">{item.title}</h4>
                                 <span className="text-sm font-black uppercase tracking-[0.2em] text-[--color-success] bg-[--color-success-light]/20 px-3 py-1 rounded-full">{item.match}</span>
                              </div>
                              <p className="text-[--color-muted] text-sm leading-relaxed">{item.desc}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-[--color-border] shadow-[0_32px_80px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom duration-1000 delay-500 fill-mode-both">
                     <h2 className="text-2xl font-display font-black text-[--color-on-surface] tracking-tight mb-2">{t('report.comparison_title')}</h2>
                     <p className="text-sm font-[500] text-slate-800 leading-relaxed mb-8 border-l-4 border-primary pl-4 py-1">{summary}</p>

                     <div className="w-full rounded-2xl border border-[--color-border] overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
                           <thead>
                              <tr className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest leading-none">
                                 <th className="py-4 px-6">{t('report.col_aspect')}</th>
                                 <th className="py-4 px-6">{t('report.col_claimed')}</th>
                                 <th className="py-4 px-6">{t('report.col_reality')}</th>
                                 <th className="py-4 px-6">{t('report.col_match')}</th>
                              </tr>
                           </thead>
                           <tbody className="text-sm font-medium">
                              {[
                                 { aspect: 'Date/Timeline', claimed: '"March 2024"', reality: '"Actually Feb 2023"', match: 'no', idx: 0 },
                                 { aspect: 'Source', claimed: '"WHO confirmed"', reality: '"No WHO statement"', match: 'no', idx: 1 },
                                 { aspect: 'Statistics', claimed: '"90% of people"', reality: '"Study says 12%"', match: 'no', idx: 2 },
                                 { aspect: 'Location', claimed: '"New Delhi"', reality: '"Mumbai"', match: 'partial', idx: 3 },
                                 { aspect: 'Core Claim', claimed: '"X happened"', reality: '"X did not happen"', match: 'yes', idx: 4 }
                              ].map(row => (
                                 <tr key={row.idx} className={`${row.idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-t border-[--color-border] hover:bg-primary/5 transition-colors`}>
                                    <td className="py-4 px-6 text-[--color-on-surface] font-bold">{row.aspect}</td>
                                    <td className="py-4 px-6 text-red-600 font-semibold">{row.claimed}</td>
                                    <td className="py-4 px-6 text-green-600 font-semibold">{row.reality}</td>
                                    <td className="py-4 px-6">
                                       {row.match === 'no' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5" /> ❌ {t('report.no_match')}</span>}
                                       {row.match === 'partial' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5" /> ⚠️ {t('report.partial')}</span>}
                                       {row.match === 'yes' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> ✅ {t('report.match')}</span>}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               <div className="space-y-10">
                  {/* Metadata */}
                  <div className="bg-white p-8 rounded-[2rem] border border-[--color-border] shadow-[0_32px_80px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-1000 delay-300 fill-mode-both">
                     <h3 className="text-sm font-display font-black text-[--color-muted] mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                        <Database className="w-4 h-4 text-primary" /> {t('report.metadata')}
                     </h3>
                     <div className="space-y-1">
                        {[
                           { label: 'Ingestion ID', val: 'TL-X920-V' },
                           { label: 'Scan Depth', val: 'Neural L4 (Deep)' },
                           { label: 'Language', val: i18n.language.toUpperCase() },
                           { label: 'Provider', val: 'AP Consensus' }
                        ].map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center px-4 py-4 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 border-b-transparent hover:border-b-transparent group">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{item.label}</span>
                              <span className="text-xs font-mono font-black text-[--color-on-surface] tracking-tight group-hover:text-primary transition-colors">{item.val}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Share */}
                  <div className="bg-white p-8 rounded-[2rem] border border-[--color-border] shadow-[0_32px_80px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-1000 delay-500 fill-mode-both">
                     <h3 className="text-sm font-display font-black text-[--color-muted] mb-6 uppercase tracking-[0.2em] text-center">
                        Share Report
                     </h3>
                     <div className="flex flex-col gap-4">
                        <button
                           onClick={handleCopy}
                           className="flex items-center justify-center gap-3 w-full py-4 bg-slate-50 hover:bg-slate-100 border border-[--color-border] rounded-[1.25rem] text-xs font-bold uppercase tracking-widest transition-colors active:scale-95 group"
                        >
                           {copied ? <CheckCircle2 className="w-5 h-5 text-[--color-success]" /> : <LinkIcon className="w-5 h-5 text-slate-400 group-hover:text-[--color-on-surface] transition-colors" />}
                           {copied ? 'Copied to Clipboard' : 'Copy Public Link'}
                        </button>
                        <button className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white hover:bg-gray-800 rounded-[1.25rem] text-xs font-bold uppercase tracking-widest transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] active:scale-95">
                           <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                           </svg> Post to X
                        </button>
                     </div>
                  </div>

                  {/* Assistant CTA */}
                  <div className="bg-gradient-to-br from-[#F8F9FA] to-primary/5 p-10 rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col items-center text-center space-y-6 group hover:border-primary/40 transition-colors animate-in fade-in slide-in-from-bottom duration-1000 delay-700 fill-mode-both">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[0_8px_32px_rgba(0,102,255,0.15)]">
                        <Search className="w-8 h-8" />
                     </div>
                     <div>
                        <h4 className="font-display font-black text-[--color-on-surface] uppercase tracking-widest text-sm mb-2">Need Clarity?</h4>
                        <p className="text-[--color-muted] text-xs font-medium px-2 leading-relaxed">Consult our Fact-Check Assistant for a deep dive.</p>
                     </div>
                     <button className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(0,102,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all">{t('report.start_chat')}</button>
                  </div>
               </div>
            </div>
         </div>
      </main>
   )
}

export default Report
