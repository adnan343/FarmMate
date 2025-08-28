'use client';

import Sidebar from '@/app/components/Sidebar';
import { ToastProvider } from '@/app/components/ToastProvider';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      <div className="flex h-screen bg-gray-50">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Mobile header */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="text-lg font-bold text-gray-900">FarmMate</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
