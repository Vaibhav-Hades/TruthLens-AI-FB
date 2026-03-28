import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Verify from './pages/Verify'
import Report from './pages/Report'
import History from './pages/History'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-surface flex flex-col font-body selection:bg-primary/20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/report" element={<Report />} />
          <Route path="/history" element={<History />} />
        </Routes>
        
        {/* Footer */}
        <footer className="border-t border-slate-100 py-12 px-6 text-center">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
             TruthLens AI. Engineering Truth through Digital Veracity.
          </div>
          <div className="flex justify-center gap-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
             <a href="#" className="hover:text-primary transition-colors">Privacy</a>
             <a href="#" className="hover:text-primary transition-colors">Terms</a>
             <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
