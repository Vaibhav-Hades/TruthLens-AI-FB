import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck, ShieldX, AlertTriangle, HelpCircle,
  ArrowLeft, Download, Share2, CheckCircle2, Link as LinkIcon,
  FileText, Database, Newspaper, ExternalLink, Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'

// ─── Mock result — replace with actual API response ───────────────────────────
const MOCK_RESULT = {
  summary:
    'A viral video claims that the Indian government announced a complete nationwide lockdown starting 29 March 2026, citing an emergency cabinet meeting. The video further states that all public transport and interstate movement will be suspended indefinitely. No official government communication supports this claim.',
  claim:
    'The Indian government announced a complete nationwide lockdown starting 29 March 2026.',
  verdict: 'FAKE', // REAL | FAKE | MISLEADING | UNVERIFIED
  truthScore: 8,
  confidence: 'HIGH', // HIGH | MEDIUM | LOW
  reason:
    'No PIB (Press Information Bureau) notification or official Ministry of Home Affairs order confirms any lockdown announcement as of 29 March 2026. The claim directly contradicts verified government statements. The video uses out-of-context footage from the 2020 COVID-19 lockdown.',
  matchedSource: 'PIB India — No such announcement found in official press releases',
  inputType: 'youtube', // youtube | text
  inputValue: 'https://www.youtube.com/watch?v=example',
}

// ─── Verdict config ────────────────────────────────────────────────────────────
const VERDICT_CONFIG = {
  REAL: {
    label: 'VERIFIED REAL',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    banner: 'from-emerald-500 to-emerald-400',
    scoreBg: 'from-emerald-400 to-emerald-500',
    emoji: '✅',
  },
  FAKE: {
    label: 'VERIFIED FAKE',
    icon: ShieldX,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    banner: 'from-rose-600 to-rose-500',
    scoreBg: 'from-rose-400 to-rose-500',
    emoji: '❌',
  },
  MISLEADING: {
    label: 'MISLEADING',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    banner: 'from-amber-500 to-amber-400',
    scoreBg: 'from-amber-400 to-amber-500',
    emoji: '⚠️',
  },
  UNVERIFIED: {
    label: 'UNVERIFIED',
    icon: HelpCircle,
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    banner: 'from-slate-500 to-slate-400',
    scoreBg: 'from-slate-400 to-slate-500',
    emoji: '❓',
  },
}

const CONFIDENCE_CONFIG = {
  HIGH:   { color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
  MEDIUM: { color: 'text-amber-600',   bg: 'bg-amber-100',   dot: 'bg-amber-500'   },
  LOW:    { color: 'text-rose-500',    bg: 'bg-rose-100',    dot: 'bg-rose-500'     },
}

const TRUSTED_SOURCES = [
  'PIB India', 'The Hindu', 'NDTV', 'Times of India',
  'Reuters India', 'Election Commission of India',
  'RBI Official', 'NPCI Official', 'WHO India', 'Ministry of Health India',
]

// ─── Sub-components ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-2">
    <span className="w-3 h-px bg-slate-300 inline-block" />
    {children}
    <span className="flex-1 h-px bg-slate-100 inline-block" />
  </div>
)

