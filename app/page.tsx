"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State for Image Lightbox
  const [showModal, setShowModal] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    let result = [...cars];

    if (searchTerm) {
      result = result.filter(car => 
        car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedWilaya) {
      result = result.filter(car => car.wilaya?.toLowerCase().includes(selectedWilaya.toLowerCase()));
    }

    if (selectedFuel) {
      result = result.filter(car => car.fuel === selectedFuel);
    }

    if (selectedTransmission) {
      result = result.filter(car => car.transmission === selectedTransmission);
    }

    if (maxMileage) {
      result = result.filter(car => Number(car.mileage) <= Number(maxMileage));
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredCars(result);
  }, [searchTerm, selectedWilaya, selectedFuel, selectedTransmission, maxMileage, sortBy, cars]);

  async function fetchCars() {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
    } else {
      setCars(data || []);
      setFilteredCars(data || []);
    }
    setLoading(false);
  }

  const openImageModal = (car: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let imagesList: string[] = ['/peugeot.jpg'];
    if (car?.images) {
      if (Array.isArray(car.images)) {
        imagesList = car.images;
      } else if (typeof car.images === 'string') {
        imagesList = car.images.split(',').map((img: string) => img.trim()).filter(Boolean);
      }
    } else if (car?.image) {
      imagesList = [car.image];
    }

    setActiveImages(imagesList);
    setActiveImgIndex(0);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Ultra-Modern Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="bg-blue-600/30 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block">
            Algeria's Premium Auto Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Find Your Dream Car <span className="text-blue-500">Today</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Browse verified listings, connect directly with sellers, and buy or sell vehicles securely across all wilayas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20 relative z-20">
        
        {/* Floating Advanced Filter Box */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 mb-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Search Keywords</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Model, brand..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Wilaya</label>
              <input 
                type="text" 
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                placeholder="e.g. Alger, Oran"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Fuel Type</label>
              <select 
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50"
              >
                <option value="">All Fuel Types</option>
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
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50"
              >
                <option value="">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Max Mileage (Km)</label>
              <input 
                type="number" 
                value={maxMileage}
                onChange={(e) => setMaxMileage(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition bg-slate-50/50"
              >
                <option value="newest">Newest Listings</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Featured Listings <span className="text-slate-400 font-normal text-lg">({filteredCars.length})</span>
          </h2>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-24 font-semibold text-slate-500 animate-pulse">Loading amazing cars...</div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-200 text-slate-500 font-medium">
            No cars found matching your criteria. Try resetting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => {
              const carImages = car.images 
                ? (Array.isArray(car.images) ? car.images : car.images.split(',').map((i: string) => i.trim()).filter(Boolean))
                : [car.image || '/peugeot.jpg'];

              return (
                <div key={car.id} className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group">
                  
                  {/* Clickable Image Thumbnail with Preview Action */}
                  <div 
                    className="relative h-56 w-full cursor-pointer bg-slate-100 overflow-hidden"
                    onClick={(e) => openImageModal(car, e)}
                  >
                    <img 
                      src={carImages[0]} 
                      alt={car.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-bold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        🔍 Click to preview pictures
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                      {car.year || 'N/A'}
                    </div>
                  </div>

                  {/* Car Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-xl text-slate-900 mb-2 truncate group-hover:text-blue-600 transition">
                      {car.title}
                    </h3>
                    
                    <div className="text-blue-600 font-black text-2xl mb-4">
                      {car.price ? `${car.price} DZD` : 'N/A'}
                    </div>
                    
                    <div className="text-slate-500 text-sm mb-6 space-y-1.5 font-medium border-t border-slate-100 pt-4">
                      <p className="flex items-center gap-2">📍 {car.wilaya || 'N/A'} {car.commune ? `- ${car.commune}` : ''}</p>
                      <p className="flex items-center gap-2">⚙️ {car.transmission || 'N/A'} • ⛽ {car.fuel || 'N/A'}</p>
                      <p className="flex items-center gap-2">🛣️ {car.mileage ? `${car.mileage} Km` : 'N/A'}</p>
                    </div>

                    <div className="mt-auto">
                      <Link 
                        href={`/car/${car.id}`}
                        className="block w-full text-center bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold transition shadow-md shadow-slate-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Immersive Lightbox Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-6 right-6 text-white text-2xl font-bold bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>

          <div className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center mb-6 px-4">
            <img 
              src={activeImages[activeImgIndex] || activeImages[0]} 
              alt="Car Preview" 
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {activeImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto max-w-full p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              {activeImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${activeImgIndex === idx ? 'border-blue-500 scale-105 ring-2 ring-blue-500/50' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}