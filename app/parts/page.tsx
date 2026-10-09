"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';

const TRANSLATIONS = {
  en: {
    title: "Spare Parts Store",
    subtitle: "Find and sell new or used car parts.",
    sellBtn: "+ Sell a Part",
    loading: "Loading parts...",
    priceOnCall: "Price on call",
    new: "New",
    used: "Used",
    empty: "No parts available yet."
  },
  fr: {
    title: "Magasin de Pièces",
    subtitle: "Trouvez et vendez des pièces automobiles.",
    sellBtn: "+ Vendre une Pièce",
    loading: "Chargement des pièces...",
    priceOnCall: "Prix sur appel",
    new: "Neuf",
    used: "Occasion",
    empty: "Aucune pièce disponible pour le moment."
  },
  ar: {
    title: "متجر قطع الغيار",
    subtitle: "ابحث أو بع قطع غيار السيارات الجديدة والمستعملة.",
    sellBtn: "+ بيع قطعة",
    loading: "جاري تحميل القطع...",
    priceOnCall: "السعر عند الاتصال",
    new: "جديد",
    used: "مستعمل",
    empty: "لا توجد قطع غيار متاحة حالياً."
  }
};

export default function SparePartsStore() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    fetchParts();
  }, []);

  async function fetchParts() {
    const { data, error } = await supabase
      .from('spare_parts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setParts(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{t.title}</h1>
            <p className="text-slate-500 mt-2 font-medium">{t.subtitle}</p>
          </div>
          <Link 
            href="/add-part" 
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black py-3 px-6 rounded-xl transition shadow-lg"
          >
            {t.sellBtn}
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold">{t.loading}</div>
        ) : parts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-bold">{t.empty}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {parts.map((part) => (
              <Link href={`/parts/${part.id}`} key={part.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-300 group flex flex-col">
                <div className="relative h-48 bg-slate-100">
                  <img 
                    src={part.image || '/placeholder-part.jpg'} 
                    alt={part.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  {part.condition && (
                    <span className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} text-xs font-bold uppercase px-3 py-1 rounded-full text-white shadow-sm ${part.condition === 'New' ? 'bg-green-500' : 'bg-orange-500'}`}>
                      {part.condition === 'New' ? t.new : t.used}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{part.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 font-medium">{part.compatible_brand} {part.compatible_model} • {part.category}</p>
                  <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-50">
                    <span className="text-lg font-black text-slate-900">{part.price ? `${part.price} DZD` : t.priceOnCall}</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{part.wilaya.split(' - ')[0]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}