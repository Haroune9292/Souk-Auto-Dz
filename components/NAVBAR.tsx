"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between text-black">
        
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-600">
          <span className="text-3xl">🚗</span> Souk Auto Dz
        </Link>

        {/* روابط التنقل والحالة */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition px-2">
            Home
          </Link>

          {/* زر إضافة إعلان ظاهر للجميع (زوار ومستخدمين) */}
          <Link href="/create-ads" className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
            + Post Ad
          </Link>

          {user ? (
            <>
              <Link href="/my-ads" className="text-gray-700 hover:text-blue-600 font-semibold transition px-2">
                My Ads
              </Link>
              <button 
                onClick={handleSignOut}
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl font-bold hover:bg-red-100 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}