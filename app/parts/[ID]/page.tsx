"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function PartDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
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
    const { data, error } = await supabase.from('spare_parts').select('*').eq('id', id).single();
    if (!error) setPart(data);
    setLoading(false);
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this listing?')) {
      await supabase.from('spare_parts').delete().eq('id', id);
      const guestParts = JSON.parse(localStorage.getItem('my_guest_parts') || '[]');
      localStorage.setItem('my_guest_parts', JSON.stringify(guestParts.filter((pId: string) => pId !== id)));
      window.location.href = '/parts';
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!part) return <div className="min-h-screen flex items-center justify-center">Part not found.</div>;

  const cleanPhone = part.phone ? part.phone.replace(/[^0-9+]/g, '') : '';
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone.startsWith('+') ? cleanPhone.replace('+', '') : '213' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello, I am interested in the part "${part.title}".`)}` 
    : null;

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-3 sm:px-4 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        
        <Link href="/parts" className="text-blue-600 font-semibold mb-6 inline-block">← Back to Parts</Link>

        {isMyGuestPart && (
          <div className="bg-red-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-red-200">
            <span className="text-red-800 font-bold text-sm">You posted this item.</span>
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">🗑️ Delete</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/2 h-[300px] sm:h-[400px] bg-gray-100 rounded-2xl overflow-hidden relative">
             <img src={part.image || '/placeholder.jpg'} alt={part.title} className="w-full h-full object-cover" />
             <span className={`absolute top-4 left-4 text-sm font-bold uppercase px-4 py-1.5 rounded-full text-white shadow-md ${part.condition === 'New' ? 'bg-green-500' : 'bg-orange-500'}`}>
                {part.condition}
             </span>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">{part.title}</h1>
            <p className="text-gray-500 font-medium text-lg mb-6">{part.compatible_brand} {part.compatible_model} • {part.category}</p>
            <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-8">{part.price ? `${part.price} DZD` : 'Price on Call'}</div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3">Seller Details</h3>
              <p className="text-gray-700 mb-1">📍 {part.wilaya}</p>
              <p className="text-gray-700 mb-4">📞 {part.phone}</p>
              
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-xl font-bold flex justify-center gap-2">
                  💬 Message on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Part Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{part.description || 'No additional details provided.'}</p>
        </div>

      </div>
    </div>
  );
}