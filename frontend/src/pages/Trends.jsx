import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, RefreshCw, BarChart3, Users, Clock, Search } from 'lucide-react'
import { useGlobalToast } from '../context/ToastContext'
import { getTrends } from '../utils/analysisApi'

const Trends = () => {
   const { t } = useTranslation()
   const { addToast } = useGlobalToast()
   const [trends, setTrends] = useState(null)
   const [loading, setLoading] = useState(true)
   const [searchKeyword, setSearchKeyword] = useState('')
   const [filterVerdictBy, setFilterVerdictBy] = useState('all')

   useEffect(() => {
      loadTrends()
   }, [])

   const loadTrends = async () => {
      setLoading(true)
      try {
         const data = await getTrends()
         setTrends(data)
         addToast('✅ Trends loaded!', 'success')
      } catch (error) {
         console.error('Error loading trends:', error)
         addToast('❌ Could not load trends', 'error')
      } finally {
         setLoading(false)
      }
   }

   // Filter keywords based on search
   const filteredKeywords = trends?.trending_keywords?.filter(kw => {
      const keyword = kw.keyword || kw
      const matchesSearch = keyword.toLowerCase().includes(searchKeyword.toLowerCase())
      
      if (filterVerdictBy === 'all') return matchesSearch
      const verdict = kw.verdicts?.[filterVerdictBy] || 0
      return matchesSearch && verdict > 0
   }) || []

   // Filter sources based on search
   const filteredSources = trends?.trending_sources?.filter(src => {
      const source = src.source || src
      return source.toLowerCase().includes(searchKeyword.toLowerCase())
   }) || []

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
               <div className="inline-block animate-spin text-cyan-400 text-5xl mb-4">⚙️</div>
               <p className="text-slate-400">Loading trends...</p>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
         <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <TrendingUp size={32} className="text-cyan-400" />
                     <h1 className="text-4xl font-bold text-white">📊 Fact-Check Trends</h1>
                  </div>
                  <button
                     onClick={loadTrends}
                     className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
                  >
                     <RefreshCw size={18} /> Refresh
                  </button>
               </div>
               <p className="text-slate-400">Real-time analysis of trending claims and verification patterns</p>
            </div>

            {trends ? (
               <div className="space-y-8">
                  {/* Search and Filter */}
                  <div className="grid md:grid-cols-3 gap-4 pb-6 border-b border-slate-700">
                     <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                           type="text"
                           placeholder="Search keywords and sources..."
                           value={searchKeyword}
                           onChange={(e) => setSearchKeyword(e.target.value)}
                           className="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-slate-400"
                        />
                     </div>
                     <select
                        value={filterVerdictBy}
                        onChange={(e) => setFilterVerdictBy(e.target.value)}
                        className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-300 font-medium"
                     >
                        <option value="all">All Verdicts</option>
                        <option value="real">✅ Real Only</option>
                        <option value="fake">❌ Fake Only</option>
                        <option value="misleading">⚠️ Misleading Only</option>
                     </select>
                  </div>

                  {/* Trending Keywords */}
                  {filteredKeywords.length > 0 ? (
                     <div className="bg-slate-800/40 border border-purple-500/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                           <BarChart3 size={24} className="text-purple-400" />
                           🔍 Trending Keywords
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {filteredKeywords.map((kw, idx) => (
                              <div key={idx} className="bg-slate-900/50 rounded-lg p-5 border border-slate-700 hover:border-purple-500/50 transition">
                                 <div className="flex items-start justify-between mb-3">
                                    <p className="font-semibold text-white flex-1 break-words">{kw.keyword || kw}</p>
                                    <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 ml-2 whitespace-nowrap">
                                       {kw.count || 0}x
                                    </span>
                                 </div>
                                 {kw.verdicts && (
                                    <div className="flex gap-2 text-xs">
                                       {Object.entries(kw.verdicts).map(([verdict, count]) => (
                                          <span key={verdict} className={`px-2 py-1 rounded ${
                                             verdict === 'real' ? 'bg-green-500/20 text-green-300' :
                                             verdict === 'fake' ? 'bg-red-500/20 text-red-300' :
                                             'bg-yellow-500/20 text-yellow-300'
                                          }`}>
                                             {verdict}: {count}
                                          </span>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="bg-slate-800/40 border border-purple-500/20 rounded-xl p-6 text-center text-slate-400">
                        No keywords match your search
                     </div>
                  )}

                  {/* Trending Sources */}
                  {filteredSources.length > 0 ? (
                     <div className="bg-slate-800/40 border border-blue-500/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                           <Users size={24} className="text-blue-400" />
                           📰 Most-Cited Sources
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                           {filteredSources.map((src, idx) => (
                              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 transition flex items-center justify-between">
                                 <p className="font-semibold text-white">{src.source || src}</p>
                                 <span className="text-lg font-bold text-blue-300">{src.count || 0}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="bg-slate-800/40 border border-blue-500/20 rounded-xl p-6 text-center text-slate-400">
                        No sources match your search
                     </div>
                  )}

                  {/* Recent Verifications */}
                  {trends.recent_verifications && trends.recent_verifications.length > 0 && (
                     <div className="bg-slate-800/40 border border-green-500/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                           <Clock size={24} className="text-green-400" />
                           ⏱️ Recent Verifications
                        </h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                           {trends.recent_verifications.map((ver, idx) => (
                              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                 <div className="flex items-start justify-between mb-2">
                                    <p className="text-white font-semibold flex-1 break-words">{ver.claim}</p>
                                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                                       ver.verdict === 'real' ? 'bg-green-500/20 text-green-300' :
                                       ver.verdict === 'fake' ? 'bg-red-500/20 text-red-300' :
                                       'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                       {ver.verdict?.toUpperCase()}
                                    </span>
                                 </div>
                                 {ver.timestamp && (
                                    <p className="text-xs text-slate-400">{new Date(ver.timestamp).toLocaleString()}</p>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Verdict Distribution */}
                  {trends.verdict_distribution && (
                     <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">📊 Verdict Distribution</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                           <div className="bg-green-900/20 rounded-lg p-6 border border-green-500/30 text-center">
                              <p className="text-green-300 text-4xl font-bold">{trends.verdict_distribution.real || 0}</p>
                              <p className="text-green-300 text-sm mt-2 font-semibold">✅ Real Claims</p>
                           </div>
                           <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30 text-center">
                              <p className="text-red-300 text-4xl font-bold">{trends.verdict_distribution.fake || 0}</p>
                              <p className="text-red-300 text-sm mt-2 font-semibold">❌ Fake Claims</p>
                           </div>
                           <div className="bg-yellow-900/20 rounded-lg p-6 border border-yellow-500/30 text-center">
                              <p className="text-yellow-300 text-4xl font-bold">{trends.verdict_distribution.misleading || 0}</p>
                              <p className="text-yellow-300 text-sm mt-2 font-semibold">⚠️ Misleading</p>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Last Updated */}
                  <div className="text-center text-slate-400 text-sm">
                     <p>Data updates in real-time as users verify claims</p>
                     <p className="mt-2">Last refreshed: {new Date().toLocaleTimeString()}</p>
                  </div>
               </div>
            ) : (
               <div className="text-center py-12">
                  <p className="text-slate-400 text-lg">No trend data available yet</p>
                  <p className="text-slate-500 text-sm mt-2">Start verifying claims to see trends</p>
               </div>
            )}
         </div>
      </div>
   )
}

export default Trends
