import { Heart, Package, Store } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BuyerDashboard() {
    const cookieStore = await cookies(); // ✅ Await the cookies
    const role = cookieStore.get('role')?.value;

    if (role !== 'buyer') {
        redirect('/login');
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Welcome, Buyer</h2>
                <p className="text-sm sm:text-base text-gray-600">Browse and purchase fresh farm products.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Link href="/dashboard/buyer/browse-farmers" className="block">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                                <Store className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Browse Products by Farmer</h3>
                                <p className="text-xs sm:text-sm text-gray-600">Shop from individual farmers</p>
                            </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">Explore fresh farm products from local farmers individually</p>
                    </div>
                </Link>

                <Link href="/dashboard/buyer/my-orders" className="block">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">My Orders</h3>
                                <p className="text-xs sm:text-sm text-gray-600">Track your orders</p>
                            </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">Track your current and past orders</p>
                    </div>
                </Link>

                <Link href="/dashboard/buyer/favorites" className="block">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Favorites</h3>
                                <p className="text-xs sm:text-sm text-gray-600">Your saved products</p>
                            </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">View your saved favorite products</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}