"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", 
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", 
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", 
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arrèridj", "Boumerdès", "El Tarf", "Tindouf", 
  "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", 
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", 
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
  "Aflou", "Aïn Oussera", "Barika", "Bir el-Ater", "Bou Saâda", 
  "El Abiodh Sidi Cheikh", "El Aricha", "El Kantara", "Ksar Chellala", "Ksar El Boukhari", "Messaad"
];

export default function CreateAd() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [wilaya, setWilaya] = useState(wilayas[0]);
  const [commune, setCommune] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState(''); // تم إضافة حالة الكيلومترات
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
        commune: commune || 'N/A', 
        year: Number(year), 
        mileage: Number(mileage) || 0, // إرسال الكيلومترات لقاعدة البيانات
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
      {/* Hero Section */}
      <div 
        className="relative h-80 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('/market-bg.jpg')" }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">{t('marketEntrance')}</h1>
          <p className="text-amber-400 mt-3 font-medium text-lg">{t('registerVehicle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-24 px-4 pb-20 relative z-20">
        <form onSubmit={handleSubmit} className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl shadow-2xl p-8 md:p-12 border border-amber-500/30">
          
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></span> {t('vehicleDetails')}
          </h2>

          {errorMessage && <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-xl font-bold border border-red-500/30">{errorMessage}</div>}
          {success && <div className="mb-6 p-4 bg-emerald-900/50 text-emerald-200 rounded-xl font-bold border border-emerald-500/30">{success}</div>}

          {/* Section 1: General Info */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-4 tracking-widest">{t('generalInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition" placeholder={t('carModelPlaceholder')} />
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition" placeholder={t('priceDzd')} />
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="mb-8 border-t border-slate-800 pt-8">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-4 tracking-widest">{t('location')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-2 block">{t('wilayaRegion')}</label>
                <select 
                  value={wilaya} 
                  onChange={(e) => setWilaya(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition"
                >
                  {wilayas.map((w) => (
                    <option key={w} value={w} className="bg-slate-900 text-white">{w}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-2 block">{t('commune')}</label>
                <input value={commune} onChange={(e) => setCommune(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition" placeholder={t('commune')} />
              </div>
            </div>
          </div>

          {/* Section 3: Specs (Year, Mileage, Fuel, Transmission) */}
          <div className="mb-8 border-t border-slate-800 pt-8">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-4 tracking-widest">{t('specs')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <input type="number" required value={year} onChange={(e) => setYear(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition" placeholder={t('year')} />
              <input type="number" required value={mileage} onChange={(e) => setMileage(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition" placeholder={t('mileagePlaceholder')} />
              <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition">
                <option value="DIESEL" className="bg-slate-900 text-white">Diesel</option>
                <option value="ESSENCE" className="bg-slate-900 text-white">Essence</option>
                <option value="ESSENCE-GAS" className="bg-slate-900 text-white">Essence-Gas</option>
                <option value="HYBRID" className="bg-slate-900 text-white">Hybrid</option>
                <option value="ELECTRIC" className="bg-slate-900 text-white">Electric</option>
              </select>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition">
                <option value="Automatic" className="bg-slate-900 text-white">Automatic</option>
                <option value="Manual" className="bg-slate-900 text-white">Manual</option>
              </select>
            </div>
          </div>

          {/* Section 4: Media & Contact */}
          <div className="mb-8 border-t border-slate-800 pt-8">
            <h3 className="text-xs font-black uppercase text-amber-400 mb-4 tracking-widest">{t('mediaContact')}</h3>
            <div className="space-y-4">
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition" placeholder={t('phone')} />
              <label className="block text-xs font-black uppercase text-slate-400 mt-4">{t('uploadPictures')}</label>
              <input type="file" multiple onChange={handleFileUpload} className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-400 file:text-slate-950 file:font-bold file:cursor-pointer hover:file:bg-amber-500 transition" />
              {uploading && <p className="text-amber-400 font-bold">{t('uploading')}</p>}
              <input value={images} onChange={(e) => setImages(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition" placeholder={t('pasteImageUrls')} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black py-5 rounded-2xl transition shadow-xl shadow-amber-500/30 text-xl tracking-wider cursor-pointer">
            {loading ? t('processing') : t('publishButton')}
          </button>
        </form>
      </div>
    </div>
  );
}