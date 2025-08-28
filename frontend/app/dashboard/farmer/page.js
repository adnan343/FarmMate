// app/dashboard/farmer/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import WeatherWidget from '@/app/components/WeatherWidget';
import Link from 'next/link';

export default async function FarmerDashboard() {
  const cookieStore = cookies();
  const role = cookieStore.get('role')?.value;

  if (role !== 'farmer') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Farmer</h2>
        <p className="text-gray-600">Manage your farm operations and view your listings.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/farmer/my-products" className="block">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Products</h3>
            <p className="text-gray-600">View and manage your product listings</p>
          </div>
        </Link>

        <Link href="/dashboard/farmer/my-orders" className="block">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
            <p className="text-gray-600">Track incoming orders from buyers</p>
          </div>
        </Link>

        <Link href="/dashboard/farmer/analytics" className="block">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">View your sales and performance metrics</p>
          </div>
        </Link>
      </div>
        <WeatherWidget />
    </div>
  );
}
