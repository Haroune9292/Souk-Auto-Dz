"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/context/LanguageContext';
export default function Navbar() {
  const { lang, setLang } = useLanguage(); // تم إضافة هذا السطر
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
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition border border-yellow-200/40">
            <svg className="w-5 h-5 fill-current text-slate-950" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.76l.12.34V17z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Souk <span className="text-amber-400">Auto Dz</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          
          {/* زر اختيار اللغة الجديد */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 text-sm font-bold px-3 py-2.5 rounded-2xl cursor-pointer transition border border-slate-800 outline-none"
          >
            <option value="fr" className="bg-slate-900 text-white">FR</option>
            <option value="en" className="bg-slate-900 text-white">EN</option>
            <option value="ar" className="bg-slate-900 text-white">AR</option>
          </select>

          <Link 
            href="/" 
            className="text-sm font-bold text-slate-300 hover:text-amber-400 px-3 py-2 transition hidden sm:inline-block"
          >
            Home
          </Link>

          <Link 
            href="/create-ads" 
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 px-5 py-2.5 rounded-2xl font-black text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <span>+ Post Ad</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/my-ads" 
                className="text-sm font-bold text-slate-300 hover:text-amber-400 px-3 py-2 transition hidden md:inline-block"
              >
                My Ads
              </Link>
              <button 
                onClick={handleSignOut}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition cursor-pointer border border-slate-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-sm font-bold px-5 py-2.5 rounded-2xl transition border border-amber-500/30 shadow-md shadow-amber-500/5"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}