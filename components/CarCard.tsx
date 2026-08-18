import Link from 'next/link';

export default function CarCard({ car }: { car: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <img src={car.image || "/peugeot.jpg"} alt={car.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{car.title}</h2>
        <p className="text-blue-600 font-bold text-lg mt-1">{car.price} DZD</p>
        <p className="text-gray-600 text-sm mt-2">{car.wilaya} - {car.year}</p>
        
        <Link 
          href={`/car/${car.id}`} 
          className="mt-4 block text-center bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}