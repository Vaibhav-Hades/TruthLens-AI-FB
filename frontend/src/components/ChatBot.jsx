import React, { useState } from 'react'
import { Video, X, Loader2 } from 'lucide-react'

// Utilizing the Tavus Conversational Video API key provided by the user.
// You will need a replica_id or persona_id setup inside your Tavus dashboard to load a specific digital human.
const API_KEY = import.meta.env.VITE_TAVUS_API_KEY || "331dcbf6621346f0968f398c3fa71115";
const DEFAULT_REPLICA_ID = import.meta.env.VITE_TAVUS_REPLICA_ID || "r79e1c033f";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [conversationUrl, setConversationUrl] = useState(null)
    const [error, setError] = useState('')

    const startConversation = async () => {
        setIsOpen(true)
        if (conversationUrl) return // Already active

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('https://tavusapi.com/v2/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify({
                    replica_id: DEFAULT_REPLICA_ID,
                    conversation_name: "TruthLens Video Assistant" // Customize standard properties
                })
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || errData.error || 'Failed to initialize video conversation')
            }

            const data = await response.json()
            setConversationUrl(data.conversation_url)
        } catch (err) {
            console.error("Tavus API Error:", err)
            setError(err.message || 'Could not connect to Tavus AI. Check your Replica ID and API Key.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        // Clearing the URL forces it to spin down the active session & generate a new one the next time it's opened.
        setConversationUrl(null)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-slate-900 w-80 sm:w-96 md:w-[400px] aspect-[9/16] rounded-3xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex items-center justify-between text-white shadow-md z-10 relative border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shadow-inner">
                                <Video className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="font-black tracking-widest uppercase text-xs">TruthLens Video Assistant</span>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors group">
                            <X className="w-4 h-4 text-slate-300 group-hover:text-white" />
                        </button>
                    </div>

                    {/* Interactive WebRTC / App Canvas */}
                    <div className="flex-1 bg-black relative flex items-center justify-center">
                        {isLoading && (
                            <div className="flex flex-col items-center gap-4 text-blue-400 z-10">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Connecting API...</span>
                            </div>
                        )}

                        {error && !isLoading && (
                            <div className="p-6 text-center text-rose-400 text-sm font-medium z-10">
                                <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                                    <X className="w-6 h-6 text-rose-500" />
                                </div>
                                {error}
                                <p className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Please update your designated Replica ID in .env</p>
                            </div>
                        )}

                        {conversationUrl && !isLoading && (
                            <iframe
                                src={conversationUrl}
                                className="absolute inset-0 w-full h-full border-none"
                                allow="camera; microphone; fullscreen; display-capture;"
                                title="Tavus Conversational Video"
                            />
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={startConversation}
                    className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[1.25rem] flex items-center justify-center shadow-[0_12px_32px_rgba(0,102,255,0.4)] hover:scale-105 active:scale-95 transition-all text-white relative group border border-white/20"
                >
                    <Video className="w-7 h-7" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
                </button>
            )}
        </div>
    )
}

export default ChatBot
