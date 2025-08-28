'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { useToast } from '@/app/components/ToastProvider';
import { ArrowLeft, CreditCard, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const userId = cookies.userId;
      
      if (!userId) {
        console.error('User ID not found');
        setLoading(false);
        return;
      }

      const response = await fetch(`https://farmmate-production.up.railway.app/api/cart/${userId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCart(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItem(itemId);
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const userId = cookies.userId;
      
      const response = await fetch(`https://farmmate-production.up.railway.app/api/cart/${userId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCart(result.data);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.msg || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const userId = cookies.userId;
      
      const response = await fetch(`https://farmmate-production.up.railway.app/api/cart/${userId}/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCart(result.data);
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const userId = cookies.userId;
      
      const response = await fetch(`https://farmmate-production.up.railway.app/api/cart/${userId}/clear`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCart(result.data);
          toast.success('Cart cleared');
        }
      } else {
        toast.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const onClickClearCart = () => setConfirmClearOpen(true);
  const onCancelClear = () => setConfirmClearOpen(false);
  const onConfirmClear = async () => {
    setConfirmClearOpen(false);
    await clearCart();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/dashboard/buyer/marketplace" 
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-sm sm:text-base text-gray-600">
          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to get started</p>
          <Link
            href="/dashboard/buyer/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={onClickClearCart}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item._id} className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-lg"></div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">Farmer: {item.farmer?.name || 'Unknown'}</p>
                        <p className="text-base sm:text-lg font-semibold text-teal-600">${item.price.toFixed(2)}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Stock: {item.productId?.stock || 'Unknown'} available
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={updatingItem === item._id}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {updatingItem === item._id ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={updatingItem === item._id}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="mt-4 text-right">
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                  <span className="font-medium">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(cart.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-teal-600">${(cart.total * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/dashboard/buyer/checkout')}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/dashboard/buyer/marketplace"
                  className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Clear cart confirmation */}
      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear cart?"
        description="This will remove all items from your cart."
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={onConfirmClear}
        onCancel={onCancelClear}
      />
    </div>
  );
} 