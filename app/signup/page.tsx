"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('تم إنشاء الحساب بنجاح! تم إرسال رابط التفعيل إلى بريدك الإلكتروني (Gmail)، يرجى التحقق منه لتأكيد حسابك.');
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 text-black">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join Souk Auto Dz to buy and sell cars easily</p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">First Name</label>
              <input 
                type="text" 
                required
                placeholder="John" 
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Last Name</label>
              <input 
                type="text" 
                required
                placeholder="Doe" 
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Phone Number</label>
            <input 
              type="tel" 
              required
              placeholder="0550000000" 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com" 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white text-center py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition">
            Already have an account? Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}