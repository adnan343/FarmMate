'use client';

import { getApiUrl } from '@/lib/apiConfig';
import { ChevronLeft, ChevronRight, Eye, Search, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(getApiUrl('/orders'), { credentials: 'include' });
      const data = await res.json();
      if (data.success) setOrders(data.data || []);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(getApiUrl(`/orders/${orderId}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?._id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const buyer = order.buyer || {};
      return (buyer.name || '').toLowerCase().includes(q) || order._id.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const currentOrders = filteredOrders.slice(startIdx, startIdx + perPage);

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/50/10 text-red-400 border-red-500/20',
  };

  const statusIcons = {
    pending: Clock, confirmed: CheckCircle, shipped: Truck, delivered: CheckCircle, cancelled: XCircle,
  };

  const getNextStatus = (currentStatus) => {
    const flow = ['pending', 'confirmed', 'shipped', 'delivered'];
    const idx = flow.indexOf(currentStatus);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  const getPrevStatus = (currentStatus) => {
    const flow = ['pending', 'confirmed', 'shipped', 'delivered'];
    const idx = flow.indexOf(currentStatus);
    return idx > 0 ? flow[idx - 1] : null;
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Order Management</h1>
          <p className="text-surface-400 mt-1">Monitor and manage all platform orders</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by order ID or buyer name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-surface-800/60 border border-white/10 rounded-xl text-sm text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: orders.length, color: 'text-white' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-400' },
          { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, color: 'text-sky-400' },
          { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: 'text-purple-400' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl border border-white/[0.06] p-3 text-center">
            <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-surface-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">Buyer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-surface-400">Loading orders...</td></tr>
              ) : currentOrders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-surface-400">
                  <Package className="w-8 h-8 mx-auto mb-2 text-surface-500" />
                  No orders found.
                </td></tr>
              ) : currentOrders.map((order, idx) => {
                const StatusIcon = statusIcons[order.status] || Clock;
                return (
                  <tr key={order._id || idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-white">#{order._id?.slice(-8) || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-white">{order.buyer?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-surface-400">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 text-sm text-white">${(order.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full border ${statusColors[order.status] || statusColors.pending}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                          className="text-sky-400 hover:text-sky-300 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'confirmed')}
                            className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded hover:bg-sky-500/20"
                          >
                            Confirm
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'shipped')}
                            className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded hover:bg-purple-500/20"
                          >
                            Ship
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                            className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded hover:bg-emerald-500/20"
                          >
                            Deliver
                          </button>
                        )}
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                            className="text-xs bg-red-500/50/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded hover:bg-red-500/50/20"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={item} className="flex items-center justify-between">
          <span className="text-sm text-surface-400">
            Showing {startIdx + 1}-{Math.min(startIdx + perPage, filteredOrders.length)} of {filteredOrders.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-white/10 rounded-lg text-sm text-surface-300 hover:bg-white/[0.02] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-white">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-white/10 rounded-lg text-sm text-surface-300 hover:bg-white/[0.02] disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-surface-800 border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Order #{selectedOrder._id?.slice(-8)}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-xs text-surface-400 uppercase tracking-wider">Buyer</span>
                <p className="text-sm font-semibold text-white">{selectedOrder.buyer?.name || 'Unknown'}</p>
                <p className="text-xs text-surface-400">{selectedOrder.buyer?.email || ''}</p>
              </div>
              <div>
                <span className="text-xs text-surface-400 uppercase tracking-wider">Status</span>
                <p className="mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold uppercase rounded-full border ${statusColors[selectedOrder.status] || statusColors.pending}`}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-xs text-surface-400 uppercase tracking-wider">Total</span>
                <p className="text-sm font-semibold text-white">${(selectedOrder.total || 0).toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs text-surface-400 uppercase tracking-wider">Payment</span>
                <p className="text-sm font-semibold text-white capitalize">{selectedOrder.paymentMethod || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-surface-400 uppercase tracking-wider">Date</span>
                <p className="text-sm text-white">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '-'}</p>
              </div>
              {selectedOrder.shippingAddress && (
                <div className="col-span-2">
                  <span className="text-xs text-surface-400 uppercase tracking-wider">Shipping Address</span>
                  <p className="text-sm text-white">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>

            {/* Items */}
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Items</h3>
            <div className="space-y-2 mb-6">
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <p className="text-sm font-medium text-white">{item.name || 'Product'}</p>
                    <p className="text-xs text-surface-400">Qty: {item.quantity} × ${item.price}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
              {selectedOrder.status === 'pending' && (
                <button onClick={() => { updateOrderStatus(selectedOrder._id, 'confirmed'); }} className="px-4 py-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl text-sm hover:bg-sky-500/20">
                  Mark Confirmed
                </button>
              )}
              {selectedOrder.status === 'confirmed' && (
                <button onClick={() => { updateOrderStatus(selectedOrder._id, 'shipped'); }} className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-sm hover:bg-purple-500/20">
                  Mark Shipped
                </button>
              )}
              {selectedOrder.status === 'shipped' && (
                <button onClick={() => { updateOrderStatus(selectedOrder._id, 'delivered'); }} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm hover:bg-emerald-500/20">
                  Mark Delivered
                </button>
              )}
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
                <button onClick={() => { updateOrderStatus(selectedOrder._id, 'cancelled'); }} className="px-4 py-2 bg-red-500/50/10 text-red-400 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/50/20">
                  Cancel Order
                </button>
              )}
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-white/10 text-surface-300 rounded-xl text-sm hover:bg-white/5 ml-auto">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}