"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const wilayasList = [
  "ADRAR", "CHLEF", "LAGHOUAT", "OUM EL BOUAGHI", "BATNA", "BEJAIA", "BISKRA", "BECHAR", "BLIDA", "BOUIRA",
  "TAMANRASSET", "TEBESSA", "TLEMCEN", "TIARET", "TIZI OUZOU", "ALGER", "DJELFA", "JIJEL", "SETIF", "SAIDA",
  "SKIKDA", "SIDI BEL ABBES", "ANNABA", "GUELMA", "CONSTANTINE", "MEDEA", "MOSTAGANEM", "M'SILA", "MASCARA", "OUARGLA",
  "ORAN", "EL BAYADH", "ILLIZI", "BORDJ BOU ARRERIDJ", "BOUMERDES", "EL TARF", "TINDOUF", "TISSEMSILT", "EL OUED", "KHENCHELA",
  "SOUK AHRAS", "TIPASA", "MILA", "AIN DEFLA", "NAAMA", "AIN TEMOUCHENT", "GHARDAIA", "RELIZANE", "TIMIMOUN", "BORDJ BADJI MOKHTAR",
  "OULED DJELLAL", "BENI ABBES", "IN SALAH", "IN GUEZZAM", "TOUGGOURT", "DJANET", "EL M'GHAIR", "EL MENIAA", "AFLOU", "BARIKA",
  "EL KANTARA", "BIR EL ATER", "EL ARICHA", "KSAR CHELLALA", "AIN OUSSERA", "MESSAAD", "KSAR EL BOUKHARI", "BOUSAADA", "EL ABIODH SIDI CHEIKH"
];

export default function CreateAd() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [wilaya, setWilaya] = useState('ALGER');
  const [commune, setCommune] = useState('');
  const [phone, setPhone] = useState(''); // حقل رقم الهاتف الجديد
  const [year, setYear] = useState('');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      let imageUrls: string[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileName = `${Date.now()}-${i}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(fileName, file);

        if (uploadError) throw new Error(`فشل رفع الصورة: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from('car-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrlData.publicUrl);
      }

      const primaryImage = imageUrls.length > 0 ? imageUrls[0] : '/peugeot.jpg';
      const allImagesString = imageUrls.join(',');

      const { error: insertError } = await supabase.from('cars').insert([
        {
          title,
          price: price ? Number(price) : null,
          wilaya: wilaya ? wilaya.toUpperCase() : null,
          commune: commune ? commune.trim() : null,
          phone: phone ? phone.trim() : null, // حفظ رقم الهاتف
          year: year ? Number(year) : null,
          fuel: fuel || null,
          transmission: transmission || null,
          mileage: mileage ? Number(mileage) : null,
          description: description ? description.trim() : null,
          image: primaryImage,
          images: allImagesString,
          user_id: userId,
        },
      ]);

      if (insertError) throw new Error(insertError.message);

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ ما');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-black">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Post a Car Ad</h1>

        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Ad Title (Required)</label>
            <input type="text" required placeholder="e.g. Hyundai Tucson 2017" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Price (DZD)</label>
              <input type="number" placeholder="2500000" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Phone Number (رقم الهاتف)</label>
              <input type="tel" placeholder="0550000000" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Wilaya</label>
              <select className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white font-medium" value={wilaya} onChange={(e) => setWilaya(e.target.value)}>
                {wilayasList.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Commune</label>
              <input type="text" placeholder="e.g. Birkhadem" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={commune} onChange={(e) => setCommune(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Year</label>
              <input type="number" placeholder="2017" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Fuel Type</label>
              <select className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={fuel} onChange={(e) => setFuel(e.target.value)}>
                <option value="">N/A</option>
                <option value="DIESEL">DIESEL</option>
                <option value="ESSENCE">ESSENCE</option>
                <option value="ESSENCE-GAS">ESSENCE-GAS</option>
                <option value="HYBRID">HYBRID</option>
                <option value="ELECTRIC">ELECTRIC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Transmission</label>
              <select className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                <option value="">N/A</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Mileage (Km)</label>
              <input type="number" placeholder="120000" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={mileage} onChange={(e) => setMileage(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Upload Car Pictures</label>
              <input type="file" multiple accept="image/*" className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Description (وصف السيارة)</label>
            <textarea rows={4} placeholder="Describe the condition of the car, options, papers..." className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50 mt-4">
            {loading ? 'Uploading images & Publishing...' : 'Publish Ad'}
          </button>
        </form>
      </div>
    </div>
  );
}