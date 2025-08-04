'use client';

import {
    BarChart3,
    Calendar,
    ChevronDown,
    ChevronUp,
    FileText,
    Heart,
    Home,
    List,
    LogOut,
    Mail,
    MessageCircle,
    Monitor,
    Package,
    ShoppingCart,
    Store,
    User,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ userRole, userName, userEmail }) {
  const [expandedSections, setExpandedSections] = useState({
    'my-farm': true,
    'planning': true,
    'profile': false
  });
  const pathname = usePathname();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => pathname === path;

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        id: 'profile',
        label: 'Profile',
        icon: User,
        path: '/dashboard/profile',
        children: []
      }
    ];

    switch (userRole) {
      case 'farmer':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/dashboard/farmer',
            children: []
          },
          {
            id: 'my-farm',
            label: 'My Farm',
            icon: Monitor,
            children: [
              { label: 'Farm Profile', path: '/dashboard/farmer/farm-profile' },
              { label: 'Condition Reports', path: '/dashboard/farmer/condition-reports' }
            ]
          },
          {
            id: 'planning',
            label: 'Planning',
            icon: Calendar,
            children: [
              { label: 'Crop Suggestions', path: '/dashboard/farmer/crop-suggestions' },
              { label: 'Planting Calendar', path: '/dashboard/farmer/planting-calendar' }
            ]
          },
          {
            id: 'pest-detection',
            label: 'Pest Detection',
            icon: FileText,
            path: '/dashboard/farmer/pest-detection',
            children: []
          },
          {
            id: 'task-management',
            label: 'Task Management',
            icon: List,
            path: '/dashboard/farmer/task-management',
            children: []
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            path: '/dashboard/farmer/analytics',
            children: []
          },
          {
            id: 'community',
            label: 'Community Forum',
            icon: Users,
            path: '/dashboard/farmer/community',
            children: []
          },
          {
            id: 'qa',
            label: 'Q&A Support',
            icon: MessageCircle,
            path: '/dashboard/farmer/qa',
            children: []
          },
          ...baseItems
        ];
      
      case 'admin':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/dashboard/admin',
            children: []
          },
          {
            id: 'user-management',
            label: 'User Management',
            icon: Users,
            path: '/dashboard/admin/user-management',
            children: []
          },
          {
            id: 'qa-management',
            label: 'Q&A Management',
            icon: MessageCircle,
            path: '/dashboard/admin/qa',
            children: []
          },
          ...baseItems
        ];
      
      case 'buyer':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/dashboard/buyer',
            children: []
          },
          {
            id: 'browse-farmers',
            label: 'Browse Farmers',
            icon: Store,
            path: '/dashboard/buyer/browse-farmers',
            children: []
          },
          {
            id: 'marketplace',
            label: 'Marketplace',
            icon: Store,
            path: '/dashboard/buyer/marketplace',
            children: []
          },
          {
            id: 'my-orders',
            label: 'My Orders',
            icon: Package,
            path: '/dashboard/buyer/my-orders',
            children: []
          },
          {
            id: 'favorites',
            label: 'Favorites',
            icon: Heart,
            path: '/dashboard/buyer/favorites',
            children: []
          },
          {
            id: 'cart',
            label: 'Cart',
            icon: ShoppingCart,
            path: '/dashboard/buyer/cart',
            children: []
          },
          ...baseItems
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'farmer':
        return 'Farmer';
      case 'buyer':
        return 'Buyer';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FarmMate</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          
          if (item.children && item.children.length > 0) {
            // Expandable section
            const isExpanded = expandedSections[item.id];
            return (
              <div key={item.id}>
                <button
                  onClick={() => toggleSection(item.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child, index) => (
                      <Link
                        key={index}
                        href={child.path}
                        className={`block p-2 rounded-lg text-sm transition-colors ${
                          isActive(child.path)
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            // Single item
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          }
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">{getUserInitials(userName)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
              <p className="text-xs text-gray-500 capitalize">{getRoleDisplayName(userRole)}</p>
            </div>
          </div>
          <Link href="/logout" className="p-2 rounded-lg hover:bg-gray-50">
            <LogOut className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      </div>
    </div>
  );
} 