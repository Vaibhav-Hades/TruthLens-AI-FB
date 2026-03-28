import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Mic } from 'lucide-react';

const Login = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeVoiceField, setActiveVoiceField] = useState(null);

    const handleVoiceType = (field) => {
        window.speechSynthesis?.cancel();
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice recognition not supported. Please use Chrome.");
            return;
        }
        setActiveVoiceField(field);
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = (e) => {
            let text = e.results[0][0].transcript.toLowerCase();
            // Try to fix "at" to "@" and "dot" to "."
            text = text.replace(/\bat\b/g, '@').replace(/\bdot\b/g, '.').replace(/\s+/g, '');
            if(field === 'email') setEmail(text);
            if(field === 'password') setPassword(text);
        };
        recognition.onerror = () => setActiveVoiceField(null);
        recognition.onend = () => setActiveVoiceField(null);
        recognition.start();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(t('auth.error_invalid'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 w-full relative mesh-bg min-h-screen px-6 flex items-start justify-center pt-32 pb-20">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[--color-border] p-8 animate-in fade-in slide-in-from-bottom duration-700">
                <h1 className="text-3xl font-display font-black text-[--color-on-surface] mb-2 text-center">{t('auth.login')}</h1>
                <p className="text-[--color-muted] text-sm text-center mb-8">Proceed to your workspace</p>

                {error && <div className="p-3 mb-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[--color-muted] mb-2 flex justify-between items-center">
                            <span>{t('auth.email')}</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-white border border-[--color-border] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-[--color-on-surface]" placeholder="elon@x.com" />
                            <button type="button" onClick={() => handleVoiceType('email')} className={`absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors ${activeVoiceField === 'email' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                <Mic className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[--color-muted]">{t('auth.password')}</label>
                            <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">{t('auth.forgot_password')}</Link>
                        </div>
                        <div className="relative">
                            <input type={showPwd ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-4 pr-20 py-3 bg-white border border-[--color-border] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-[--color-on-surface]" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400">
                                <button type="button" onClick={() => handleVoiceType('password')} className={`hover:text-primary transition-colors ${activeVoiceField === 'password' ? 'text-rose-500 animate-pulse' : ''}`}>
                                    <Mic className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => setShowPwd(!showPwd)} className="hover:text-primary transition-colors">
                                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-4 font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-4 shadow-md active:scale-95 disabled:opacity-70">
                        {isLoading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : null}
                        {isLoading ? t('auth.loading') : t('auth.sign_in')}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[--color-border]"></div></div>
                    <div className="relative flex justify-center text-xs"><span className="bg-white px-4 font-bold text-slate-400 uppercase tracking-widest">or</span></div>
                </div>

                <button type="button" className="w-full bg-white border border-[--color-border] hover:bg-slate-50 text-[--color-on-surface] rounded-xl py-3.5 font-bold text-sm transition-all flex justify-center items-center gap-3 active:scale-95">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    {t('auth.google')}
                </button>

                <p className="mt-8 text-center text-sm font-medium text-slate-500">
                    {t('auth.no_account')} <Link to="/register" className="text-primary hover:underline ml-1 font-bold">{t('auth.sign_up')}</Link>
                </p>
            </div>
        </main>
    );
};
export default Login;
