"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function SignUp() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // حقل تأكيد كلمة المرور
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // التحقق من تطابق كلمة المرور قبل الإرسال لقاعدة البيانات
    if (password !== confirmPassword) {
      setErrorMsg(t('passwordMismatch') || (lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'));
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // رسالة طلب تفعيل الإيميل وتفريغ الخانات
      setSuccessMsg(t('checkEmailMsg') || (lang === 'ar' ? 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.' : 'Account created successfully! Please check your email to verify your account.'));
      setLoading(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  }

  const isRtl = lang === 'ar';

  return (
    <div className={`min-h-screen bg-[#0B132B] flex items-center justify-center py-12 px-4 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 border border-yellow-200/40">
            <svg className="w-8 h-8 fill-current text-slate-950" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            {t('createAccount') || (lang === 'ar' ? 'إنشاء حساب' : 'Create Account')}
          </h1>
          <p className="text-slate-400 text-sm">
            {t('joinUs') || (lang === 'ar' ? 'انضم إلى سوق أوطو ديزاد اليوم' : 'Join Souk Auto Dz today')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm font-medium text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
              {t('emailLabel') || (lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address')}
            </label>
            <input 
              type="email" 
              required
              placeholder="name@example.com" 
              className={`w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white placeholder-slate-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition ${isRtl ? 'text-right' : 'text-left'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
              {t('passwordLabel') || (lang === 'ar' ? 'كلمة المرور' : 'Password')}
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className={`w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white placeholder-slate-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition ${isRtl ? 'text-right' : 'text-left'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
              {t('confirmPasswordLabel') || (lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password')}
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className={`w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white placeholder-slate-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition ${isRtl ? 'text-right' : 'text-left'}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 text-center py-4 rounded-xl font-black text-lg transition shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4"
          >
            {loading 
              ? (t('creating') || (lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...')) 
              : (t('signUpBtn') || (lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'))}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            {t('alreadyHaveAccount') || (lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? ')}
            <Link href="/login" className="font-bold text-amber-400 hover:text-amber-3