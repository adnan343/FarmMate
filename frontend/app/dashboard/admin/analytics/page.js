'use client';

import { getApiUrl } from '@/lib/apiConfig';
import { Users, Package, DollarSign, Activity, ShoppingCart, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(getApiUrl('/analytics/admin'), {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.message || 'Failed to load analytics');
      }
    } catch (e) {
      console.error('Error fetching analytics:', e);
      setError('Failed to connect to analytics service');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Platform Analytics</h1>
        <div className="glass-card rounded-2xl border border-red-500/20 p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-red-300 mb-2">Failed to Load Analytics</h2>
          <p className="text-sm text-surface-400">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-sm hover:brightness-110"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: Users, color: 'from-emerald-500 to-emerald-600', sub: `${analytics?.totalFarmers || 0} farmers · ${analytics?.totalBuyers || 0} buyers` },
    { label: 'Total Products', value: analytics?.totalProducts || 0, icon: Package, color: 'from-teal-500 to-teal-600', sub: 'Across all farmers' },
    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: ShoppingCart, color: 'from-amber-500 to-amber-600', sub: 'All time orders' },
    { label: 'Total Revenue', value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-sky-500 to-sky-600', sub: 'Platform total' },
  ];

  const statusBreakdown = analytics?.statusBreakdown || {};
  const statusTotal = Object.values(statusBreakdown).reduce((a, b) => a + b, 0) || 1;

  const statusColors = {
    pending: { fill: '#f59e0b', bg: 'bg-amber-500' },
    confirmed: { fill: '#0ea5e9', bg: 'bg-sky-500' },
    shipped: { fill: '#8b5cf6', bg: 'bg-purple-500' },
    delivered: { fill: '#10b981', bg: 'bg-emerald-500' },
    cancelled: { fill: '#ef4444', bg: 'bg-red-500' },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Platform Analytics</h1>
        <p className="text-surface-400 mt-1">System-wide metrics and performance indicators</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} whileHover={{ y: -2 }} className="glass-card rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{kpi.value}</p>
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mt-1">{kpi.label}</p>
            {kpi.sub && <p className="text-[10px] text-surface-500 mt-0.5">{kpi.sub}</p>}
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-semibold text-white">Order Status Breakdown</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(statusBreakdown).map(([status, count]) => {
              const percent = ((count / statusTotal) * 100).toFixed(1);
              const colors = statusColors[status] || { bg: 'bg-surface-500' };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white capitalize">{status}</span>
                    <span className="text-sm text-surface-400">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Revenue & Orders Summary */}
        <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Quick Summary</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Avg. Revenue/Order</p>
              <p className="text-xl font-bold text-white">
                ${analytics?.totalOrders ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Cancellation Rate</p>
              <p className="text-xl font-bold text-white">
                {analytics?.totalOrders ? ((statusBreakdown.cancelled || 0) / analytics.totalOrders * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Delivery Rate</p>
              <p className="text-xl font-bold text-white">
                {analytics?.totalOrders ? ((statusBreakdown.delivered || 0) / analytics.totalOrders * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Products/User</p>
              <p className="text-xl font-bold text-white">
                {analytics?.totalUsers ? (analytics.totalProducts / analytics.totalUsers).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Distribution */}
      <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">User Distribution</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Farmers', count: analytics?.totalFarmers || 0, color: 'from-emerald-500 to-emerald-600', percent: analytics?.totalUsers ? ((analytics.totalFarmers / analytics.totalUsers) * 100).toFixed(1) : 0 },
            { label: 'Buyers', count: analytics?.totalBuyers || 0, color: 'from-sky-500 to-sky-600', percent: analytics?.totalUsers ? ((analytics.totalBuyers / analytics.totalUsers) * 100).toFixed(1) : 0 },
            { label: 'Admins', count: (analytics?.totalUsers || 0) - (analytics?.totalFarmers || 0) - (analytics?.totalBuyers || 0), color: 'from-purple-500 to-purple-600', percent: analytics?.totalUsers ? (((analytics.totalUsers - analytics.totalFarmers - analytics.totalBuyers) / analytics.totalUsers) * 100).toFixed(1) : 0 },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{item.count}</p>
              <p className="text-sm text-surface-400">{item.label}</p>
              <p className="text-xs text-surface-500 mt-1">{item.percent}% of total</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}