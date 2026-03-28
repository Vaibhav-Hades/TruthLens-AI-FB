import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, ShieldCheck, AlertTriangle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import {
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts'

const languageData = [
    { language: 'English', scans: 312 },
    { language: 'Hindi', scans: 178 },
    { language: 'Telugu', scans: 89 },
    { language: 'Tamil', scans: 47 },
    { language: 'Bengali', scans: 25 },
]

const Analytics = () => {
    const { t } = useTranslation()
    const [activeFilter, setActiveFilter] = useState('week')

    const verdictData = [
        { name: t('report.status.real'), value: 342, color: '#16A34A' },
        { name: t('report.status.fake'), value: 184, color: '#DC2626' },
        { name: t('report.status.misleading'), value: 125, color: '#D97706' },
    ]

    const activityData = [
        { day: t('analytics.days.mon'), scans: 45 }, { day: t('analytics.days.tue'), scans: 82 },
        { day: t('analytics.days.wed'), scans: 61 }, { day: t('analytics.days.thu'), scans: 110 },
        { day: t('analytics.days.fri'), scans: 94 }, { day: t('analytics.days.sat'), scans: 73 },
        { day: t('analytics.days.sun'), scans: 88 }
    ]

    const confidenceData = [
        { range: t('analytics.ranges.r1'), count: 12, color: '#DC2626' },
        { range: t('analytics.ranges.r2'), count: 28, color: '#F97316' },
        { range: t('analytics.ranges.r3'), count: 67, color: '#D97706' },
        { range: t('analytics.ranges.r4'), count: 198, color: '#65A30D' },
        { range: t('analytics.ranges.r5'), count: 346, color: '#16A34A' },
    ]

    const totalScans = verdictData.reduce((acc, curr) => acc + curr.value, 0)

    const stats = [
        { title: t('analytics.stats.total'), value: totalScans, change: '+12.5%', isUp: true, icon: <Activity className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50 border-blue-100', border: 'border-l-blue-500' },
        { title: t('analytics.stats.real'), value: 342, change: '+5.2%', isUp: true, icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100', border: 'border-l-emerald-500' },
        { title: t('analytics.stats.fake'), value: 184, change: '-2.1%', isUp: false, icon: <XCircle className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50 border-rose-100', border: 'border-l-rose-500' },
        { title: t('analytics.stats.misleading'), value: 125, change: '+8.4%', isUp: true, icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-100', border: 'border-l-amber-500' }
    ]

    const filters = [
        { id: 'today', label: t('analytics.filters.today') },
        { id: 'week', label: t('analytics.filters.week') },
        { id: 'month', label: t('analytics.filters.month') },
        { id: 'all', label: t('analytics.filters.all') }
    ]

    return (
        <main className="flex-1 w-full relative mesh-bg min-h-screen pt-40 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-left duration-1000 fill-mode-both">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-black text-[--color-on-surface] tracking-tight mb-3">{t('analytics.title')}</h1>
                        <p className="text-[--color-muted] font-medium text-sm max-w-lg">{t('analytics.subtitle')}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-wrap">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${activeFilter === filter.id ? 'bg-primary text-white shadow-md border border-primary' : 'bg-white border border-[--color-border] text-[--color-muted] hover:border-primary/50'}`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-200 fill-mode-both">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`bg-white rounded-2xl border border-[--color-border] border-l-4 ${stat.border} p-6 shadow-sm hover:-translate-y-1 transition-transform duration-300`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex-1">{stat.title}</h3>
                            </div>
                            <div className="flex items-end justify-between mt-auto">
                                <div className="font-display font-black text-4xl text-[--color-on-surface] tracking-tighter leading-none">{stat.value.toLocaleString()}</div>
                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg ${stat.isUp ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'}`}>
                                    {stat.isUp ? <TrendingUp className="w-3 h-3 stroke-[3]" /> : <TrendingDown className="w-3 h-3 stroke-[3]" />}
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-300 fill-mode-both">

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col relative w-full overflow-hidden">
                        <h3 className="font-display font-bold text-lg text-[--color-on-surface] mb-1">{t('analytics.charts.verdict_dist')}</h3>
                        <p className="text-xs text-[--color-muted] mb-4">{t('analytics.charts.verdict_subtitle')}</p>

                        <div className="w-full relative flex-1 min-h-[280px]">
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie data={verdictData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                                        {verdictData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '500' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 top-[-36px] flex flex-col items-center justify-center pointer-events-none">
                                <span className="font-display font-black text-3xl text-[--color-on-surface] leading-none mb-1">{totalScans}</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{t('analytics.total')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col w-full overflow-hidden">
                        <h3 className="font-display font-bold text-lg text-[--color-on-surface] mb-1">{t('analytics.charts.activity')}</h3>
                        <p className="text-xs text-[--color-muted] mb-4">{t('analytics.charts.activity_subtitle')}</p>

                        <div className="w-full flex-1 min-h-[280px]">
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="scans" stroke="#0066FF" strokeWidth={2.5} fill="url(#scanGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col w-full overflow-hidden">
                        <h3 className="font-display font-bold text-lg text-[--color-on-surface] mb-1">{t('analytics.charts.confidence')}</h3>
                        <p className="text-xs text-[--color-muted] mb-4">{t('analytics.charts.confidence_subtitle')}</p>

                        <div className="w-full flex-1 min-h-[280px]">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={confidenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                                    <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                        {confidenceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col w-full overflow-hidden">
                        <h3 className="font-display font-bold text-lg text-[--color-on-surface] mb-1">{t('analytics.charts.language')}</h3>
                        <p className="text-xs text-[--color-muted] mb-4">{t('analytics.charts.language_subtitle')}</p>

                        <div className="w-full flex-1 min-h-[280px]">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={languageData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                                    <YAxis dataKey="language" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} width={70} />
                                    <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="scans" fill="#0066FF" radius={[0, 6, 6, 0]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default Analytics
