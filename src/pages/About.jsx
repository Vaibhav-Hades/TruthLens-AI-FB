import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Eye, Target, X, Zap } from 'lucide-react';

const About = () => {
    const { t } = useTranslation();

    return (
        <main className="flex-1 w-full relative mesh-bg min-h-screen pt-40 pb-20 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Hero Section */}
                <div className="text-center md:text-left mb-16 animate-in fade-in slide-in-from-bottom duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase mb-6 ghost-border">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        {t('about.label')}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-[--color-on-surface] tracking-tight mb-6 max-w-2xl leading-[1.1]">
                        {t('about.title')}
                    </h1>
                    <p className="text-lg text-[--color-muted] font-medium max-w-2xl leading-relaxed">
                        {t('about.subtitle')}
                    </p>
                </div>

                {/* Mission + Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-16 animate-in fade-in slide-in-from-bottom duration-1000 delay-200 fill-mode-both">
                    <div className="rounded-2xl border border-[--color-border] bg-white shadow-sm p-8 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-display font-black text-[--color-on-surface] mb-3">{t('about.mission.title')}</h3>
                        <p className="text-[--color-muted] leading-relaxed text-sm font-medium">{t('about.mission.desc')}</p>
                    </div>

                    <div className="rounded-2xl border border-[--color-border] bg-white shadow-sm p-8 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-display font-black text-[--color-on-surface] mb-3">{t('about.vision.title')}</h3>
                        <p className="text-[--color-muted] leading-relaxed text-sm font-medium">{t('about.vision.desc')}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-in fade-in slide-in-from-bottom duration-1000 delay-300 fill-mode-both">
                    <div className="bg-slate-50 border border-[--color-border] rounded-[1.5rem] p-6 text-center shadow-sm">
                        <div className="text-4xl font-display font-black text-slate-700 tracking-tighter mb-1">48+</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#0066FF]">{t('about.stats.sources')}</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[1.5rem] p-6 text-center shadow-sm">
                        <div className="text-4xl font-display font-black text-emerald-700 tracking-tighter mb-1">5</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{t('about.stats.languages')}</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-[1.5rem] p-6 text-center shadow-sm">
                        <div className="text-4xl font-display font-black text-purple-700 tracking-tighter mb-1">94%</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600">{t('about.stats.accuracy')}</div>
                    </div>
                </div>

                {/* Limitations */}
                <div className="bg-white/90 backdrop-blur-xl border border-[--color-border] rounded-[2rem] p-8 shadow-sm mb-16 animate-in fade-in slide-in-from-bottom duration-1000 delay-500 fill-mode-both">
                    <h3 className="text-xl font-display font-black text-[--color-on-surface] mb-6 flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                        {t('about.limitations.title')}
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-4 text-sm font-medium text-[--color-muted]">
                            <div className="mt-0.5 bg-rose-100 text-rose-600 rounded-full p-1 border border-rose-200 shadow-sm"><X className="w-3 h-3 stroke-[3]" /></div>
                            {t('about.limitations.item1')}
                        </li>
                        <li className="flex items-start gap-4 text-sm font-medium text-[--color-muted]">
                            <div className="mt-0.5 bg-rose-100 text-rose-600 rounded-full p-1 border border-rose-200 shadow-sm"><X className="w-3 h-3 stroke-[3]" /></div>
                            {t('about.limitations.item2')}
                        </li>
                        <li className="flex items-start gap-4 text-sm font-medium text-[--color-muted]">
                            <div className="mt-0.5 bg-rose-100 text-rose-600 rounded-full p-1 border border-rose-200 shadow-sm"><X className="w-3 h-3 stroke-[3]" /></div>
                            {t('about.limitations.item3')}
                        </li>
                    </ul>
                </div>

                {/* Future Scope */}
                <div className="mb-20 animate-in fade-in slide-in-from-bottom duration-1000 delay-700 fill-mode-both">
                    <h3 className="text-lg font-display font-black text-[--color-on-surface] mb-6 flex items-center gap-3">
                        <Zap className="w-5 h-5 text-amber-500" />
                        {t('about.future.title')}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {[t('about.future.i1'), t('about.future.i2'), t('about.future.i3'), t('about.future.i4')].map((item, i) => (
                            <div key={i} className="px-5 py-2.5 bg-white border border-[--color-border] rounded-full text-xs font-bold text-slate-600 tracking-wider shadow-sm hover:border-primary/50 transition-colors uppercase">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team/Hackathon Note */}
                <div className="border-t border-[--color-border] pt-10 text-center flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#0066FF] mb-6 bg-[#0066FF]/10 inline-block px-4 py-2 rounded-full border border-blue-100">
                        {t('about.hackathon')}
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 text-[--color-on-surface] mt-2">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-slate-50 border border-[--color-border] flex items-center justify-center text-slate-600 font-display font-black text-xl shadow-sm">AK</div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Arun Kumar</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-slate-50 border border-[--color-border] flex items-center justify-center text-slate-600 font-display font-black text-xl shadow-sm">AC</div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Adithya Charan</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};
export default About;
