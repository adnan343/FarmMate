import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Store, Package, Heart } from 'lucide-react';
import WeatherWidget from '@/app/components/WeatherWidget';

export default async function BuyerDashboard() {
  const cookieStore = await cookies(); // ✅ Await the cookies
  const role = cookieStore.get('role')?.value;

  if (role !== 'buyer') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <WeatherWidget />
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Buyer</h2>
        <p className="text-gray-600">Browse and purchase fresh farm products.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/buyer/browse-farmers" className="block">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Browse Products by Farmer</h3>
                <p className="text-sm text-gray-600">Shop from individual farmers</p>
              </div>
            </div>
            <p className="text-gray-600">Explore fresh farm products from local farmers individually</p>
          </div>
        </Link>
        
        <Link href="/dashboard/buyer/my-orders" className="block">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
                <p className="text-sm text-gray-600">Track your orders</p>
              </div>
            </div>
            <p className="text-gray-600">Track your current and past orders</p>
          </div>
        </Link>
        
        <Link href="/dashboard/buyer/favorites" className="block">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
                <p className="text-sm text-gray-600">Your saved products</p>
              </div>
            </div>
            <p className="text-gray-600">View your saved favorite products</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
