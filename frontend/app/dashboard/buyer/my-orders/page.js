'use client';

import { AlertCircle, Calendar, CheckCircle, Clock, MapPin, Package, ShoppingBag, Truck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    const userId = cookies.userId;
    if (userId) setUser({ _id: userId });
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const userId = cookies.userId;
      if (!userId) {
        alert('Please log in to view your orders');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOrders(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helpers to split a single order into per-farmer sub-orders
  const aggregateStatus = (items) => {
    const statuses = items.map(i => i.status || 'pending');
    if (statuses.every(s => s === 'cancelled')) return 'cancelled';
    if (statuses.every(s => s === 'delivered')) return 'delivered';
    if (statuses.some(s => s === 'shipped')) return 'shipped';
    if (statuses.some(s => s === 'confirmed')) return 'confirmed';
    return 'pending';
  };

  const splitOrderByFarmer = (order) => {
    const groups = new Map();
    order.items.forEach(item => {
      const farmerId = item?.farmer?._id || item?.farmer || 'unknown';
      if (!groups.has(farmerId)) {
        groups.set(farmerId, {
          parentOrderId: order._id,
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          notes: order.notes,
          buyerTotal: order.total,
          farmer: item.farmer,
          items: [],
          total: 0,
          status: 'pending'
        });
      }
      const g = groups.get(farmerId);
      g.items.push(item);
      g.total += item.price * item.quantity;
    });
    // finalize status per group
    groups.forEach(g => { g.status = aggregateStatus(g.items); });
    return Array.from(groups.values());
  };

  const groupedOrders = orders.flatMap(splitOrderByFarmer);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your current and past orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {loading ? 'Loading orders...' : `${groupedOrders.length} Orders Found`}
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">You haven&apos;t placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedOrders.map((g, idx) => (
              <div key={`${g.parentOrderId}-${idx}`} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{g.parentOrderId.slice(-8)} • {g.farmer?.name || 'Unknown farmer'}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(g.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(g.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(g.status)}`}>
                      {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Items for this farmer */}
                <div className="space-y-3 mb-4">
                  {g.items.map((item, index) => (
                    <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${item.status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50'}`}>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-lg">🌾</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} {item.productId?.unit || 'unit(s)'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Farmer: {item.farmer?.name || 'Unknown'}
                          {item.status && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              item.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              item.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                              item.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {g.shippingAddress && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-sm text-gray-600">
                          <p>{g.shippingAddress.street}</p>
                          <p>{g.shippingAddress.city}, {g.shippingAddress.state} {g.shippingAddress.zipCode}</p>
                          <p>{g.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Order Date: {formatDate(g.orderDate)}</span>
                      </div>
                      {g.deliveryDate && (
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span>Delivered: {formatDate(g.deliveryDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Payment: {g.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Total: ${g.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {g.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                    <p className="text-sm text-gray-600">{g.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 