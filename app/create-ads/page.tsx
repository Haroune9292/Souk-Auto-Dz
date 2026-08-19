"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('N/A'); // Default N/A
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuel, setFuel] = useState('DIESEL');
  const [transmission, setTransmission] = useState('Automatic');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState(''); // Stores comma separated URLs
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);
    }
    checkUser();
  }, []);

  // دالة رفع الصور إلى Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of Array.from(e.target.files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('cars').upload(fileName, file);
        if (error) throw error;
        const { data: publicUrl } = supabase.storage.from('cars').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl.publicUrl);
      }
      setImages(prev => prev ? `${prev}, ${uploadedUrls.join(', ')}` : uploadedUrls.join(', '));
    } catch (err: any) { setError('Failed to upload image'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('cars').insert([{ 
        title, price: Number(price), wilaya, commune: commune || 'N/A', year: Number(year), 
        mileage: Number(mileage), fuel, transmission, phone, images, description, user_id: userId 
      }]);
      if (error) throw error;
      setSuccess('🚀 Vehicle listed successfully!');
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative h-80 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('/market-bg.jpg')" }}>
        <div className="text-center z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white">Market Entrance</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-24 px-4 pb-20 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl shadow-2xl p-8 md:p-12">
          
          <h2 className="text-3xl font-black mb-8">Vehicle Details</h2>
          {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl font-bold">{error}</div>}

          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4" placeholder="Car Model" />
            <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4" placeholder="Price (DZD)" />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <input required value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4" placeholder="Wilaya" />
            <input value={commune} onChange={(e) => setCommune(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4" placeholder="Commune (Optional: N/A)" />
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <input type="number" required value={year} onChange={(e) => setYear(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4" placeholder="Year" />
            <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4">
              <option value="DIESEL">Diesel</option>
              <option value="ESSENCE">Essence</option>
              <option value="ESSENCE-GAS">Essence-Gas</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ELECTRIC">Electric</option>
            </select>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4">
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <label className="text-xs font-black uppercase text-blue-600 block mb-2">Upload Pictures</label>
            <input type="file" multiple onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" />
            {uploading && <p className="text-blue-600 text-sm mt-2">Uploading...</p>}
            <input value={images} onChange={(e) => setImages(e.target.value)} className="w-full mt-2 bg-slate-100 rounded-xl py-3 px-4" placeholder="Or paste image URLs here" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-xl transition">
            {loading ? 'Processing...' : '🚀 Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}