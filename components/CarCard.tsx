"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function CarCard({ car }: { car: any }) {
  const [showModal, setShowModal] = useState(false);
  const imagesList = car.images ? car.images.split(',').filter(Boolean) : [car.image || '/peugeot.jpg'];
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col">
        {/* النقر على الصورة يفتح النافذة المنبثقة */}
        <div 
          className="relative h-48 w-full cursor-pointer bg-gray-100 overflow-hidden group"
          onClick={() => { 
            setActiveImgIndex(0); 
            setShowModal(true); 
          }}
        >
          <img 
            src={imagesList[0]} 
            alt={car.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-sm">
            🔍 Click to view pictures
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{car.title}</h3>
          <p className="text-blue-600 font-extrabold text-xl mb-3">{car.price ? `${car.price} DZD` : 'N/A'}</p>
          
          <div className="text-gray-500 text-sm mb-4 space-y-1">
            <p>📍 {car.wilaya || 'N/A'} {car.commune ? `- ${car.commune}` : ''}</p>
            <p>📅 Year: {car.year || 'N/A'} • ⚙️ {car.transmission || 'N/A'}</p>
          </div>

          <div className="mt-auto">
            <Link 
              href={`/car/${car.id}`}
              className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white py-2.5 rounded-xl font-semibold transition"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* نافذة عرض الصور المنبثقة */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-6 right-6 text-white text-3xl font-bold bg-white/20 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>

          <div className="max-w-4xl max-h-[75vh] w-full flex items-center justify-center mb-4">
            <img 
              src={imagesList[activeImgIndex]} 
              alt="Car Preview" 
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {imagesList.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full p-2">
              {imagesList.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer ${activeImgIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}