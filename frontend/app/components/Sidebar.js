'use client';

import {
    BarChart3,
    Calendar,
    ChevronDown,
    ChevronUp,
    FileText,
    Heart,
    Home,
    Leaf,
    List,
    LogOut,
    Mail,
    MessageCircle,
    Monitor,
    Package,
    ShoppingCart,
    Store,
    User,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function Sidebar({ userRole, userName, userEmail, onClose }) {
  const [expandedSections, setExpandedSections] = useState({
    'my-farm': true,
    'planning': true,
    'profile': false
  });
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const prefetchLink = useCallback((path) => {
    router.prefetch(path);
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => pathname === path;

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile', children: [] }
    ];

    switch (userRole) {
      case 'farmer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard/farmer', children: [] },
          { id: 'my-farm', label: 'My Farm', icon: Monitor, children: [
            { label: 'Farm Profile', path: '/dashboard/farmer/farm-profile' },
            { label: 'My Products', path: '/dashboard/farmer/my-products' },
            { label: 'My Orders', path: '/dashboard/farmer/my-orders' },
            { label: 'Farm Condition Reports', path: '/dashboard/farmer/farm-condition-reports' }
          ]},
          { id: 'planning', label: 'Planning', icon: Calendar, children: [
            { label: 'Crop Suggestions', path: '/dashboard/farmer/crop-suggestions' },
            { label: 'Planting Calendar', path: '/dashboard/farmer/planting-calendar' }
          ]},
          { id: 'pest-detection', label: 'Pest Detection', icon: FileText, path: '/dashboard/farmer/pest-detection', children: [] },
          { id: 'task-management', label: 'Task Management', icon: List, path: '/dashboard/farmer/task-management', children: [] },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/farmer/analytics', children: [] },
          { id: 'community', label: 'Community Forum', icon: Users, path: '/dashboard/farmer/community', children: [] },
          { id: 'qa', label: 'Q&A Support', icon: MessageCircle, path: '/dashboard/farmer/qa', children: [] },
          ...baseItems
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard/admin', children: [] },
          { id: 'user-management', label: 'User Management', icon: Users, path: '/dashboard/admin/user-management', children: [] },
          { id: 'order-management', label: 'Order Management', icon: Package, path: '/dashboard/admin/order-management', children: [] },
          { id: 'platform-analytics', label: 'Platform Analytics', icon: BarChart3, path: '/dashboard/admin/analytics', children: [] },
          { id: 'qa-management', label: 'Q&A Management', icon: MessageCircle, path: '/dashboard/admin/qa', children: [] },
          ...baseItems
        ];
      case 'buyer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard/buyer', children: [] },
          { id: 'browse-farmers', label: 'Browse Farmers', icon: Store, path: '/dashboard/buyer/browse-farmers', children: [] },
          { id: 'marketplace', label: 'Marketplace', icon: Store, path: '/dashboard/buyer/marketplace', children: [] },
          { id: 'my-orders', label: 'My Orders', icon: Package, path: '/dashboard/buyer/my-orders', children: [] },
          { id: 'favorites', label: 'Favorites', icon: Heart, path: '/dashboard/buyer/favorites', children: [] },
          { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/dashboard/buyer/cart', children: [] },
          ...baseItems
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getUserInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'farmer': return 'Farmer';
      case 'buyer': return 'Buyer';
      case 'admin': return 'Administrator';
      default: return role;
    }
  };

  return (
    <div className={`${isMobile ? 'w-80' : 'w-64'} h-full bg-surface-800 border-r border-white/[0.06] flex flex-col`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/[0.06] flex items-center justify-between">
        <Link href={userRole === 'farmer' ? '/dashboard/farmer' : userRole === 'buyer' ? '/dashboard/buyer' : userRole === 'admin' ? '/dashboard/admin' : '/'} className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-soft">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">FarmMate</span>
        </Link>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-surface-400" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-3 space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            if (item.children && item.children.length > 0) {
              const isExpanded = expandedSections[item.id];
              return (
                <div key={item.id}>
                  <button onClick={() => toggleSection(item.id)} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200 group">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-surface-400 group-hover:text-surface-200 transition-colors" />
                      <span className="text-sm font-medium text-surface-300 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-surface-500" /> : <ChevronDown className="w-3 h-3 text-surface-500" />}
                  </button>
                  {isExpanded && (
                    <div className="ml-6 mt-0.5 space-y-0.5">
                      {item.children.map((child, index) => {
                        const active = isActive(child.path);
                        return (
                          <Link key={index} href={child.path} className={`relative flex items-center p-2 rounded-xl text-sm transition-all duration-200 ${active ? 'text-white font-medium' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.03]'}`} onClick={handleLinkClick} onMouseEnter={() => prefetchLink(child.path)}>
                            {active && <span className="nav-indicator" />}
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            } else {
              const active = isActive(item.path);
              return (
                <Link key={item.id} href={item.path} className={`relative flex items-center gap-2.5 p-2 rounded-xl transition-all duration-200 group ${active ? 'text-white font-medium' : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.03]'}`} onClick={handleLinkClick} onMouseEnter={() => prefetchLink(item.path)}>
                  {active && <span className="nav-indicator" />}
                  <Icon className={`w-4 h-4 transition-colors ${active ? 'text-emerald-400' : 'text-surface-500 group-hover:text-surface-300'}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            }
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.06] bg-surface-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-xs">{getUserInitials(userName)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-[10px] text-surface-400 uppercase tracking-wider">{getRoleDisplayName(userRole)}</p>
            </div>
          </div>
          <Link href="/logout" className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-surface-200 transition-all" onClick={handleLinkClick}>
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}