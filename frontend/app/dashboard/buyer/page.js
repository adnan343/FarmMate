'use client';

import WeatherWidget from '@/app/components/WeatherWidget';
import { Heart, Package, ShoppingCart, Store, TrendingUp, Clock, ArrowRight, Search, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/apiConfig';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function BuyerDashboard() {
  const [userName, setUserName] = useState('Buyer');
  const [stats, setStats] = useState({ orders: 0, favorites: 0, cartItems: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = document.cookie.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=');
      if (k === 'userName') acc = decodeURIComponent(v);
      return acc;
    }, 'Buyer');
    setUserName(name);

    const fetchData = async () => {
      try {
        const ordersRes = await fetch(getApiUrl('/orders/my-orders'), { credentials: 'include' });
        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          const orders = oData.data || oData.orders || [];
          setRecentOrders(orders.slice(0, 4));
          setStats(prev => ({ ...prev, orders: orders.length }));
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const kpis = [
    { label: 'Total Orders', value: stats.orders, icon: Package, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Browse Farmers', value: '→', icon: Store, color: 'from-teal-500 to-teal-600' },
    { label: 'Favorites', value: stats.favorites, icon: Heart, color: 'from-red-500 to-red-600' },
    { label: 'Cart Items', value: stats.cartItems, icon: ShoppingCart, color: 'from-amber-500 to-amber-600' },
  ];

  const quickActions = [
    { label: 'Browse Farmers', desc: 'Explore products from local farmers', href: '/dashboard/buyer/browse-farmers', icon: Store, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Marketplace', desc: 'Shop all available products', href: '/dashboard/buyer/marketplace', icon: Search, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'My Orders', desc: 'Track current and past orders', href: '/dashboard/buyer/my-orders', icon: Truck, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Favorites', desc: 'Your saved products', href: '/dashboard/buyer/favorites', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/50/10 border-red-500/20' },
    { label: 'Cart', desc: 'Review your cart', href: '/dashboard/buyer/cart', icon: ShoppingCart, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Checkout', desc: 'Complete your purchase', href: '/dashboard/buyer/checkout', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'shipped': case 'in transit': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'pending': case 'processing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'cancelled': return 'bg-red-500/50/10 text-red-400 border-red-500/20';
      default: return 'bg-surface-500/10 text-surface-400 border-surface-500/20';
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Welcome Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{userName}</span>
        </h1>
        <p className="text-surface-400 mt-1 text-sm sm:text-base">Discover fresh farm products from local growers.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} whileHover={{ y: -2 }} className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {loading ? <span className="inline-block w-8 h-6 skeleton" /> : kpi.value}
              </span>
            </div>
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={item} className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <motion.div whileHover={{ y: -2 }} className={`rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${action.bg}`}>
                  <action.icon className={`w-5 h-5 ${action.color} mb-2`} />
                  <h3 className="text-sm font-semibold text-white">{action.label}</h3>
                  <p className="text-xs text-surface-400 mt-0.5">{action.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Recent Orders</h2>
          <div className="glass-card rounded-2xl border border-white/[0.06] divide-y divide-white/[0.04]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4"><div className="h-4 w-3/4 skeleton rounded-lg mb-2" /><div className="h-3 w-1/2 skeleton rounded-lg" /></div>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Truck className="w-4 h-4 text-surface-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">Order #{order._id?.slice(-6) || 'N/A'}</p>
                      <p className="text-xs text-surface-400">{order.products?.length || 0} items</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status || 'pending'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <Package className="w-8 h-8 text-surface-600 mx-auto mb-2" />
                <p className="text-sm text-surface-400 mb-2">No orders yet</p>
                <p className="text-xs text-surface-500">Start exploring the marketplace to find fresh products.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Weather Widget */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Weather</h2>
        <WeatherWidget />
      </motion.div>
    </motion.div>
  );
}