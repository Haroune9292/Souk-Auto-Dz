"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CarDetails() {
  const params = useParams();
  const id = params?.id;
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  async function fetchCarDetails() {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching car:', error);
    } else {
      setCar(data);
      if (data?.images) {
        const imgList = data.images.split(',');
        if (imgList.length > 0) setSelectedImage(imgList[0]);
      } else if (data?.image) {
        setSelectedImage(data.image);
      }
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">Loading car details...</div>;
  }

  if (!car) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">Car not found.</div>;
  }

  const imagesList = car.images ? car.images.split(',').filter(Boolean) : [car.image || '/peugeot.jpg'];

  const formattedDate = car.created_at 
    ? new Date(car.created_at).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
        
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← Back to Home
          </Link>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            🕒 Posted: {formattedDate}
          </span>
        </div>

        {/* معرض الصور */}
        <div className="mb-8">
          <div className="w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-md bg-gray-100 mb-4">
            <img src={selectedImage || imagesList[0]} alt={car.title} className="w-full h-full object-cover" />
          </div>

          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((imgUrl: string, index: number) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-24 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${selectedImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل السيارة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{car.title}</h1>
            <p className="text-gray-500 font-medium">
              {car.wilaya || 'N/A'} {car.commune ? `- ${car.commune}` : ''} • {car.year || 'N/A'} • {car.transmission || 'N/A'}
            </p>
          </div>
          <div className="text-3xl md:text-4xl font-black text-blue-600">
            {car.price ? `${car.price} DZD` : 'N/A'}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
          <div>
            <span className="block text-gray-400 text-xs font-bold uppercase mb-1">Fuel Type</span>
            <span className="font-bold text-gray-800 text-lg">{car.fuel || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-xs font-bold uppercase mb-1">Transmission</span>
            <span className="font-bold text-gray-800 text-lg">{car.transmission || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-xs font-bold uppercase mb-1">Mileage</span>
            <span className="font-bold text-gray-800 text-lg">{car.mileage ? `${car.mileage} Km` : 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-400 text-xs font-bold uppercase mb-1">Year</span>
            <span className="font-bold text-gray-800 text-lg">{car.year || 'N/A'}</span>
          </div>
        </div>

        {/* قسم وصف السيارة */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Description (وصف السيارة)</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {car.description || 'No description provided.'}
          </p>
        </div>

      </div>
    </div>
  );
}