'use client';

import WeatherWidget from '@/app/components/WeatherWidget';
import { BarChart3, Users, Package, MessageCircle, Shield, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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

export default function AdminDashboard() {
  const [userName, setUserName] = useState('Admin');
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, questions: 0 });
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState([]);

  useEffect(() => {
    const name = document.cookie.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=');
      if (k === 'userName') acc = decodeURIComponent(v);
      return acc;
    }, 'Admin');
    setUserName(name);

    const fetchData = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.allSettled([
          fetch(getApiUrl('/users'), { credentials: 'include' }),
          fetch(getApiUrl('/orders'), { credentials: 'include' }),
        ]);
        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
          const uData = await usersRes.value.json();
          setStats(prev => ({ ...prev, users: (uData.data || uData.users || []).length }));
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const oData = await ordersRes.value.json();
          setStats(prev => ({ ...prev, orders: (oData.data || oData.orders || []).length }));
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();

    setSystemHealth([
      { name: 'API Server', status: 'operational', uptime: '99.9%' },
      { name: 'Database', status: 'operational', uptime: '99.8%' },
      { name: 'AI Services', status: 'operational', uptime: '99.5%' },
      { name: 'File Storage', status: 'operational', uptime: '99.7%' },
    ]);
  }, []);

  const kpis = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Total Orders', value: stats.orders, icon: Package, color: 'from-teal-500 to-teal-600' },
    { label: 'Platform Health', value: '99%', icon: Activity, color: 'from-sky-500 to-sky-600' },
    { label: 'Active Issues', value: 0, icon: AlertTriangle, color: 'from-amber-500 to-amber-600' },
  ];

  const quickActions = [
    { label: 'User Management', desc: 'Manage farmers, buyers, and admins', href: '/dashboard/admin/user-management', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Order Management', desc: 'Monitor and manage all orders', href: '/dashboard/admin/order-management', icon: Package, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Platform Analytics', desc: 'View platform metrics and trends', href: '/dashboard/admin/analytics', icon: BarChart3, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Q&A Management', desc: 'Manage community questions', href: '/dashboard/admin/qa', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Welcome Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{userName}</span>
          </h1>
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-surface-400 text-sm sm:text-base">Platform overview and management console.</p>
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
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Management</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <motion.div whileHover={{ y: -2 }} className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${action.bg}`}>
                  <action.icon className={`w-5 h-5 ${action.color} mb-2`} />
                  <h3 className="text-sm font-semibold text-white">{action.label}</h3>
                  <p className="text-xs text-surface-400 mt-0.5">{action.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">System Health</h2>
          <div className="glass-card rounded-2xl border border-white/[0.06] divide-y divide-white/[0.04]">
            {systemHealth.map((service, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  <span className="text-sm font-medium text-white">{service.name}</span>
                </div>
                <span className="text-xs text-surface-400">{service.uptime}</span>
              </div>
            ))}
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
