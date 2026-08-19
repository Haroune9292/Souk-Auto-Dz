"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
            🚗
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Souk <span className="text-blue-600">Auto Dz</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="text-sm font-bold text-slate-600 hover:text-blue-600 px-3 py-2 transition hidden sm:inline-block"
          >
            Home
          </Link>

          <Link 
            href="/create-ads" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <span>+ Post Ad</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/my-ads" 
                className="text-sm font-bold text-slate-700 hover:text-blue-600 px-3 py-2 transition hidden md:inline-block"
              >
                My Ads
              </Link>
              <button 
                onClick={handleSignOut}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-2xl transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition shadow-md shadow-slate-900/10"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}