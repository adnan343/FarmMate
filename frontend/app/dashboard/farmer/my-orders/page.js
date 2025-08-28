'use client';

import {
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Filter,
    Mail,
    MapPin,
    Package,
    Phone,
    Truck,
    User,
    XCircle
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchUserAndOrders = useCallback(async () => {
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const userId = cookies.userId;
      if (!userId) return;

      setUser({ _id: userId });

      // Fetch farmer's orders
      const url = selectedStatus === 'all' 
        ? `http://localhost:5000/api/orders/farmer/${userId}`
        : `http://localhost:5000/api/orders/farmer/${userId}?status=${selectedStatus}`;

      const response = await fetch(url, {
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
  }, [selectedStatus]);

  useEffect(() => {
    fetchUserAndOrders();
  }, [selectedStatus, fetchUserAndOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Replace with server-updated order so item-level statuses are accurate
          setOrders(prev => prev.map(order => 
            order._id === orderId ? result.data : order
          ));
          if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder(result.data);
          }
        }
      } else {
        const errorResult = await response.json();
        alert(errorResult.msg || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
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

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Some historical orders may have items where farmer was deleted
  // or not populated (null). This helper safely determines ownership.
  const isMyItem = (item) => {
    if (!item || !user) return false;
    const farmerId = item?.farmer?._id || item?.farmer; // populated doc or ObjectId/string
    if (!farmerId || !user._id) return false;
    return String(farmerId) === String(user._id);
  };

  const getMyProductsFromOrder = (order) => {
    if (!order || !Array.isArray(order.items)) return [];
    return order.items.filter((item) => isMyItem(item));
  };

  const getMyActionPermissions = (order) => {
    const myItems = getMyProductsFromOrder(order);
    const hasPending = myItems.some(i => (i.status || 'pending') === 'pending');
    const hasConfirmed = myItems.some(i => i.status === 'confirmed');
    const hasShipped = myItems.some(i => i.status === 'shipped');
    const hasActive = myItems.some(i => !['cancelled', 'delivered'].includes(i.status));
    return {
      canConfirm: hasPending,
      canShip: !hasPending && hasConfirmed,
      canDeliver: !hasPending && !hasConfirmed && hasShipped,
      canCancel: hasActive,
    };
  };

  const getMyProductsTotal = (order) => {
    const myProducts = getMyProductsFromOrder(order);
    return myProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Manage orders for your products</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? "You don't have any orders yet. Orders will appear here when customers purchase your products."
                : `No ${selectedStatus} orders found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const myProducts = getMyProductsFromOrder(order);
              const myProductsTotal = getMyProductsTotal(order);
              
              return (
                <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </span>
                      <button
                        onClick={() => openOrderModal(order)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{order.buyer.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{order.buyer.email}</span>
                        </div>
                        {order.buyer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{order.buyer.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* My Products in this Order */}
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Your Products in this Order:</h5>
                    <div className="space-y-2">
                      {myProducts.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h6 className="font-medium text-gray-900">{item.name}</h6>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Your Total:</span>
                      <span className="font-semibold text-gray-900">${myProductsTotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Status Update Buttons */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const p = getMyActionPermissions(order);
                        return (
                          <>
                            {p.canConfirm && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                disabled={updatingStatus === order._id}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === order._id ? 'Updating...' : 'Confirm'}
                              </button>
                            )}
                            {p.canShip && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'shipped')}
                                disabled={updatingStatus === order._id}
                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === order._id ? 'Updating...' : 'Mark Shipped'}
                              </button>
                            )}
                            {p.canDeliver && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'delivered')}
                                disabled={updatingStatus === order._id}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === order._id ? 'Updating...' : 'Mark Delivered'}
                              </button>
                            )}
                            {p.canCancel && (
                              <button
                                onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                disabled={updatingStatus === order._id}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {updatingStatus === order._id ? 'Updating...' : 'Cancel'}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowOrderModal(false)} />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-gray-600">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <button
                  onClick={closeOrderModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Order Status */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                {getStatusIcon(selectedOrder.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  Ordered on {formatDate(selectedOrder.createdAt)}
                </span>
              </div>

              {/* Buyer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedOrder.buyer.name}</h4>
                      <p className="text-sm text-gray-600">{selectedOrder.buyer.email}</p>
                    </div>
                  </div>
                  {selectedOrder.buyer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{selectedOrder.buyer.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items (only your products) */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Items in this Order</h3>
                <div className="space-y-3">
                  {getMyProductsFromOrder(selectedOrder).map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-green-100`}>
                          <Package className={`w-6 h-6 text-green-600`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Farmer: {item?.farmer?.name || 'You'}
                            <span className="ml-2 text-green-600 font-medium">(Your Product)</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary (your share only) */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Your Total:</span>
                    <span className="font-semibold text-gray-900">
                      ${getMyProductsTotal(selectedOrder).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Buyer Paid Total (all sellers):</span>
                    <span className="font-semibold text-gray-900">${getMyProductsTotal(selectedOrder).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 