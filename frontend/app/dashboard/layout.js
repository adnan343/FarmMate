import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient';

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
    <DashboardLayoutClient userData={userData}>
      {children}
    </DashboardLayoutClient>
  );
}
