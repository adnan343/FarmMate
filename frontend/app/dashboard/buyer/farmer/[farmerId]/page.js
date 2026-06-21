'use client';

import { getApiUrl } from '@/lib/apiConfig';
import { ArrowLeft, Mail, MapPin, Phone, Package, ShoppingCart, Store, Sprout } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

export default function FarmerDetailPage() {
  const params = useParams();
  const farmerId = params.farmerId;
  const router = useRouter();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingCart, setAddingCart] = useState(null);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    if (farmerId) fetchFarmerData();
  }, [farmerId]);

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      // Fetch farmer info
      const farmerRes = await fetch(getApiUrl(`/users/farmer-profile/${farmerId}`), { credentials: 'include' });
      const farmerData = await farmerRes.json();
      if (!farmerData.success) {
        setError('Farmer not found');
        setLoading(false);
        return;
      }
      setFarmer(farmerData.data);

      // Fetch farmer's marketplace products
      const prodRes = await fetch(getApiUrl(`/products/farmer/${farmerId}`), { credentials: 'include' });
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.data || []);
      }
    } catch (e) {
      console.error('Error fetching farmer:', e);
      setError('Failed to load farmer data');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      setAddingCart(product._id);
      setCartMessage('');

      const cookies = document.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        acc[k] = v;
        return acc;
      }, {});
      const userId = cookies.userId;

      if (!userId) {
        setCartMessage('Please log in to add items to cart');
        return;
      }

      const res = await fetch(getApiUrl(`/cart/${userId}/add`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setCartMessage(`${product.name} added to cart!`);
        setTimeout(() => setCartMessage(''), 3000);
      } else {
        setCartMessage(data.msg || 'Failed to add to cart');
      }
    } catch (e) {
      console.error('Error adding to cart:', e);
      setCartMessage('Failed to add to cart');
    } finally {
      setAddingCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Store className="w-16 h-16 text-surface-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Farmer Not Found</h1>
        <p className="text-surface-400 mb-6">{error || 'The farmer you are looking for does not exist.'}</p>
        <Link href="/dashboard/buyer/browse-farmers" className="text-teal-400 hover:text-teal-300">
          ← Back to Browse Farmers
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <motion.div variants={item}>
        <Link
          href="/dashboard/buyer/browse-farmers"
          className="inline-flex items-center gap-2 text-surface-400 hover:text-teal-400 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Farmers
        </Link>
      </motion.div>

      {/* Farmer Profile Card */}
      <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shrink-0">
            <span className="text-3xl font-bold text-white">
              {farmer.name?.charAt(0)?.toUpperCase() || 'F'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{farmer.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {farmer.location && (
                <div className="flex items-center gap-1 text-sm text-surface-400">
                  <MapPin className="w-4 h-4" />
                  {farmer.location}
                </div>
              )}
              {farmer.phone && (
                <div className="flex items-center gap-1 text-sm text-surface-400">
                  <Phone className="w-4 h-4" />
                  {farmer.phone}
                </div>
              )}
              {farmer.email && (
                <div className="flex items-center gap-1 text-sm text-surface-400">
                  <Mail className="w-4 h-4" />
                  {farmer.email}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
              <Sprout className="w-3 h-3 inline mr-1" />
              Farmer
            </span>
            <span className="px-3 py-1 bg-surface-500/10 text-surface-400 text-xs rounded-full">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {farmer.bio && (
          <p className="mt-4 text-sm text-surface-300">{farmer.bio}</p>
        )}
      </motion.div>

      {/* Cart Message */}
      {cartMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center"
        >
          <p className="text-sm text-emerald-400">{cartMessage}</p>
        </motion.div>
      )}

      {/* Products Section */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">
          Products by {farmer.name}
        </h2>

        {products.length === 0 ? (
          <div className="glass-card rounded-2xl border border-white/[0.06] p-12 text-center">
            <Package className="w-12 h-12 text-surface-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">No Products Available</h3>
            <p className="text-sm text-surface-400">This farmer hasn't listed any products yet. Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl border border-white/[0.06] hover:border-white/[0.12] overflow-hidden transition-all duration-300"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-white/[0.02] overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-surface-800/60">
                            <svg class="w-12 h-12 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span class="text-surface-500 text-xs ml-2">${product.name}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-800/60">
                      <Package className="w-12 h-12 text-surface-500" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-white">{product.name}</h3>
                      <p className="text-xs text-surface-400 capitalize">{product.category}</p>
                    </div>
                    <span className="text-lg font-bold text-teal-400">${(product.price || 0).toFixed(2)}</span>
                  </div>

                  <p className="text-xs text-surface-400 mb-3 line-clamp-2">{product.description || ''}</p>

                  <div className="flex items-center gap-2 text-xs text-surface-500 mb-3">
                    <span>Stock: {product.stock || 0} {product.unit || 'units'}</span>
                    {product.isOrganic && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">Organic</span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={addingCart === product._id || product.stock <= 0}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingCart === product._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : product.stock <= 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}