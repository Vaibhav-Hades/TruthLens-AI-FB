import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Languages } from 'lucide-react'

const Navbar = () => {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(nextLng)
  }

  return (
    <nav className="fixed w-full z-50 glass ghost-border border-b bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-display font-black tracking-tight text-on-surface">TruthLens<span className="text-primary italic">AI</span></span>
      </Link>
      
      <div className="hidden lg:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-500">
        <Link to="/" className="hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-1">{t('nav.platform')}</Link>
        <Link to="/history" className="hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-1">{t('nav.history')}</Link>
        <Link to="/api" className="hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-1">{t('nav.api')}</Link>
        <Link to="/about" className="hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-1">{t('nav.about')}</Link>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 font-bold text-xs uppercase tracking-tighter"
        >
          <Languages className="w-4 h-4 text-primary" />
          {i18n.language.toUpperCase()}
        </button>
        
        <Link to="/verify" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/30 active:scale-95 text-center">
          {t('nav.get_started')}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
