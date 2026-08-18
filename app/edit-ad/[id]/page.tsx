"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function EditCar({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const carId = resolvedParams.id;
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuel, setFuel] = useState('DIESEL');
  const [wilaya, setWilaya] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  async function fetchCarDetails() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title || '');
        setPrice(data.price || '');
        setYear(data.year || '');
        setMileage(data.mileage || '');
        setFuel(data.fuel || 'DIESEL');
        setWilaya(data.wilaya || '');
        setDescription(data.description || '');
      }
    } catch (error) {
      console.error('Error fetching car:', error);
      alert('Car not found');
      router.push('/my-ads');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('cars')
        .update({
          title,
          price,
          year: Number(year),
          mileage: Number(mileage),
          fuel,
          wilaya: wilaya.toUpperCase(),
          description,
        })
        .eq('id', carId);

      if (error) throw error;

      router.push('/my-ads');
      router.refresh();
    } catch (error: any) {
      console.error('Error updating car:', error);
      alert('Failed to update car: ' + (error?.message || JSON.stringify(error)));
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading car details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-black">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border p-6">
        <Link href="/my-ads" className="text-blue-600 font-bold hover:underline mb-6 inline-block">
          &larr; Back to My Ads
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Car Ad</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Title / Model</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (DZD)</label>
              <input 
                type="number" 
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input 
                type="number" 
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
              <input 
                type="number" 
                required
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select 
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="DIESEL">DIESEL</option>
                <option value="ESSENCE">ESSENCE</option>
                <option value="ESSENCE-GAS">ESSENCE-GAS</option>
                <option value="HYBRID">HYBRID</option>
                <option value="ELECTRIC">ELECTRIC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
            <input 
              type="text" 
              required
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Ad'}
          </button>
        </form>
      </div>
    </div>
  );
}