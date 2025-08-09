import Sidebar from '@/app/components/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value;
  const userId = cookieStore.get('userId')?.value;
  const userName = cookieStore.get('userName')?.value;
  const userEmail = cookieStore.get('userEmail')?.value;

  if (!role || !userId) {
    redirect('/login');
  }

  // Get user data from cookies, with fallbacks
  const userData = {
    name: userName || (role === 'farmer' ? 'Farmer User' : 
                      role === 'buyer' ? 'Buyer User' : 
                      role === 'admin' ? 'Admin User' : 'User'),
    role: role,
    email: userEmail || `${role}@farmmate.com`
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={userData.role} userName={userData.name} userEmail={userData.email} />
      <div className="flex-1 ml-64 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
