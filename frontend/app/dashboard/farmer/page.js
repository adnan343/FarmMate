'use client';

import WeatherWidget from '@/app/components/WeatherWidget';
import { BarChart3, Calendar, CheckCircle, Clock, Leaf, List, Package, Sprout, TrendingUp, AlertTriangle, Brain } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/apiConfig';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function FarmerDashboard() {
  const [userName, setUserName] = useState('Farmer');
  const [stats, setStats] = useState({ products: 0, orders: 0, tasks: 0, pests: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = document.cookie.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=');
      if (k === 'userName') acc = decodeURIComponent(v);
      return acc;
    }, 'Farmer');
    setUserName(name);

    const fetchData = async () => {
      try {
        const userId = document.cookie.split(';').reduce((acc, c) => {
          const [k, v] = c.trim().split('=');
          if (k === 'userId') acc = v;
          return acc;
        }, '');
        
        if (!userId) return;
        
        const [tasksRes, productsRes, ordersRes] = await Promise.allSettled([
          fetch(getApiUrl(`/tasks/farmer/${userId}`), { credentials: 'include' }),
          fetch(getApiUrl(`/products/farmer/${userId}/own`), { credentials: 'include' }),
          fetch(getApiUrl(`/orders/farmer/${userId}`), { credentials: 'include' }),
        ]);

        if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
          const tData = await tasksRes.value.json();
          const tasks = tData.data || tData.tasks || [];
          setRecentTasks(tasks.slice(0, 4));
          setStats(prev => ({ ...prev, tasks: tasks.filter(t => t.status !== 'completed').length }));
        }
        if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
          const pData = await productsRes.value.json();
          setStats(prev => ({ ...prev, products: (pData.data || pData.products || []).length }));
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const oData = await ordersRes.value.json();
          setStats(prev => ({ ...prev, orders: (oData.data || oData.orders || []).length }));
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const kpis = [
    { label: 'My Products', value: stats.products, icon: Package, color: 'from-emerald-500 to-emerald-600', glow: 'bg-emerald-500/10' },
    { label: 'Active Orders', value: stats.orders, icon: TrendingUp, color: 'from-teal-500 to-teal-600', glow: 'bg-teal-500/10' },
    { label: 'Pending Tasks', value: stats.tasks, icon: List, color: 'from-amber-500 to-amber-600', glow: 'bg-amber-500/10' },
    { label: 'AI Insights', value: 3, icon: Brain, color: 'from-sky-500 to-sky-600', glow: 'bg-sky-500/10' },
  ];

  const quickActions = [
    { label: 'My Products', desc: 'Manage your product listings', href: '/dashboard/farmer/my-products', icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Orders', desc: 'Track incoming orders', href: '/dashboard/farmer/my-orders', icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Crop Suggestions', desc: 'AI-powered recommendations', href: '/dashboard/farmer/crop-suggestions', icon: Sprout, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Task Management', desc: 'View and manage tasks', href: '/dashboard/farmer/task-management', icon: List, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Analytics', desc: 'View performance metrics', href: '/dashboard/farmer/analytics', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Pest Detection', desc: 'AI pest identification', href: '/dashboard/farmer/pest-detection', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/50/10 border-red-500/20' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/50/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Welcome Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{userName}</span>
        </h1>
        <p className="text-surface-400 mt-1 text-sm sm:text-base">Here's what's happening on your farm today.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -2 }}
            className="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl sm:text-3xl font-bold text-white tracking-tight`}>
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
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${action.bg}`}
                >
                  <action.icon className={`w-5 h-5 ${action.color} mb-2`} />
                  <h3 className="text-sm font-semibold text-white">{action.label}</h3>
                  <p className="text-xs text-surface-400 mt-0.5">{action.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">AI Insights</h2>
          <div className="space-y-3">
            {[
              { icon: TrendingUp, text: 'Tomato yield prediction increased by 12%', type: 'insight', color: 'border-emerald-500/20 bg-emerald-500/5' },
              { icon: AlertTriangle, text: 'Pest risk detected in sector B — review recommended', type: 'warning', color: 'border-amber-500/20 bg-amber-500/5' },
              { icon: CheckCircle, text: 'Irrigation schedule optimized for this week', type: 'action', color: 'border-sky-500/20 bg-sky-500/5' },
            ].map((insight, i) => (
              <div key={i} className={`rounded-xl border p-3 flex items-start gap-3 ${insight.color}`}>
                <insight.icon className="w-4 h-4 mt-0.5 shrink-0 text-surface-300" />
                <p className="text-xs text-surface-300 leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Recent Tasks</h2>
          <div className="glass-card rounded-2xl border border-white/[0.06] divide-y divide-white/[0.04]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4"><div className="h-4 w-3/4 skeleton rounded-lg mb-2" /><div className="h-3 w-1/2 skeleton rounded-lg" /></div>
              ))
            ) : recentTasks.length > 0 ? (
              recentTasks.map((task, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Clock className="w-4 h-4 text-surface-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{task.title || task.name || 'Task'}</p>
                      <p className="text-xs text-surface-400">{task.category || 'General'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'low'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <List className="w-8 h-8 text-surface-600 mx-auto mb-2" />
                <p className="text-sm text-surface-400">No tasks yet. Start by adding products or planting crops.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Weather Widget */}
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Weather</h2>
          <WeatherWidget />
        </motion.div>
      </div>
    </motion.div>
  );
}