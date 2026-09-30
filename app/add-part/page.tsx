"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';

// Liste des 58 Wilayas
const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès", "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar",
  "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah", "54 - In Guezzam", "55 - Touggourt", "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
];

// Dictionnaire de traductions
const TRANSLATIONS = {
  en: {
    title: "List a Spare Part",
    partName: "Part Name (e.g. Engine Injector)",
    price: "Price (DZD)",
    condition: "Condition",
    new: "New",
    used: "Used",
    brand: "Compatible Brand (e.g. Hyundai)",
    model: "Compatible Model (e.g. Tucson)",
    category: "Category",
    engine: "Engine / Mechanics",
    body: "Bodywork",
    electrical: "Electrical",
    interior: "Interior",
    accessories: "Accessories",
    wilaya: "Select Wilaya",
    phone: "Phone Number",
    uploadImage: "Upload Image",
    description: "Description (Details, exact condition, etc.)",
    publish: "Publish Spare Part",
    publishing: "Publishing...",
    errorFile: "Please select an image.",
    errorUpload: "Error uploading image: "
  },
  fr: {
    title: "Ajouter une Pièce",
    partName: "Nom de la pièce (ex: Injecteur)",
    price: "Prix (DZD)",
    condition: "État",
    new: "Neuf",
    used: "Occasion",
    brand: "Marque Compatible (ex: Hyundai)",
    model: "Modèle Compatible (ex: Tucson)",
    category: "Catégorie",
    engine: "Moteur / Mécanique",
    body: "Carrosserie",
    electrical: "Électricité",
    interior: "Intérieur",
    accessories: "Accessoires",
    wilaya: "Sélectionner la Wilaya",
    phone: "Numéro de téléphone",
    uploadImage: "Importer une Image",
    description: "Description (Détails, état exact, etc.)",
    publish: "Publier la Pièce",
    publishing: "Publication en cours...",
    errorFile: "Veuillez sélectionner une image.",
    errorUpload: "Erreur lors du téléchargement: "
  },
  ar: {
    title: "إضافة قطعة غيار",
    partName: "اسم القطعة (مثل: حاقن وقود)",
    price: "السعر (دج)",
    condition: "الحالة",
    new: "جديد",
    used: "مستعمل",
    brand: "العلامة المتوافقة (مثل: Hyundai)",
    model: "الموديل المتوافق (مثل: Tucson)",
    category: "التصنيف",
    engine: "محرك / ميكانيك",
    body: "هيكل السيارة",
    electrical: "كهرباء",
    interior: "مقصورة داخلية",
    accessories: "إكسسوارات",
    wilaya: "اختر الولاية",
    phone: "رقم الهاتف",
    uploadImage: "رفع صورة",
    description: "الوصف (التفاصيل، الحالة الدقيقة، إلخ)",
    publish: "نشر القطعة",
    publishing: "جاري النشر...",
    errorFile: "الرجاء اختيار صورة.",
    errorUpload: "خطأ في رفع الصورة: "
  }
};

export default function AddPart() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '', price: '', condition: 'New', category: 'Engine',
    compatible_brand: '', compatible_model: '', wilaya: '', phone: '', description: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `parts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (uploadError) {
        alert(t.errorUpload + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    } else {
      alert(t.errorFile);
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.from('spare_parts').insert([
      {
        ...formData,
        image: imageUrl,
        user_id: session?.user?.id || null, 
      }
    ]).select().single();

    if (error) {
      alert('Error: ' + error.message);
    } else {
      if (!session?.user) {
        const guestParts = JSON.parse(localStorage.getItem('my_guest_parts') || '[]');
        guestParts.push(data.id);
        localStorage.setItem('my_guest_parts', JSON.stringify(guestParts));
      }
      router.push('/parts');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-6">{t.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input type="text" placeholder={t.partName} required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            onChange={e => setFormData({...formData, title: e.target.value})} />
            
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="number" placeholder={t.price}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              onChange={e => setFormData({...formData, price: e.target.value})} />
              
            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-900"
              onChange={e => setFormData({...formData, condition: e.target.value})}>
              <option value="New">{t.new}</option>
              <option value="Used">{t.used}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder={t.brand} required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              onChange={e => setFormData({...formData, compatible_brand: e.target.value})} />
            <input type="text" placeholder={t.model} required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              onChange={e => setFormData({...formData, compatible_model: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-900"
              onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Engine">{t.engine}</option>
              <option value="Body">{t.body}</option>
              <option value="Electrical">{t.electrical}</option>
              <option value="Interior">{t.interior}</option>
              <option value="Accessories">{t.accessories}</option>
            </select>
            
            <select required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-900"
              onChange={e => setFormData({...formData, wilaya: e.target.value})}>
              <option value="">{t.wilaya}</option>
              {WILAYAS.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <input type="text" placeholder={t.phone} required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            onChange={e => setFormData({...formData, phone: e.target.value})} />
            
          <div className="w-full p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl outline-none text-center relative overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              required
            />
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg mb-2" />
                <span className="text-sm text-slate-500 font-bold">{t.uploadImage}</span>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">📸</span>
                <span className="text-sm text-slate-600 font-bold">{t.uploadImage}</span>
              </div>
            )}
          </div>

          <textarea placeholder={t.description} rows={4}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            onChange={e => setFormData({...formData, description: e.target.value})} />

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black py-4 rounded-xl transition shadow-lg cursor-pointer">
            {loading ? t.publishing : t.publish}
          </button>
        </form>
      </div>
    </div>
  );
}