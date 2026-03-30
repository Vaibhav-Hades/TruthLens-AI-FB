import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Globe, ChevronDown, Check, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const languages = [
  { code: 'en', native: 'English', flag: '🇬🇧' },
  { code: 'hi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'zh', native: '中文', flag: '🇨🇳' },
  { code: 'ja', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', native: '한국어', flag: '🇰🇷' }
]

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const langRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setLangOpen(false)
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  const navLinkClass = (path) => {
    const isActive = location.pathname === path
    return `relative pb-1 font-bold uppercase tracking-widest text-sm transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
      } after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
      }`
  }

  return (
    <nav className={`fixed w-full z-50 glass ghost-border border-b bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-display font-black tracking-tight text-[--color-on-surface]">TruthLens<span className="text-primary italic">AI</span></span>
      </Link>

      <div className="hidden lg:flex items-center gap-10">
        <Link to="/" className={navLinkClass('/')}>{t('nav.platform')}</Link>
        <Link to="/history" className={navLinkClass('/history')}>{t('nav.history')}</Link>
        <Link to="/analytics" className={navLinkClass('/analytics')}>{t('nav.analytics')}</Link>
        <Link to="/trends" className={navLinkClass('/trends')}>📊 Trends</Link>
        <Link to="/about" className={navLinkClass('/about')}>{t('nav.about')}</Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[--color-border] bg-white hover:bg-slate-50 transition-colors shadow-sm text-[--color-on-surface] font-bold text-xs uppercase tracking-tighter active:scale-95"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">{currentLang.native}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className={`absolute top-full right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-primary/10 border border-[--color-border] overflow-hidden py-2 transform transition-all duration-300 origin-top-right ${langOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${i18n.language === l.code ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{l.flag}</span>
                  <div className="flex flex-col items-start leading-none gap-1">
                    <span className={`font-bold ${i18n.language === l.code ? 'text-primary' : 'text-[--color-on-surface]'}`}>{l.native}</span>
                    <span className="text-[10px] uppercase tracking-widest font-black text-[--color-muted]">{l.code}</span>
                  </div>
                </div>
                {i18n.language === l.code && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {!isAuthenticated ? (
          <Link to="/login" className="bg-gradient-to-r from-[#0066FF] to-[#0050CB] hover:from-[#0050CB] hover:to-[#0040A0] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_8px_32px_rgba(0,102,255,0.4)] hover:scale-[1.02] active:scale-95 text-center">
            {t('nav.get_started')}
          </Link>
        ) : (
          <div className="relative" ref={userRef}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-display font-black text-lg shadow-md active:scale-95 transition-transform uppercase border-2 border-primary-dark">
              {user?.name ? user.name.charAt(0) : 'U'}
            </button>

            <div className={`absolute top-full right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-primary/10 border border-[--color-border] overflow-hidden py-2 transform transition-all duration-300 origin-top-right ${userMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
              <div className="px-5 py-4 border-b border-[--color-border] bg-slate-50/50">
                <div className="font-bold text-[--color-on-surface] truncate">{user?.name}</div>
                <div className="text-xs text-[--color-muted] font-medium truncate">{user?.email}</div>
              </div>
              <div className="py-2">
                <Link to="/" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link to="/" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <div className="w-full h-px bg-[--color-border] my-2"></div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                  <LogOut className="w-4 h-4" /> {t('auth.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
