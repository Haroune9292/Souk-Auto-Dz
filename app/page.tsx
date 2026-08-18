"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // حقول الفلاتر والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // حالة نافذة عرض الصور المنبثقة
  const [showModal, setShowModal] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    let result = [...cars];

    // فلترة حسب الكلمات المفتاحية
    if (searchTerm) {
      result = result.filter(car => 
        car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // فلترة حسب الولاية
    if (selectedWilaya) {
      result = result.filter(car => car.wilaya?.toLowerCase().includes(selectedWilaya.toLowerCase()));
    }

    // فلترة حسب وقود السيارات
    if (selectedFuel) {
      result = result.filter(car => car.fuel === selectedFuel);
    }

    // فلترة حسب ناقل الحركة
    if (selectedTransmission) {
      result = result.filter(car => car.transmission === selectedTransmission);
    }

    // فلترة حسب المسافة المقطوعة القصوى
    if (maxMileage) {
      result = result.filter(car => Number(car.mileage) <= Number(maxMileage));
    }

    // الترتيب
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
    <main className="min-h-screen bg-gray-100 text-black">
      {/* خلفية رأسية أنيقة للموقع */}
      <div className="relative bg-gray-900 text-white py-16 px-4 mb-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Souk Auto Dz</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find and publish the best car classifieds across Algeria easily and securely.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        
        {/* صندوق البحث والفلاتر */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8 -mt-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Search Keywords</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter model, brand..."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Wilaya</label>
              <input 
                type="text" 
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                placeholder="E.G. ADRAR, ORAN..."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Fuel Type</label>
              <select 
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Transmission</label>
              <select 
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Max Mileage (Km)</label>
              <input 
                type="number" 
                value={maxMileage}
                onChange={(e) => setMaxMileage(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="newest">Newest Listings</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* عرض السيارات */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Available Listings ({filteredCars.length})</h2>

        {loading ? (
          <div className="text-center py-20 font-semibold text-gray-600">Loading cars...</div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200 text-gray-500 font-medium">
            No cars found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCars.map((car) => {
              const carImages = car.images 
                ? (Array.isArray(car.images) ? car.images : car.images.split(',').map((i: string) => i.trim()).filter(Boolean))
                : [car.image || '/peugeot.jpg'];

              return (
                <div key={car.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col">
                  
                  {/* صورة السيارة القابلة للنقر لتفتح المعرض المنبثق */}
                  <div 
                    className="relative h-48 w-full cursor-pointer bg-gray-100 overflow-hidden group"
                    onClick={(e) => openImageModal(car, e)}
                  >
                    <img 
                      src={carImages[0]} 
                      alt={car.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-sm">
                      🔍 Click to view pictures
                    </div>
                  </div>

                  {/* تفاصيل السيارة */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{car.title}</h3>
                    <p className="text-blue-600 font-extrabold text-xl mb-3">{car.price ? `${car.price} DZD` : 'N/A'}</p>
                    
                    <div className="text-gray-500 text-sm mb-4 space-y-1">
                      <p>📍 {car.wilaya || 'N/A'} {car.commune ? `- ${car.commune}` : ''}</p>
                      <p>📅 Year: {car.year || 'N/A'} • ⚙️ {car.transmission || 'N/A'}</p>
                      <p>⛽ Fuel: {car.fuel || 'N/A'} • 🛣️ {car.mileage ? `${car.mileage} Km` : 'N/A'}</p>
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
              );
            })}
          </div>
        )}
      </div>

      {/* نافذة عرض الصور المنبثقة (Lightbox Modal) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-6 right-6 text-white text-3xl font-bold bg-white/25 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>

          <div className="max-w-4xl max-h-[75vh] w-full flex items-center justify-center mb-4">
            <img 
              src={activeImages[activeImgIndex] || activeImages[0]} 
              alt="Car Preview" 
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {activeImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full p-2">
              {activeImages.map((img: string, idx: number) => (
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
    </main>
  );
}