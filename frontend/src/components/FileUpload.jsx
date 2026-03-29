import React, { useRef, useState } from 'react'
import { Upload, FileAudio, Play, X, Loader } from 'lucide-react'
import { useGlobalToast } from '../context/ToastContext'
import { extractAudio } from '../utils/analysisApi'

const FileUpload = ({ onTranscriptReady }) => {
   const { addToast } = useGlobalToast()
   const fileInputRef = useRef(null)
   const [selectedFile, setSelectedFile] = useState(null)
   const [isProcessing, setIsProcessing] = useState(false)
   const [transcript, setTranscript] = useState('')
   const [progress, setProgress] = useState(0)

   const handleFileSelect = (file) => {
      if (!file) return

      const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'video/mp4', 'video/webm', 'video/quicktime']
      const isValid = validTypes.some(type => file.type.startsWith(type.split('/')[0]))

      if (!isValid && !file.name.match(/\.(mp3|wav|m4a|mp4|webm|mov)$/i)) {
         addToast('❌ Only audio/video files allowed', 'error')
         return
      }

      if (file.size > 500 * 1024 * 1024) { // 500MB limit
         addToast('❌ File too large (max 500MB)', 'error')
         return
      }

      setSelectedFile(file)
      addToast(`✅ File selected: ${file.name}`, 'success')
   }

   const handleExtractAudio = async () => {
      if (!selectedFile) return

      setIsProcessing(true)
      setProgress(0)

      try {
         addToast('🔄 Processing audio/video...', 'info')
         setProgress(30)

         // Simulate file upload with FormData if needed
         // For now, using URL-based extraction from the file
         const reader = new FileReader()
         
         reader.onload = async (e) => {
            setProgress(60)
            
            try {
               // Create a blob URL for the file
               const blobUrl = URL.createObjectURL(selectedFile)
               
               // Call backend with file URL
               const result = await extractAudio(blobUrl)
               setProgress(90)
               
               if (result.transcript) {
                  setTranscript(result.transcript)
                  addToast('✅ Transcript extracted!', 'success')
                  setProgress(100)
                  
                  // Notify parent component
                  if (onTranscriptReady) {
                     onTranscriptReady(result.transcript)
                  }
               }
               
               setProgress(100)
            } catch (err) {
               console.error('Extraction error:', err)
               addToast('❌ Could not process file', 'error')
               setProgress(0)
            }
         }

         reader.onerror = () => {
            addToast('❌ Could not read file', 'error')
            setProgress(0)
         }

         reader.readAsArrayBuffer(selectedFile)
      } catch (error) {
         console.error('Error:', error)
         addToast('❌ Processing failed', 'error')
         setProgress(0)
      } finally {
         setIsProcessing(false)
      }
   }

   const handleClear = () => {
      setSelectedFile(null)
      setTranscript('')
      setProgress(0)
      fileInputRef.current.value = ''
   }

   return (
      <div className="w-full space-y-4">
         {/* File Upload Area */}
         {!selectedFile ? (
            <div
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 cursor-pointer hover:border-purple-500/60 hover:bg-purple-500/5 transition-all duration-300 text-center"
            >
               <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  className="hidden"
               />
               <Upload size={32} className="mx-auto mb-3 text-purple-400" />
               <h3 className="text-lg font-bold text-white mb-1">Drop audio/video here</h3>
               <p className="text-slate-400 text-sm">MP3, WAV, MP4, WebM... (max 500MB)</p>
               <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition">
                  Or click to browse
               </button>
            </div>
         ) : (
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6">
               <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <FileAudio size={24} className="text-purple-400" />
                     <div>
                        <p className="font-semibold text-white">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
                     </div>
                  </div>
                  <button
                     onClick={handleClear}
                     disabled={isProcessing}
                     className="p-2 hover:bg-red-500/20 rounded-lg transition disabled:opacity-50"
                  >
                     <X size={20} className="text-red-400" />
                  </button>
               </div>

               {/* Processing Progress */}
               {isProcessing && (
                  <div className="mb-4">
                     <div className="flex items-center gap-3 mb-2">
                        <Loader size={16} className="animate-spin text-cyan-400" />
                        <p className="text-sm text-slate-300">Processing...</p>
                     </div>
                     <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div
                           className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                           style={{ width: `${progress}%` }}
                        />
                     </div>
                     <p className="text-xs text-slate-400 mt-1 text-right">{progress}%</p>
                  </div>
               )}

               {/* Extract Button */}
               {!transcript && (
                  <button
                     onClick={handleExtractAudio}
                     disabled={isProcessing}
                     className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
                  >
                     {isProcessing ? (
                        <>
                           <Loader size={18} className="animate-spin" />
                           Processing...
                        </>
                     ) : (
                        <>
                           <Play size={18} />
                           Extract Transcript
                        </>
                     )}
                  </button>
               )}
            </div>
         )}

         {/* Transcript Display */}
         {transcript && (
            <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">📝 Extracted Transcript</h3>
               <div className="bg-slate-900 rounded-lg p-4 max-h-48 overflow-y-auto mb-4">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                     {transcript}
                  </p>
               </div>
               <button
                  onClick={() => onTranscriptReady?.(transcript)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold transition"
               >
                  Analyze This Transcript
               </button>
            </div>
         )}
      </div>
   )
}

export default FileUpload
