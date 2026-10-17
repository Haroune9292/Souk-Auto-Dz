"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function Navbar() {
  // 1. التحديث المطلوب الأول: جلب دالة t للترجمة
  const { t, lang, setLang } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    }
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Logo - الإسم كامل يظهر دائماً */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition border border-yellow-200/40">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-slate-950" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.76l.12.34V17z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
          <span className="text-sm sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Souk <span className="text-amber-400">Auto Dz</span>
          </span>
        </Link>

        {/* Navigation Actions - مسافات مضغوطة للهاتف */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          
          {/* زر اختيار اللغة - يظهر دائماً بدون إخفاء */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs sm:text-sm font-bold px-1.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md sm:rounded-2xl cursor-pointer transition border border-slate-800 outline-none"
          >
            <option value="fr" className="bg