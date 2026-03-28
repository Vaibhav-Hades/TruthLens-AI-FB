import React from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Filter, History as HistoryIcon, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const History = () => {
  const { t } = useTranslation()

  const items = [
    { title: 'Global Neural Ingest_X4', date: '28/Mar/2024', status: 'real', confidence: 94 },
    { title: 'DeepSync Claim #X910', date: '27/Mar/2024', status: 'fake', confidence: 88 },
    { title: 'Temporal Analysis: 2024E', date: '25/Mar/2024', status: 'misleading', confidence: 72 },
    { title: 'Source Lineage: VerityHub', date: '24/Mar/2024', status: 'real', confidence: 91 },
    { title: 'Neural Scan: #TL-1940', date: '22/Mar/2024', status: 'fake', confidence: 96 }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'real': return <ShieldCheck className="w-4 h-4 text-green-500" />
      case 'fake': return <XCircle className="w-4 h-4 text-red-500" />
      case 'misleading': return <AlertTriangle className="w-4 h-4 text-amber-500" />
      default: return null
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'real': return 'REAL'
      case 'fake': return 'FAKE'
      case 'misleading': return 'MISLEADING'
      default: return ''
    }
  }

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'real': return 'bg-green-100 text-green-700'
      case 'fake': return 'bg-red-100 text-red-700'
      case 'misleading': return 'bg-amber-100 text-amber-700'
      default: return ''
    }
  }

  return (
    <main className="flex-1 pt-40 pb-20 px-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-right duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
               <HistoryIcon className="w-6 h-6" />
            </div>
            <h1 className="text-5xl font-display font-black text-on-surface tracking-tight">{t('history.title')}</h1>
         </div>
         <Link to="/verify" className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-95 shadow-2xl shadow-primary/30">
            <Plus className="w-5 h-5" /> {t('history.new_btn')}
         </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
         <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by claim title or status..." className="w-full bg-white border border-slate-100 rounded-2xl px-16 py-5 outline-none font-medium focus:border-primary/20 shadow-sm" />
         </div>
         <button className="flex items-center gap-2 px-8 py-5 bg-white border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filters
         </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         {items.map((item, idx) => (
            <Link to="/report" key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5 ghost-border border border-slate-50 group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-2 h-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex justify-between items-start mb-10">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 ${getStatusColorClass(item.status)}`}>
                     {getStatusIcon(item.status)}
                     {getStatusText(item.status)}
                  </div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">{item.date}</div>
               </div>

               <h3 className="text-2xl font-display font-black text-on-surface mb-4 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
               
               <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                     <span className="text-xl font-black text-on-surface tracking-tighter">{item.confidence}%</span>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                     <Plus className="w-5 h-5" />
                  </div>
               </div>
            </Link>
         ))}
      </div>
    </main>
  )
}

export default History
