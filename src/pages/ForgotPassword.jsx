import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsSuccess(true);
            setIsLoading(false);
        }, 1200);
    };

    return (
        <main className="flex-1 w-full relative mesh-bg min-h-screen px-6 flex items-start justify-center pt-32 pb-20">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[--color-border] p-8 animate-in fade-in slide-in-from-bottom duration-700">

                {isSuccess ? (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 stroke-[3]" />
                        </div>
                        <h2 className="text-2xl font-display font-black text-[--color-on-surface] mb-2">{t('auth.success_reset')}</h2>
                        <p className="text-sm text-[--color-muted] font-medium mb-8">Instructions have been sent to your email.</p>
                        <Link to="/login" className="text-sm font-bold text-primary hover:underline">{t('auth.sign_in')}</Link>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-muted] hover:text-primary transition-colors mb-6">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                        <h1 className="text-3xl font-display font-black text-[--color-on-surface] mb-2">{t('auth.forgot_password')}</h1>
                        <p className="text-[--color-muted] text-sm mb-8">Enter your registered email below.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[--color-muted] mb-2">{t('auth.email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-[--color-border] rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-[--color-on-surface]" placeholder="elon@x.com" />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-4 font-black uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-4 shadow-md active:scale-95 disabled:opacity-70">
                                {isLoading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : null}
                                {isLoading ? t('auth.loading') : t('auth.reset_password')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
};
export default ForgotPassword;
