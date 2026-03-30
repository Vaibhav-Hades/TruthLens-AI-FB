import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useGlobalToast } from '../context/ToastContext'
import { analyzeAll, logVerification } from '../utils/analysisApi'

const Report = () => {
   const { t, i18n } = useTranslation()
   const { addToast } = useGlobalToast()
   const location = useLocation()
   const { text } = location.state || { text: '' }

   const [analysis, setAnalysis] = useState(null)
   const [loading, setLoading] = useState(false)
   const [credibilityScore, setCredibilityScore] = useState(0)

   useEffect(() => {
      if (text && text.length > 0) {
         performAnalysis()
      }
   }, [text])

   const performAnalysis = async () => {
      setLoading(true)
      try {
         const result = await analyzeAll(text, 'en', true, true)
         setAnalysis(result)
         
         // Calculate credibility score
         let score = 70
         if (result.sentiment) {
            score -= (result.sentiment.manipulation_tactics?.length || 0) * 5
            score -= (result.sentiment.bias_indicators?.length || 0) * 3
         }
         setCredibilityScore(Math.max(0, Math.min(100, score)))
         addToast('✅ Analysis complete!', 'success')
      } catch (error) {
         console.error('Analysis error:', error)
         addToast('❌ Analysis failed', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleLogVerification = async (status) => {
      try {
         await logVerification(text, status, 'report')
         addToast(`✅ Logged as ${status.toUpperCase()}`, 'success')
      } catch (error) {
         console.error('Error logging:', error)
      }
   }

   const exportReport = () => {
      const report = `TRUTHLENS VERIFICATION REPORT
Date: ${new Date().toLocaleString()}
Score: ${credibilityScore}/100

TEXT: ${text}

SENTIMENT: ${analysis?.sentiment?.sentiment || 'N/A'}
CONFIDENCE: ${analysis?.sentiment?.confidence || 0}%

EMOTIONS: ${Object.entries(analysis?.sentiment?.emotions || {}).map(([e, s]) => `${e}:${s}%`).join(', ')}

BIAS: ${analysis?.sentiment?.bias_indicators?.join(', ') || 'None'}

TACTICS: ${analysis?.sentiment?.manipulation_tactics?.join(', ') || 'None'}

FACTS EXTRACTED: ${analysis?.facts?.facts?.length || 0}
${analysis?.facts?.facts?.map((f, i) => `${i+1}. "${f.claim}" [${f.category}] (${f.confidence}%)`).join('\n')}
      `.trim()

      const blob = new Blob([report], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${Date.now()}.txt`
      a.click()
      addToast('📥 Report downloaded', 'success')
   }

   if (!text) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
               <h1 className="text-3xl font-bold text-white mb-4">No Report</h1>
               <p className="text-slate-400">Verify a claim first.</p>
            </div>
         </div>
      )
   }

   const score = credibilityScore

   const conclusion = score >= 70 ? 'LIKELY REAL' : score >= 40 ? 'NEEDS VERIFICATION' : 'LIKELY FAKE'
   const colorClass = score > 70 ? 'text-emerald-500' : (score > 40 ? 'text-yellow-500' : 'text-red-500')
   const bannerBg = score > 70 ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' : (score > 40 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' : 'bg-gradient-to-r from-red-600 to-red-500')

   return (
      <main className="flex-1 w-full bg-slate-900 relative overflow-hidden min-h-screen">
         {/* Verdict Banner */}
         <div className={`pt-20 pb-8 text-white transition-all duration-700 ${bannerBg}`}>
            <div className="max-w-6xl mx-auto px-6">
               <div className="flex items-center gap-5 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                     {score > 70 ? <CheckCircle size={32} /> : score > 40 ? <AlertTriangle size={32} /> : <XCircle size={32} />}
                  </div>
                  <div>
                     <h2 className="text-4xl font-black tracking-tight">{conclusion}</h2>
                     <p className="text-white/80 text-sm font-bold uppercase tracking-widest">TruthLens Analysis</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Credibility Score Card */}
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-8 mb-8">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-slate-400 text-sm mb-2 font-bold">CREDIBILITY SCORE</p>
                     <p className="text-6xl font-black text-cyan-400">{score}</p>
                     <p className="text-slate-300 mt-1">/100</p>
                  </div>
                  <div className={`text-8xl ${colorClass}`}>{score >= 70 ? '✓' : score >= 40 ? '?' : '✗'}</div>
               </div>
            </div>

            {/* Analyzed Text */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 mb-8">
               <h3 className="text-lg font-bold text-white mb-3">🔍 Analyzed Text</h3>
               <p className="text-slate-300 italic leading-relaxed">{text}</p>
            </div>

            {loading ? (
               <div className="text-center py-16">
                  <div className="inline-block animate-spin text-cyan-400 text-4xl">⚙️</div>
                  <p className="text-slate-300 mt-4">Analyzing content...</p>
               </div>
            ) : analysis ? (
               <>
                  {/* Sentiment Analysis */}
                  {analysis.sentiment && (
                     <div className="bg-slate-800/30 border border-purple-500/20 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-bold text-white mb-6">😊 Sentiment Analysis</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                           <div className="bg-slate-900/50 rounded-lg p-4">
                              <p className="text-slate-400 text-xs font-bold mb-1">SENTIMENT</p>
                              <p className="text-2xl font-bold text-purple-300 capitalize">{analysis.sentiment.sentiment}</p>
                           </div>
                           <div className="bg-slate-900/50 rounded-lg p-4">
                              <p className="text-slate-400 text-xs font-bold mb-1">CONFIDENCE</p>
                              <p className="text-2xl font-bold text-purple-300">{analysis.sentiment.confidence}%</p>
                           </div>
                        </div>

                        {/* Emotions */}
                        <div className="mb-6">
                           <h4 className="font-semibold text-white mb-3 text-sm">Emotions Detected</h4>
                           <div className="space-y-2">
                              {Object.entries(analysis.sentiment.emotions || {}).map(([emotion, value]) => (
                                 <div key={emotion} className="flex items-center gap-3">
                                    <span className="text-slate-400 text-sm w-20">{emotion}</span>
                                    <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                       <div className={`h-full ${value > 50 ? 'bg-red-500' : value > 25 ? 'bg-yellow-500' : 'bg-slate-600'}`} style={{width: `${value}%`}} />
                                    </div>
                                    <span className="text-slate-300 text-sm w-10 text-right">{value}%</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Bias & Tactics */}
                        {(analysis.sentiment.bias_indicators?.length > 0 || analysis.sentiment.manipulation_tactics?.length > 0) && (
                           <div className="grid md:grid-cols-2 gap-4">
                              {analysis.sentiment.bias_indicators?.length > 0 && (
                                 <div>
                                    <h4 className="font-semibold text-yellow-300 mb-2 text-sm flex items-center gap-2">
                                       <AlertTriangle size={16} /> Bias Indicators
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                       {analysis.sentiment.bias_indicators.map((b, i) => (
                                          <span key={i} className="bg-yellow-500/20 text-yellow-200 text-xs px-2 py-1 rounded border border-yellow-500/30">
                                             {b}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              )}
                              {analysis.sentiment.manipulation_tactics?.length > 0 && (
                                 <div>
                                    <h4 className="font-semibold text-red-300 mb-2 text-sm flex items-center gap-2">
                                       <AlertTriangle size={16} /> Manipulation Tactics
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                       {analysis.sentiment.manipulation_tactics.map((t, i) => (
                                          <span key={i} className="bg-red-500/20 text-red-200 text-xs px-2 py-1 rounded border border-red-500/30">
                                             {t}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  )}

                  {/* Facts Extraction */}
                  {analysis.facts?.facts && analysis.facts.facts.length > 0 && (
                     <div className="bg-slate-800/30 border border-blue-500/20 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-bold text-white mb-4">📋 Extracted Facts ({analysis.facts.facts.length})</h3>
                        <div className="space-y-3">
                           {analysis.facts.facts.map((fact, idx) => (
                              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                 <div className="flex items-start justify-between mb-2">
                                    <p className="font-semibold text-white flex-1">{fact.claim}</p>
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 ml-2 whitespace-nowrap">
                                       {fact.category}
                                    </span>
                                 </div>
                                 <div className="text-xs text-slate-400">
                                    Confidence: <span className="text-blue-300 font-semibold">{fact.confidence}%</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Recommendation */}
                  <div className={`rounded-xl p-6 mb-8 border ${
                     score >= 70 ? 'bg-green-900/20 border-green-500/20' : score >= 40 ? 'bg-yellow-900/20 border-yellow-500/20' : 'bg-red-900/20 border-red-500/20'
                  }`}>
                     <h3 className="text-lg font-bold text-white mb-2">💡 Recommendation</h3>
                     <p className={`text-sm ${score >= 70 ? 'text-green-200' : score >= 40 ? 'text-yellow-200' : 'text-red-200'}`}>
                        {score >= 70
                           ? 'This content appears credible. Verify independently with trusted sources.'
                           : score >= 40
                           ? 'This content shows mixed signals. Cross-check multiple reliable sources.'
                           : 'This content shows high manipulation indicators. Exercise extreme caution.'}
                     </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                     <button onClick={exportReport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                        <Download size={18} /> Export
                     </button>
                     <button onClick={() => handleLogVerification('real')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                        <CheckCircle size={18} /> Real
                     </button>
                     <button onClick={() => handleLogVerification('fake')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                        <XCircle size={18} /> Fake
                     </button>
                     <button onClick={() => handleLogVerification('misleading')} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition">
                        <AlertTriangle size={18} /> Misleading
                     </button>
                  </div>
               </>
            ) : (
               <div className="text-center py-12">
                  <p className="text-slate-400">Analysis will appear here</p>
               </div>
            )}
         </div>
      </main>
   )
}

export default Report
