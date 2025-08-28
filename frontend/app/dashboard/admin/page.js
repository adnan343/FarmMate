import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const cookieStore = await cookies(); // ✅ Await the cookies
    const role = cookieStore.get('role')?.value;

    if (role !== 'admin') {
        redirect('/login');
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Welcome, Admin</h2>
                <p className="text-sm sm:text-base text-gray-600">Manage the platform and monitor system activity.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Link href="/dashboard/admin/user-management" className="block">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                        <p className="text-sm sm:text-base text-gray-600">Manage farmers, buyers, and system users</p>
                    </div>
                </Link>

                <Link href="/dashboard/admin/qa" className="block">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Q&A Management</h3>
                        <p className="text-sm sm:text-base text-gray-600">View and manage questions and answers</p>
                    </div>
                </Link>

            </div>
        </div>
    );
}