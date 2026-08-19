"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuel, setFuel] = useState('DIESEL');
  const [transmission, setTransmission] = useState('Automatic');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        // Pre-fill phone if available in user metadata
        if (session.user.user_metadata?.phone) {
          setPhone(session.user.user_metadata.phone);
        }
      }
    }
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: insertError } = await supabase
        .from('cars')
        .insert([
          {
            title,
            price: Number(price),
            wilaya,
            commune,
            year: Number(year),
            mileage: Number(mileage),
            fuel,
            transmission,
            phone,
            images,
            description,
            user_id: userId || null, // Stores user ID if logged in, null if guest
          },
        ]);

      if (insertError) throw insertError;

      setSuccess('Your car has been successfully listed in the market! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to post the ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Parse images for live preview
  const previewImages = images ? images.split(',').map(img => img.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-blue-600 font-bold hover:underline flex items-center gap-1.5 text-sm">
            ← Back to Marketplace
          </Link>
          <span className="bg-blue-100 text-blue-700 text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full">
            Vehicle Marketplace Entry
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-8 md:p-12">
          
          <div className="mb-10 border-b border-slate-100 pb-6">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              List Your Car for Sale
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Enter your vehicle's specifications below to publish it instantly across Algeria.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl text-sm font-semibold">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: General Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🚗</span> General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Ad Title / Model</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Hyundai Tucson 2.0 CRDi"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Price (DZD)</label>
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 3500000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Location */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📍</span> Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Wilaya</label>
                  <input 
                    type="text" 
                    required
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    placeholder="e.g. Alger, Oran, Sétif"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Commune (Optional)</label>
                  <input 
                    type="text" 
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="e.g. Bab Ezzouar"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Technical Specifications */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>⚙️</span> Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Year</label>
                  <input 
                    type="number" 
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2017"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Mileage (Km)</label>
                  <input 
                    type="number" 
                    required
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="e.g. 120000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Fuel Type</label>
                  <select 
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  >
                    <option value="DIESEL">Diesel</option>
                    <option value="ESSENCE">Essence</option>
                    <option value="ESSENCE-GAS">Essence-Gas</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ELECTRIC">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Transmission</label>
                  <select 
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Contact & Photos */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📸</span> Photos & Contact
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Phone Number (WhatsApp Ready)</label>
                  <input 
                    type="text" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0697487065"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Image URLs (Comma separated)</label>
                  <input 
                    type="text" 
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
                  />
                </div>

                {/* Live Image Previews */}
                {previewImages.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    {previewImages.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-300 flex-shrink-0 bg-white shadow-sm">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Description */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📝</span> Description (وصف السيارة)
              </h3>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention vehicle condition, maintenance history, options, etc..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50 font-medium"
              ></textarea>
            </div>

            {/* Submit Action */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl transition shadow-xl shadow-blue-600/20 text-base cursor-pointer"
            >
              {loading ? 'Publishing to Marketplace...' : '🚀 Publish Ad Now'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}