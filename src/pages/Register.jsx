import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Mic } from 'lucide-react';

const Register = () => {
    const { t } = useTranslation();
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [pwdStrength, setPwdStrength] = useState(0);
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
            let text = e.results[0][0].transcript;
            
            // Format specific rules
            if(field === 'email') {
                text = text.toLowerCase().replace(/\bat\b/g, '@').replace(/\bdot\b/g, '.').replace(/\s+/g, '');
                setEmail(text);
            } else if (field === 'name') {
                setName(text);
            } else if (field === 'password') {
                text = text.toLowerCase().replace(/\bat\b/g, '@').replace(/\bdot\b/g, '.').replace(/\s+/g, '');
                setPassword(text);
            } else if (field === 'confirmPassword') {
                text = text.toLowerCase().replace(/\bat\b/g, '@').replace(/\bdot\b/g, '.').replace(/\s+/g, '');
                setConfirmPassword(text);
            }
        };
        recognition.onerror = () => setActiveVoiceField(null);
        recognition.onend = () => setActiveVoiceField(null);
        recognition.start();
    };

    useEffect(() => {
        let score = 0;
        if (password.length > 5) score += 25;
        if (password.length > 8) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/[0-9]/.test(password)) score += 25;
        setPwdStrength(score);
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError(t('auth.error_mismatch'));
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(t('auth.error_exists'));
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (pwdStrength <= 25) return 'bg-rose-500';
        if (pwdStrength <= 50) return 'bg-amber-500';
        if (pwdStrength <= 75) return 'bg-blue-500';
        return 'bg-emerald-500';
    };

    return (
        <main className="flex-1 w-full relative mesh-bg min-h-screen px-6 flex items-start justify-center pt-32 pb-20">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[--color-border] p-8 animate-in fade-in slide-in-from-bottom duration-700">
                <h1 className="text-3xl font-display font-black text-[--color-on-surface] mb-2 text-center">{t('auth.register')}</h1>
                <p className="text-[--color-muted] text-sm text-center mb-8">Join the truth matrix</p>

                {error && <div className="p-3 mb-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[--color-muted] mb-2">{t('auth.full_name')}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-white border border-[--color-border] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-[--color-on-surface]" />
                            <button type="button" onClick={() => handleVoiceType('name')} className={`absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors ${activeVoiceField === 'name' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                <Mic className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[--color-muted] mb-2">{t('auth.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-white border border-[--color-border] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-[--color-on-surface]" />
                            <button type="button" onClick={() => handleVoiceType('email')} className={`absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors ${activeVoiceField === 'email' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                                <Mic className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[--color-muted] mb-2">{t('auth.password')}</label>
                        <div className="relative mb-2">
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
                        {password && (
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden transition-all">
                                <div className={`h-full ${getStrengthColor()} transition-all duration-300`} style={{ width: `${pwdStrength}%` }}></div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[--color-muted] mb-2">{t('auth.confirm_password')}</label>
                        <div className="relative text-slate-400">
                            <input type={showPwd ? "text" : "password"} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-4 pr-12 py-3 bg-white border border-[--color-border] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-[--color-on-surface]" />
                            <button type="button" onClick={() => handleVoiceType('confirmPassword')} className={`absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary transition-colors ${activeVoiceField === 'confirmPassword' ? 'text-rose-500 animate-pulse' : ''}`}>
                                <Mic className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-4 font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-4 shadow-md active:scale-95 disabled:opacity-70">
                        {isLoading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : null}
                        {isLoading ? t('auth.loading') : t('auth.register')}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-slate-500">
                    {t('auth.have_account')} <Link to="/login" className="text-primary hover:underline ml-1 font-bold">{t('auth.sign_in')}</Link>
                </p>
            </div>
        </main>
    );
};
export default Register;
