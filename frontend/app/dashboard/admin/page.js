import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
    const cookieStore = await cookies(); // ✅ Await the cookies
    const role = cookieStore.get('role')?.value;

    if (role !== 'admin') {
        redirect('/login');
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Admin</h2>
                <p className="text-gray-600">Manage the platform and monitor system activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/admin/user-management" className="block">
                    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                        <p className="text-gray-600">Manage farmers, buyers, and system users</p>
                    </div>
                </Link>

                <Link href="/dashboard/admin/qa" className="block">
                    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Q&A Management</h3>
                        <p className="text-gray-600">View and manage questions and answers</p>
                    </div>
                </Link>

            </div>
        </div>
    );
}