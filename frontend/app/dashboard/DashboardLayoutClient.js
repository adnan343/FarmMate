'use client';

import Sidebar from '@/app/components/Sidebar';
import { ToastProvider } from '@/app/components/ToastProvider';
import { Menu, X, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardLayoutClient({ children, userData }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-surface-900 overflow-hidden">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative`}>
          <Sidebar 
            userRole={userData.role} 
            userName={userData.name} 
            userEmail={userData.email}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-0 min-w-0">
          {/* Mobile header */}
          <div className="md:hidden bg-surface-800/80 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-surface-300" />
              ) : (
                <Menu className="w-5 h-5 text-surface-300" />
              )}
            </button>
            <Link href={userData.role === 'farmer' ? '/dashboard/farmer' : userData.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/admin'} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">FarmMate</span>
            </Link>
            <div className="w-9" />
          </div>
          
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}