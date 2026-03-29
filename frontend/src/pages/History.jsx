import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, ShieldCheck, AlertTriangle, XCircle, Plus, FileText, Activity, Link as LinkIcon, ArrowRight, Download, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGlobalToast } from '../context/ToastContext'
import { storage } from '../utils/storage'

const statusConfig = {
   real: { icon: <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500', glow: 'hover:shadow-[0_16px_40px_rgba(16,185,129,0.12)]' },
   fake: { icon: <XCircle className="w-3.5 h-3.5 stroke-[3]" />, color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500', glow: 'hover:shadow-[0_16px_40px_rgba(244,63,94,0.12)]' },
   misleading: { icon: <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500', glow: 'hover:shadow-[0_16px_40px_rgba(245,158,11,0.12)]' }
}

const History = () => {
   const { t } = useTranslation()
   const { addToast } = useGlobalToast()
   const [searchTerm, setSearchTerm] = useState('')
   const [statusFilter, setStatusFilter] = useState('all')
   const [typeFilter, setTypeFilter] = useState('all')
   const [history, setHistory] = useState([])

   // Load history from localStorage on mount
   useEffect(() => {
      const saved = storage.getVerificationHistory()
      setHistory(saved)
   }, [])

   const deleteItem = (id) => {
      if (window.confirm('Delete this verification record?')) {
         storage.deleteVerificationHistoryItem(id)
         setHistory(history.filter(item => item.id !== id))
         addToast('🗑️ Item deleted', 'info', 2000)
      }
   }

   const clearAllHistory = () => {
      if (window.confirm('Delete all verification history? This cannot be undone.')) {
         storage.clearVerificationHistory()
         setHistory([])
         addToast('🗑️ All history cleared', 'warning', 2000)
      }
   }

   const exportAsCSV = () => {
      const csv = storage.exportHistoryAsCSV(history)
      storage.downloadCSV(csv)
      addToast('📥 History exported as CSV', 'success', 2000)
   }

   const filtered = history.filter(item => {
      const matchesSearch = (item.text || item.url || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesType = typeFilter === 'all' || item.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
   })

   const formatDate = (timestamp) => {
      if (!timestamp) return 'No date'
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (hours < 1) return 'Just now'
      if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
      if (days < 1) return '1 day ago'
      if (days < 7) return `${days} days ago`
      return date.toLocaleDateString()
   }

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

            {history.length > 0 && (
               <div className="space-y-6 mb-8">
                  {/* Search and Filters */}
                  <div className="grid md:grid-cols-4 gap-4">
                     <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                           type="text"
                           placeholder="Search verifications..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                     </div>
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-slate-700 font-medium"
                     >
                        <option value="all">All Status</option>
                        <option value="real">✅ Real</option>
                        <option value="fake">❌ Fake</option>
                        <option value="misleading">⚠️ Misleading</option>
                     </select>
                     <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-slate-700 font-medium"
                     >
                        <option value="all">All Types</option>
                        <option value="text">📝 Text</option>
                        <option value="url">🔗 URL</option>
                        <option value="video">🎥 Video</option>
                     </select>
                  </div>

                  {/* Export and Clear Actions */}
                  <div className="flex flex-wrap gap-3">
                     <button 
                        onClick={exportAsCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100 transition-colors text-sm font-medium"
                     >
                        <Download className="w-4 h-4" /> Export CSV
                     </button>
                     <button 
                        onClick={clearAllHistory}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors text-sm font-medium"
                     >
                        <Trash2 className="w-4 h-4" /> Clear All
                     </button>
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-slate-600">
                     Showing {filtered.length} of {history.length} results
                  </div>
               </div>
            )}

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
               <div className="flex gap-2">
                  <select
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="px-4 py-3 rounded-[1.5rem] border border-[--color-border] bg-white text-sm font-medium text-slate-600 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                     <option value="all">All Status</option>
                     <option value="real">✓ Real</option>
                     <option value="fake">✗ Fake</option>
                     <option value="misleading">⚠ Misleading</option>
                  </select>
                  <select
                     value={typeFilter}
                     onChange={(e) => setTypeFilter(e.target.value)}
                     className="px-4 py-3 rounded-[1.5rem] border border-[--color-border] bg-white text-sm font-medium text-slate-600 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                     <option value="all">All Types</option>
                     <option value="text">📝 Text</option>
                     <option value="url">🔗 URL</option>
                  </select>
               </div>
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

                     return (
                        <div key={item.id} className={`bg-white rounded-[1.5rem] border border-[--color-border] border-l-4 ${config.border} flex flex-col justify-between p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 min-h-[220px] animate-in fade-in slide-in-from-bottom duration-700 fill-mode-both group ${config.glow}`} style={{ animationDelay: `${300 + (idx * 100)}ms` }}>
                           <div>
                              <div className="flex items-center justify-between mb-4">
                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${config.bg} ${config.color}`}>
                                    {config.icon} {t(`report.status.${item.status}`)}
                                 </span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                                    {item.type === 'url' ? <LinkIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                    {formatDate(item.timestamp)}
                                 </span>
                              </div>

                              <p className="line-clamp-3 text-[--color-on-surface] font-bold text-sm mb-6 leading-snug">{item.text || item.url}</p>

                              <div className="flex items-end justify-between mb-4">
                                 <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('history.confidence')}</div>
                                    <div className="text-3xl font-display font-black gradient-text tracking-tighter leading-none">{item.confidence || '—'}%</div>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                              <Link to="/report" state={{ ...item }} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors active:scale-95">
                                 <ArrowRight className="w-3.5 h-3.5" /> View
                              </Link>
                              <button 
                                 onClick={() => deleteItem(item.id)}
                                 className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                 title="Delete"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     )
                  })}
               </div>
            )}
         </div>
      </main>
   )
}

export default History
