// app/dashboard/farmer/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import WeatherWidget from '@/app/components/WeatherWidget';

export default async function FarmerDashboard() {
  const cookieStore = cookies();
  const role = cookieStore.get('role')?.value;

  if (role !== 'farmer') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <WeatherWidget />
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Farmer</h2>
        <p className="text-gray-600">Manage your farm operations and view your listings.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Products</h3>
          <p className="text-gray-600">View and manage your product listings</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
          <p className="text-gray-600">Track incoming orders from buyers</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600">View your sales and performance metrics</p>
        </div>
      </div>
    </div>
  );
}
