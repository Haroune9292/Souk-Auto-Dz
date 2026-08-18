"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // حالات الفلترة والترتيب المتقدمة
  const [search, setSearch] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [fuel, setFuel] = useState('ALL');
  const [transmission, setTransmission] = useState('ALL');
  const [maxMileage, setMaxMileage] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchAllCars();
  }, []);

  async function fetchAllCars() {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
    } else {
      setCars(data || []);
      setFilteredCars(data || []);
    }
    setLoading(false);
  }

  // تصفية وترتيب النتائج مع جميع الفلاتر
  useEffect(() => {
    let result = [...cars];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(car => 
        car.title?.toLowerCase().includes(query) || 
        car.wilaya?.toLowerCase().includes(query)
      );
    }

    if (wilaya.trim()) {
      const wilayaQuery = wilaya.trim().toLowerCase();
      result = result.filter(car => 
        car.wilaya?.toLowerCase().includes(wilayaQuery)
      );
    }

    if (fuel !== 'ALL') {
      result = result.filter(car => car.fuel === fuel);
    }

    if (transmission !== 'ALL') {
      result = result.filter(car => car.transmission === transmission);
    }

    if (maxMileage.trim()) {
      const maxM = Number(maxMileage);
      result = result.filter(car => car.mileage ? Number(car.mileage) <= maxM : true);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredCars(result);
  }, [search, wilaya, fuel, transmission, maxMileage, sortBy, cars]);

  return (
    <div className="min-h-screen bg-gray-100 pb-20 text-black">
      
      {/* قسم صورة المعرض مع التمركز والانسيابية */}
      <div className="relative w-full h-[450px] md:h-[500px] shadow-xl bg-black overflow-hidden">
        <Image 
          src="/showroom-bg.jpg" 
          alt="Souk Auto Dz" 
          fill
          priority
          className="object-cover opacity-90"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 flex flex-col items-center justify-center text-white px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight drop-shadow-lg">
            Souk Auto Dz
          </h1>
          <p dir="rtl" className="text-sm md:text-lg text-gray-200 max-w-xl mx-auto drop-shadow-md">
            اكتشف أفضل سيارات الأحلام في معرضنا الرقمي المتميز والمتطور.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-gray-100 via-gray-100/50 to-transparent pointer-events-none"></div>
      </div>

      {/* شريط البحث والفلترة المتقدم (6 خانات) */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-20 md:-mt-24 mb-12">
        <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Search Keywords</label>
            <input 
              type="text" 
              placeholder="Enter model, brand..." 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Wilaya</label>
            <input 
              type="text" 
              placeholder="e.g. ADRAR, ORAN..." 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 uppercase bg-white"
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Fuel Type</label>
            <select 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            >
              <option value="ALL">All Fuel Types</option>
              <option value="DIESEL">DIESEL</option>
              <option value="ESSENCE">ESSENCE</option>
              <option value="ESSENCE-GAS">ESSENCE-GAS</option>
              <option value="HYBRID">HYBRID</option>
              <option value="ELECTRIC">ELECTRIC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Transmission</label>
            <select 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            >
              <option value="ALL">All Transmissions</option>
              <option value="Manual">Manual (عادية)</option>
              <option value="Automatic">Automatic (أوتوماتيك)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Max Mileage (Km)</label>
            <input 
              type="number" 
              placeholder="e.g. 150000" 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Sort By</label>
            <select 
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-white font-medium text-blue-600"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest Listings</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* عرض النتائج */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-24 text-gray-600 font-medium text-lg">Loading cars...</div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xl font-medium">No cars found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col transition hover:shadow-2xl hover:-translate-y-1 duration-300">
                <img src={car.image || "/peugeot.jpg"} alt={car.title} className="w-full h-64 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-2xl text-gray-900 mb-3 line-clamp-1">{car.title}</h3>
                  <p className="text-blue-700 font-extrabold text-3xl mb-3">{car.price} DZD</p>
                  <p className="text-gray-500 text-base font-medium mb-6">{car.wilaya} • {car.year} {car.transmission ? `• ${car.transmission}` : ''}</p>
                  <Link href={`/car/${car.id}`} className="mt-auto block bg-blue-600 text-white text-center py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}