const TruthScoreBar = ({ score, config }) => {
  const [width, setWidth] = useState(0)
  useEffect(() => { const t = setTimeout(() => setWidth(score), 200); return () => clearTimeout(t) }, [score])

  const getLabel = (s) => {
    if (s >= 90) return 'Fully Verified'
    if (s >= 60) return 'Mostly Real'
    if (s >= 40) return 'Misleading'
    if (s >= 10) return 'Mostly Fake'
    return 'Completely False'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <span className="text-6xl font-display font-black text-[--color-on-surface] tracking-tighter leading-none">
          {score}
          <span className="text-2xl text-slate-300 font-bold">/100</span>
        </span>
        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
          {getLabel(score)}
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${config.scoreBg} rounded-full transition-all duration-[1.8s] ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        <span>0 — False</span>
        <span>50 — Mixed</span>
        <span>100 — Real</span>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const Report = () => {
  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false)
  const result = MOCK_RESULT
  const cfg = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.UNVERIFIED
  const confCfg = CONFIDENCE_CONFIG[result.confidence] || CONFIDENCE_CONFIG.LOW
  const VerdictIcon = cfg.icon

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="flex-1 w-full bg-slate-50 relative overflow-hidden">

      {/* ── Verdict Banner ── */}
      <div className={`pt-32 pb-10 bg-gradient-to-r ${cfg.banner} text-white animate-in fade-in slide-in-from-top duration-700`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <VerdictIcon className="w-9 h-9 text-white" />
              </div>
              <div>
                <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Verdict</div>
                <h2 className="text-4xl font-display font-black tracking-tight leading-none">
                  {cfg.emoji} {cfg.label}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 border border-white/20`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${confCfg.dot} animate-pulse`} />
                    {result.confidence} CONFIDENCE
                  </span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    Truth Score: {result.truthScore}/100
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/verify"
              className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors rounded-xl text-xs font-bold uppercase tracking-widest text-white border border-white/10 shadow-lg active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> New Scan
            </Link>
          </div>
        </div>
      </div>

      {/* ── Input Badge ── */}
      <div className="max-w-6xl mx-auto px-6 -mt-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-500">
          {result.inputType === 'youtube'
            ? <><Activity className="w-3.5 h-3.5 text-rose-500" /> YouTube Video Analyzed</>
            : <><FileText className="w-3.5 h-3.5 text-primary" /> Text Claim Analyzed</>
          }
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{result.inputValue}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-both">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* SUMMARY */}
            <div className="bg-white p-8 rounded-[2rem] border border-[--color-border] shadow-sm">
              <SectionLabel>Summary</SectionLabel>
              <p className="text-[--color-on-surface] text-base leading-relaxed font-medium">
                {result.summary}
              </p>
            </div>

            {/* CLAIM DETECTED */}
            <div className={`p-8 rounded-[2rem] border-2 ${cfg.border} ${cfg.bg}`}>
              <SectionLabel>Claim Detected</SectionLabel>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{cfg.emoji}</span>
                <p className={`text-lg font-bold leading-snug ${cfg.color}`}>
                  "{result.claim}"
                </p>
              </div>
            </div>

            {/* TRUTH SCORE */}
            <div className="bg-white p-8 rounded-[2rem] border border-[--color-border] shadow-sm">
              <SectionLabel>Truth Score</SectionLabel>
              <TruthScoreBar score={result.truthScore} config={cfg} />

              {/* Score legend */}
              <div className="mt-6 grid grid-cols-5 gap-2">
                {[
                  { range: '90–100', label: 'Verified', color: 'bg-emerald-400' },
                  { range: '60–89',  label: 'Mostly Real', color: 'bg-lime-400' },
                  { range: '40–59',  label: 'Misleading',  color: 'bg-amber-400' },
                  { range: '10–39',  label: 'Mostly Fake', color: 'bg-orange-400' },
                  { range: '0–9',    label: 'Completely False', color: 'bg-rose-500' },
                ].map((item) => (
                  <div key={item.range} className="flex flex-col items-center gap-1 text-center">
                    <div className={`w-full h-1.5 rounded-full ${item.color}`} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight">{item.range}</span>
                    <span className="text-[9px] text-slate-300 leading-tight hidden sm:block">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REASON */}
            <div className="bg-white p-8 rounded-[2rem] border border-[--color-border] shadow-sm">
              <SectionLabel>Reason for Verdict</SectionLabel>
              <p className="text-[--color-on-surface] text-base leading-relaxed font-medium">
                {result.reason}
              </p>
            </div>

            {/* MATCHED SOURCE */}
            <div className="bg-white p-8 rounded-[2rem] border border-[--color-border] shadow-sm">
              <SectionLabel>Matched Source</SectionLabel>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary shrink-0">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[--color-on-surface] font-bold text-base">{result.matchedSource}</p>
                  <p className="text-xs text-[--color-muted] font-medium mt-1">
                    Cross-referenced against {TRUSTED_SOURCES.length} trusted Indian news databases
                  </p>
                </div>
              </div>

              {/* Source chips */}
              <div className="flex flex-wrap gap-2 mt-5">
                {TRUSTED_SOURCES.map((src) => {
                  const isMatched = result.matchedSource.includes(src)
                  return (
                    <span
                      key={src}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors ${
                        isMatched
                          ? `${cfg.bg} ${cfg.color} ${cfg.border}`
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}
                    >
                      {isMatched && <span className="mr-1">{cfg.emoji}</span>}
                      {src}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">

            {/* Verdict Card */}
            <div className={`p-8 rounded-[2rem] border-2 ${cfg.border} ${cfg.bg} flex flex-col items-center text-center gap-4`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cfg.bg} border-2 ${cfg.border} shadow-sm`}>
                <VerdictIcon className={`w-9 h-9 ${cfg.color}`} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Final Verdict</div>
                <div className={`text-2xl font-display font-black ${cfg.color}`}>{cfg.emoji} {cfg.label}</div>
              </div>
              <div className={`w-full px-4 py-2.5 rounded-xl ${confCfg.bg} flex items-center justify-center gap-2`}>
                <span className={`w-2 h-2 rounded-full ${confCfg.dot} animate-pulse`} />
                <span className={`text-xs font-black uppercase tracking-widest ${confCfg.color}`}>
                  {result.confidence} CONFIDENCE
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white p-7 rounded-[2rem] border border-[--color-border] shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> Scan Metadata
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Ingestion ID',    val: 'TL-X920-V' },
                  { label: 'Scan Depth',      val: 'Neural L4 (Deep)' },
                  { label: 'Input Type',      val: result.inputType === 'youtube' ? 'YouTube Video' : 'Plain Text' },
                  { label: 'Language',        val: i18n.language.toUpperCase() },
                  { label: 'Sources Checked', val: `${TRUSTED_SOURCES.length} databases` },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</span>
                    <span className="text-xs font-mono font-black text-[--color-on-surface]">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="bg-white p-7 rounded-[2rem] border border-[--color-border] shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 text-center">Share Report</div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-50 hover:bg-slate-100 border border-[--color-border] rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4 text-slate-400" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post to X
                </button>
              </div>
            </div>

            {/* New Scan CTA */}
            <Link
              to="/verify"
              className="flex flex-col items-center text-center gap-4 p-7 bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2rem] border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div>
                <div className="font-display font-black text-[--color-on-surface] text-sm mb-1">Run Another Scan</div>
                <div className="text-xs text-[--color-muted] font-medium">Paste a new claim or YouTube link</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Report
