import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ArrowRight, Zap, Languages, ShieldCheck, Check, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing = () => {
  const { t } = useTranslation()
  const [fill, setFill] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setFill(94), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex-1 w-full relative mesh-bg overflow-hidden">
      <div className="pt-28 pb-12 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000 ease-out fill-mode-both">
            <div className="relative inline-flex items-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-ring"></div>
              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase ghost-border backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t('hero.badge')}
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-display font-black text-[--color-on-surface] leading-[1.05] tracking-tight">
              {t('hero.title_part1')} <br />
              <span className="text-primary italic font-black">{t('hero.title_part2')}</span>
            </h1>

            <p className="text-lg text-[--color-muted] max-w-md leading-relaxed font-medium">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/verify" className="bg-gradient-to-r from-[#0066FF] to-[#0050CB] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/30 flex items-center gap-3 group active:scale-95 hover:scale-[1.02] text-sm">
                <span>{t('hero.cta_main')}</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
              <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-[--color-on-surface] px-8 py-4 rounded-xl font-black uppercase tracking-widest border border-[--color-border] shadow-sm transition-all active:scale-95 hover:-translate-y-0.5 text-sm">
                {t('hero.cta_secondary')}
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-both max-w-sm lg:ml-auto w-full mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent-cyan/10 blur-[80px] rounded-full"></div>

            <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-[--color-border] shadow-xl overflow-hidden animate-float">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[--color-border] to-transparent opacity-50 shimmer-border"></div>

              <div className="flex justify-between items-start mb-8">
                <div className="px-3 py-1.5 bg-[--color-success-light]/50 text-[--color-success] rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 shadow-sm border border-[--color-success]/20">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> VERIFIED REAL
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <div className="h-3 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                <div className="h-3 bg-slate-100 rounded-full w-5/6"></div>
              </div>

              <div className="space-y-3 mb-8 relative">
                <div className="flex justify-between items-end border-t border-slate-100 pt-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[--color-muted]">AI Confidence</span>
                  <span className="text-primary font-display font-black text-4xl leading-none tracking-tight">{fill}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all duration-[2s] ease-out relative" style={{ width: `${fill}%` }}>
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-[--color-muted] uppercase tracking-widest px-1">Sources verified:</span>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center shadow-sm z-30">
                    <span className="text-[8px] font-black text-white">AP</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center shadow-sm z-20">
                    <span className="text-[8px] font-black text-white">RT</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-red-600 flex items-center justify-center shadow-sm z-10">
                    <span className="text-[8px] font-black text-white">BBC</span>
                  </div>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes shimmer-border {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .shimmer-border {
                animation: shimmer-border 3s infinite linear;
              }
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 30s linear infinite;
              }
            `}</style>
          </div>
        </div>
      </div>

      <div className="mt-8 border-y border-[--color-border] bg-white/50 backdrop-blur-md relative overflow-hidden flex py-4 px-6">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[--color-surface] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[--color-surface] to-transparent z-10"></div>

        <div className="max-w-6xl mx-auto w-full relative flex items-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 px-3 py-1.5 bg-red-600 text-white rounded-r-xl rounded-l-sm text-[10px] font-black uppercase tracking-widest shadow-md whitespace-nowrap hidden sm:flex items-center gap-2 border border-red-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            PTI LIVE
          </div>

          <div className="flex animate-marquee whitespace-nowrap gap-8 items-center w-full pl-36">
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="font-body font-semibold text-sm text-[--color-on-surface] hover:text-primary transition-colors cursor-pointer">India dismisses report of Musk joining Modi-Trump call</span>
                <span className="text-red-600/50 font-black">•</span>
                <span className="font-body font-semibold text-sm text-[--color-on-surface] hover:text-primary transition-colors cursor-pointer">Zelensky agrees air defence cooperation with UAE, Qatar on Gulf tour</span>
                <span className="text-red-600/50 font-black">•</span>
                <span className="font-body font-semibold text-sm text-[--color-on-surface] hover:text-primary transition-colors cursor-pointer">Congress appoints 12 vice-presidents, 27 general secretaries in Himachal</span>
                <span className="text-red-600/50 font-black">•</span>
                <span className="font-body font-semibold text-sm text-[--color-on-surface] hover:text-primary transition-colors cursor-pointer">RCB beat Sunrisers Hyderabad by six wickets to win opening game of IPL</span>
                <span className="text-red-600/50 font-black">•</span>
                <span className="font-body font-semibold text-sm text-[--color-on-surface] hover:text-primary transition-colors cursor-pointer">India opposes China-led investment pact in WTO</span>
                <span className="text-red-600/50 font-black">•</span>
                <span className="font-body font-semibold text-sm text-[--color-on-surface] hover:text-primary transition-colors cursor-pointer">EC releases third supplementary voter list in Bengal</span>
                <span className="text-red-600/50 font-black">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-500 fill-mode-both">
        {[
          { title: t('features.trust.title'), desc: t('features.trust.desc'), icon: <Globe className="w-6 h-6 text-white" />, color: 'from-blue-500 to-blue-600', border: 'border-blue-500', glow: 'group-hover:shadow-[0_12px_24px_rgba(59,130,246,0.15)]' },
          { title: t('features.accuracy.title'), desc: t('features.accuracy.desc'), icon: <Zap className="w-6 h-6 text-white" />, color: 'from-[#0066FF] to-[#0050CB]', border: 'border-primary', glow: 'group-hover:shadow-[0_12px_24px_rgba(0,102,255,0.15)]' },
          { title: t('features.multilingual.title'), desc: t('features.multilingual.desc'), icon: <Languages className="w-6 h-6 text-white" />, color: 'from-[#00D1FF] to-[#00A1CC]', border: 'border-accent-cyan', glow: 'group-hover:shadow-[0_12px_24px_rgba(0,209,255,0.15)]' }
        ].map((item, idx) => (
          <div key={idx} className={`bg-white p-8 rounded-[2rem] border border-[--color-border] border-t-4 ${item.border} shadow-sm group hover:-translate-y-1 ${item.glow} transition-all duration-300 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-[1rem] flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-display font-black text-[--color-on-surface] mb-3 tracking-tight">{item.title}</h3>
              <p className="text-sm text-[--color-muted] leading-relaxed font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Section */}
      <div className="bg-slate-50/80 border-t border-[--color-border] pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center md:text-left mb-12 animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-rose-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              {t('trending.label')}
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-black text-[--color-on-surface] tracking-tight mb-4">
              {t('trending.title')}
            </h2>
            <p className="text-lg text-[--color-muted] font-medium max-w-2xl leading-relaxed">
              {t('trending.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              { id: 1, platform: t('trending.platforms.whatsapp'), platformColor: '#25D366', claim: 'New government policy will freeze all bank accounts next week', verdict: 'fake', confidence: 96, shares: '45.2K', time: '1 hr ago' },
              { id: 2, platform: t('trending.platforms.twitter'), platformColor: '#000000', claim: 'Scientists discover cure for diabetes using natural ingredients', verdict: 'misleading', confidence: 78, shares: '23.1K', time: '3 hrs ago' },
              { id: 3, platform: t('trending.platforms.instagram'), platformColor: '#E1306C', claim: 'Election results were manipulated in three states', verdict: 'fake', confidence: 91, shares: '67.8K', time: '5 hrs ago' },
              { id: 4, platform: t('trending.platforms.youtube'), platformColor: '#FF0000', claim: 'RBI announces new 2000 rupee note launch next month', verdict: 'fake', confidence: 88, shares: '34.5K', time: '6 hrs ago' },
              { id: 5, platform: t('trending.platforms.whatsapp'), platformColor: '#25D366', claim: 'Supreme Court ruling on property rights effective immediately', verdict: 'misleading', confidence: 72, shares: '18.9K', time: '8 hrs ago' },
              { id: 6, platform: t('trending.platforms.twitter'), platformColor: '#000000', claim: 'ISRO successfully launches Mars mission ahead of schedule', verdict: 'real', confidence: 94, shares: '89.3K', time: '12 hrs ago' }
            ].map((item, idx) => {

              const verdictMap = {
                real: { color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500', icon: <CheckCircle2 className="w-3 h-3 stroke-[3]" /> },
                fake: { color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500', icon: <ShieldCheck className="w-3 h-3 stroke-[3]" /> },
                misleading: { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500', icon: <ShieldCheck className="w-3 h-3 stroke-[3]" /> }
              }
              const config = verdictMap[item.verdict];

              return (
                <div key={item.id} className="rounded-2xl border border-[--color-border] bg-white shadow-sm p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-both" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-sm flex items-center gap-1.5" style={{ backgroundColor: item.platformColor }}>
                        {item.platform}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[--color-muted]">{item.time}</span>
                    </div>
                    <h4 className="font-bold text-[--color-on-surface] text-lg leading-tight line-clamp-2 mb-6 group-hover:text-primary transition-colors">
                      "{item.claim}"
                    </h4>
                  </div>
                  <div className="pt-5 border-t border-[--color-border] flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${config.color} ${config.bg} border-l-2 ${config.border}`}>
                        {config.icon} {item.verdict} • {item.confidence}%
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-rose-500">🔥</span> {item.shares} <span className="hidden sm:inline">{t('trending.shares')}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Link to="/trending" className="px-8 py-4 bg-white border border-[--color-border] rounded-xl text-xs font-black uppercase tracking-widest text-[--color-on-surface] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 group active:scale-95">
              {t('trending.view_all')}
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div >
    </main >
  )
}

export default Landing
