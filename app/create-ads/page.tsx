"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateAd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState(''); // تم مسح القيمة الافتراضية ليظهر النص كـ placeholder
  const [year, setYear] = useState('');
  const [fuel, setFuel] = useState('DIESEL');
  const [transmission, setTransmission] = useState('Automatic');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) setUserId(sessionData.session.user.id);
    }
    checkUser();
  }, []);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setErrorMessage('');
    
    try {
      const uploadedUrls: string[] = [];
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cars')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('cars')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
      }
      setImages(prev => prev ? `${prev}, ${uploadedUrls.join(', ')}` : uploadedUrls.join(', '));
    } catch (err: any) { 
      setErrorMessage('Image upload failed: ' + err.message); 
    } finally { 
      setUploading(false); 
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      const { error: insertError } = await supabase.from('cars').insert([{ 
        title, 
        price: Number(price), 
        wilaya, 
        commune: commune || 'N/A', // إذا ترك المستخدم الحقل فارغاً، سيتم حفظ N/A تلقائياً
        year: Number(year), 
        fuel, 
        transmission, 
        phone, 
        images, 
        description, 
        user_id: userId 
      }]);
      
      if (insertError) throw insertError;
      setSuccess('🚀 Vehicle listed successfully!');
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) { 
      setErrorMessage(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div 
        className="relative h-80 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('/market-bg.jpg')" }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">Market Entrance</h1>
          <p className="text-blue-400 mt-3 font-medium text-lg">Register your premium vehicle in our marketplace</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-24 px-4 pb-20 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
             <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span> Vehicle Details
          </h2>

          {errorMessage && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl font-bold border border-red-200">{errorMessage}</div>}
          {success && <div className="mb-6 p-4 bg-emerald-100 text-emerald-700 rounded-xl font-bold border border-emerald-200">{success}</div>}

          {/* Section 1 */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">01. General Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Car Model (e.g. Peugeot 305)" />
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Price (DZD)" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-8 border-t border-slate-200 pt-8">
            <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">02. Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Wilaya" />
              <input value={commune} onChange={(e) => setCommune(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Commune" />
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-8 border-t border-slate-200 pt-8">
            <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">03. Specs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="number" required value={year} onChange={(e) => setYear(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Year" />
              <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="DIESEL">Diesel</option>
                <option value="ESSENCE">Essence</option>
                <option value="ESSENCE-GAS">Essence-Gas</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ELECTRIC">Electric</option>
              </select>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          {/* Section 4 */}
          <div className="mb-8 border-t border-slate-200 pt-8">
            <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">04. Media & Contact</h3>
            <div className="space-y-4">
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Phone Number" />
              <label className="block text-xs font-black uppercase text-slate-400 mt-4">Upload Pictures</label>
              <input type="file" multiple onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" />
              {uploading && <p className="text-blue-600 font-bold">Uploading...</p>}
              <input value={images} onChange={(e) => setImages(e.target.value)} className="w-full bg-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Or paste image URLs here" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-xl transition shadow-lg text-lg">
            {loading ? 'Processing...' : '🚀 Publish to Marketplace'}
          </button>
        </form>
      </div>
    </div>
  );
}