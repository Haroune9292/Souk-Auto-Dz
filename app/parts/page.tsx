"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SparePartsStore() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Spare Parts Store</h1>
            <p className="text-gray-500 mt-2">Find and sell new or used car parts.</p>
          </div>
          <Link 
            href="/add-part" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md"
          >
            + Sell a Part
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-bold">Loading parts...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {parts.map((part) => (
              <Link href={`/parts/${part.id}`} key={part.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={part.image || '/placeholder-part.jpg'} 
                    alt={part.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  {part.condition && (
                    <span className={`absolute top-3 left-3 text-xs font-bold uppercase px-3 py-1 rounded-full text-white shadow-sm ${part.condition === 'New' ? 'bg-green-500' : 'bg-orange-500'}`}>
                      {part.condition}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{part.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{part.compatible_brand} {part.compatible_model} • {part.category}</p>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-xl font-black text-blue-600">{part.price ? `${part.price} DZD` : 'Price on call'}</span>
                    <span className="text-xs text-gray-400">{part.wilaya}</span>
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