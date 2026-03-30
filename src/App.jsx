import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Verify from './pages/Verify'
import Report from './pages/Report'
import History from './pages/History'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import About from './pages/About'
import Chatbot from './components/Chatbot'

const App = () => {
  const { t } = useTranslation()

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface flex flex-col font-body selection:bg-primary/20">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<About />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/verify" element={<Verify />} />
              <Route path="/report" element={<Report />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Routes>

          {/* Footer */}
          <footer className="bg-[--color-surface-container] relative pt-12 pb-12 px-6 mt-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-cyan" />
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-xl font-display font-black tracking-tight text-[--color-on-surface] mb-1">
                  TruthLens<span className="text-primary italic">AI</span>
                </div>
                <div className="text-[--color-muted] text-xs font-bold uppercase tracking-widest">
                  {t('footer.copy')}
                </div>
              </div>
              <div className="flex justify-center flex-wrap gap-8 text-xs font-bold text-[--color-muted] uppercase tracking-widest">
                <a href="#" className="hover:text-primary transition-colors">{t('nav.about')}</a>
                <a href="#" className="hover:text-primary transition-colors">{t('nav.analytics')}</a>
                <a href="#" className="hover:text-primary transition-colors">{t('nav.platform')}</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </div>
        <Chatbot />
      </Router>
    </AuthProvider>
  )
}

export default App
