"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.replace('/'); // استخدام replace أفضل لتجنب الرجوع لصفحة الدخول
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-10">
        
        <div className="text-center mb-8">
          {/* أيقونة السيارة المتوافقة مع الشعار */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 border border-yellow-200/40">
            <svg className="w-8 h-8 fill-current text-slate-950" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.76l.12.34V17z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your <span className="text-amber-400 font-semibold">Souk Auto Dz</span> account</p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white placeholder-slate-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white placeholder-slate-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 text-center py-4 rounded-xl font-black text-lg transition shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-amber-400 hover:text-amber-300 transition">
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}