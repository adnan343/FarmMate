import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BuyerDashboard() {
  const cookieStore = await cookies(); // ✅ Await the cookies
  const role = cookieStore.get('role')?.value;

  if (role !== 'buyer') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Buyer</h2>
        <p className="text-gray-600">Browse and purchase fresh farm products.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Products</h3>
          <p className="text-gray-600">Explore fresh farm products from local farmers</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Orders</h3>
          <p className="text-gray-600">Track your current and past orders</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorites</h3>
          <p className="text-gray-600">View your saved favorite products</p>
        </div>
      </div>
    </div>
  );
}
