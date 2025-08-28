// app/dashboard/farmer/page.js
import WeatherWidget from '@/app/components/WeatherWidget';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function FarmerDashboard() {
  const cookieStore = cookies();
  const role = cookieStore.get('role')?.value;

  if (role !== 'farmer') {
    redirect('/login');
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Welcome, Farmer</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage your farm operations and view your listings.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/dashboard/farmer/my-products" className="block">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">My Products</h3>
            <p className="text-sm sm:text-base text-gray-600">View and manage your product listings</p>
          </div>
        </Link>

        <Link href="/dashboard/farmer/my-orders" className="block">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Orders</h3>
            <p className="text-sm sm:text-base text-gray-600">Track incoming orders from buyers</p>
          </div>
        </Link>

        <Link href="/dashboard/farmer/analytics" className="block">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm sm:text-base text-gray-600">View your sales and performance metrics</p>
          </div>
        </Link>
      </div>
      
      <div className="w-full">
        <WeatherWidget />
      </div>
    </div>
  );
}
