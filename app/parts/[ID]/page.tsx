"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';

const TRANSLATIONS = {
  en: {
    back: "← Back to Spare Parts",
    myListing: "You posted this item.",
    delete: "🗑️ Delete",
    confirmDelete: "Are you sure you want to delete this listing?",
    priceOnCall: "Price on Call",
    sellerDetails: "Seller Details",
    whatsapp: "Message on WhatsApp",
    description: "Part Description",
    noDesc: "No additional details provided.",
    loading: "Loading details...",
    notFound: "Part not found.",
    condition: "Condition",
    new: "New",
    used: "Used"
  },
  fr: {
    back: "← Retour aux Pièces de Rechange",
    myListing: "Vous avez publié cet article.",
    delete: "🗑️ Supprimer",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cette annonce ?",
    priceOnCall: "Prix sur Appel",
    sellerDetails: "Détails du Vendeur",
    whatsapp: "Contacter sur WhatsApp",
    description: "Description de la Pièce",
    noDesc: "Aucun détail supplémentaire fourni.",
    loading: "Chargement des détails...",
    notFound: "Pièce introuvable.",
    condition: "État",
    new: "Neuf",
    used: "Occasion"
  },
  ar: {
    back: "← العودة إلى قطع الغيار",
    myListing: "لقد قمت بنشر هذا العنصر.",
    delete: "🗑️ حذف",
    confirmDelete: "هل أنت متأكد أنك تريد حذف هذا الإعلان؟",
    priceOnCall: "السعر عند الاتصال",
    sellerDetails: "تفاصيل البائع",
    whatsapp: "مراسلة عبر واتساب",
    description: "وصف القطعة",
    noDesc: "لا توجد تفاصيل إضافية مدمجة.",
    loading: "جاري تحميل التفاصيل...",
    notFound: "القطعة غير موجودة.",
    condition: "الحالة",
    new: "جديد",
    used: "مستعمل"
  }
};

export default function PartDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMyGuestPart, setIsMyGuestPart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPartDetails();
      const guestParts = JSON.parse(localStorage.getItem('my_guest_parts') || '[]');
      if (guestParts.includes(id)) setIsMyGuestPart(true);
    }
  }, [id]);

  async function fetchPartDetails() {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error:", error.message);
      } else {
        setPart(data);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (confirm(t.confirmDelete)) {
      await supabase.from('spare_parts').delete().eq('id', id);
      const guestParts = JSON.parse(localStorage.getItem('my_guest_parts') || '[]');
      localStorage.setItem('my_guest_parts', JSON.stringify(guestParts.filter((pId: string) => pId !== id)));
      router.push('/parts');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-700 bg-slate-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-2"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-bold text-slate-700 bg-slate-50 gap-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <p>{t.notFound}</p>
        <Link href="/parts" className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl">{t.back}</Link>
      </div>
    );
  }

  const cleanPhone = part.phone ? part.phone.replace(/[^0-9+]/g, '') : '';
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.replace('+', '') : '213' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello, I am interested in the part "${part.title}".`)}` 
    : null;

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 px-3 sm:px-4 text-slate-900" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-slate-100">
        
        <Link href="/parts" className="text-amber-600 font-bold mb-6 inline-block hover:underline">{t.back}</Link>

        {isMyGuestPart && (
          <div className="bg-red-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-red-200">
            <span className="text-red-800 font-bold text-sm">{t.myListing}</span>
            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition">{t.delete}</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/2 h-[300px] sm:h-[400px] bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner">
             <img src={part.image || '/placeholder.jpg'} alt={part.title} className="w-full h-full object-cover" />
             {part.condition && (
               <span className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} text-sm font-bold uppercase px-4 py-1.5 rounded-full text-white shadow-md ${part.condition === 'New' ? 'bg-green-500' : 'bg-orange-500'}`}>
                  {part.condition === 'New' ? t.new : t.used}
               </span>
             )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">{part.title}</h1>
            <p className="text-slate-500 font-semibold text-lg mb-6">{part.compatible_brand} {part.compatible_model} • {part.category}</p>
            <div className="text-3xl sm:text-4xl font-black text-amber-600 mb-8">{part.price ? `${part.price} DZD` : t.priceOnCall}</div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 mb-3 text-lg">{t.sellerDetails}</h3>
              <p className="text-slate-700 font-semibold mb-2">📍 {part.wilaya}</p>
              <p className="text-slate-700 font-semibold mb-5">📞 {part.phone}</p>
              
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-md">
                  💬 {t.whatsapp}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-3">{t.description}</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line font-medium">{part.description || t.noDesc}</p>
        </div>

      </div>
    </div>
  );
}