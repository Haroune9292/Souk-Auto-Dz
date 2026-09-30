"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddPart() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', price: '', condition: 'New', category: 'Engine',
    compatible_brand: '', compatible_model: '', wilaya: '', phone: '', description: '', image: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.from('spare_parts').insert([
      {
        ...formData,
        user_id: session?.user?.id || null, // Null if guest
      }
    ]).select().single();

    if (error) {
      alert('Error adding part: ' + error.message);
    } else {
      // Save for guest deletion logic
      if (!session?.user) {
        const guestParts = JSON.parse(localStorage.getItem('my_guest_parts') || '[]');
        guestParts.push(data.id);
        localStorage.setItem('my_guest_parts', JSON.stringify(guestParts));
      }
      router.push('/parts');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-6">List a Spare Part</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Part Name (e.g. D4HA Engine Injector)" required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
            onChange={e => setFormData({...formData, title: e.target.value})} />
            
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Price (DZD)"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              onChange={e => setFormData({...formData, price: e.target.value})} />
              
            <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
              onChange={e => setFormData({...formData, condition: e.target.value})}>
              <option value="New">New (جديد)</option>
              <option value="Used">Used (مستعمل)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Compatible Brand (e.g. Hyundai)" required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              onChange={e => setFormData({...formData, compatible_brand: e.target.value})} />
            <input type="text" placeholder="Compatible Model (e.g. Tucson)" required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              onChange={e => setFormData({...formData, compatible_model: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Engine">Engine / Mechanics</option>
              <option value="Body">Bodywork</option>
              <option value="Electrical">Electrical</option>
              <option value="Interior">Interior</option>
              <option value="Accessories">Accessories</option>
            </select>
            <input type="text" placeholder="Wilaya" required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              onChange={e => setFormData({...formData, wilaya: e.target.value})} />
          </div>

          <input type="text" placeholder="Phone Number" required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            onChange={e => setFormData({...formData, phone: e.target.value})} />
            
          <input type="text" placeholder="Image URL (Direct link)" required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            onChange={e => setFormData({...formData, image: e.target.value})} />

          <textarea placeholder="Description (Details, exact condition, etc.)" rows={4}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
            onChange={e => setFormData({...formData, description: e.target.value})} />

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md">
            {loading ? 'Publishing...' : 'Publish Spare Part'}
          </button>
        </form>
      </div>
    </div>
  );
}