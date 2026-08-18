"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyAdsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMyAds();
  }, []);

  async function fetchMyAds() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching my ads:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;
      setCars(cars.filter(car => car.id !== id));
    } catch (error: any) {
      alert('Error deleting ad: ' + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Ads</h1>
            <p className="text-gray-500 mt-1">Manage your posted car listings</p>
          </div>
          <Link href="/" className="text-blue-600 font-bold hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading your ads...</div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
            <p className="text-gray-500 text-lg mb-4">You have not posted any ads yet.</p>
            <Link href="/create-ads" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
              Post Your First Ad
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
                <img 
                  src={car.image || "/peugeot.jpg"} 
                  alt={car.title} 
                  className="w-full h-48 object-cover border-b"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{car.title}</h3>
                  <p className="text-blue-600 font-extrabold text-xl mt-1">{car.price} DZD</p>
                  <p className="text-gray-500 text-sm mt-2">{car.wilaya} - {car.year}</p>
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <Link 
                      href={`/edit-ad/${car.id}`} 
                      className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(car.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}