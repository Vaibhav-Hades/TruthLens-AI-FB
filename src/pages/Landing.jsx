import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ArrowRight, Zap, Languages } from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing = () => {
  const { t, i18n } = useTranslation()

  return (
    <main className="flex-1 pt-40 pb-20 px-6 max-w-7xl mx-auto w-full relative">
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 left-0 -z-10 w-64 h-64 bg-accent-cyan/5 blur-3xl rounded-full"></div>

      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10 animate-in fade-in slide-in-from-left duration-1000 ease-out">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.2em] uppercase ghost-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t('hero.badge')}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-black text-on-surface leading-[0.95] tracking-tighter">
            {t('hero.title_part1')} <br />
            <span className="text-primary italic font-black">{t('hero.title_part2')}</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <Link to="/verify" className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-primary/40 flex items-center gap-3 group active:scale-95 text-center">
              {t('hero.cta_main')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-white hover:bg-surface-container text-on-surface px-10 py-5 rounded-2xl font-black uppercase tracking-widest border-2 border-slate-100 transition-all active:scale-95">
              {t('hero.cta_secondary')}
            </button>
          </div>
        </div>

        <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="bg-slate-900 p-3 rounded-[3rem] shadow-2xl relative group overflow-hidden">
             <div className="aspect-[4/3] bg-[#0A0C10] rounded-[2.5rem] overflow-hidden border border-slate-800 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute top-10 left-10 w-20 h-20 border border-primary/30 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                   <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-12 h-12 text-primary fill-primary/20" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">TruthLens Insight_v4</h3>
                     <p className="text-xs text-primary font-black uppercase tracking-[0.3em] uppercase">{i18n.language === 'en' ? 'Scanning Global Neural Networks' : 'वैश्विक तंत्रिका नेटवर्क स्कैनिंग'}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-48 grid md:grid-cols-3 gap-10">
         {[
           { title: t('features.trust.title'), desc: t('features.trust.desc'), icon: <Globe className="w-8 h-8" />, color: 'bg-blue-500' },
           { title: t('features.accuracy.title'), desc: t('features.accuracy.desc'), icon: <Zap className="w-8 h-8" />, color: 'bg-primary' },
           { title: t('features.multilingual.title'), desc: t('features.multilingual.desc'), icon: <Languages className="w-8 h-8" />, color: 'bg-accent-cyan' }
         ].map((item, idx) => (
           <div key={idx} className="bg-white p-10 rounded-[2rem] group hover:-translate-y-2 transition-all duration-500 border border-slate-50 hover:shadow-2xl hover:shadow-primary/5">
             <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
               {item.icon}
             </div>
             <h3 className="text-2xl font-display font-bold text-on-surface mb-4 tracking-tight">{item.title}</h3>
             <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
           </div>
         ))}
      </div>
    </main>
  )
}

export default Landing
