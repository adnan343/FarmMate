'use client';

import { ArrowRight, Mail, MapPin, Phone, Store, Search, Sprout, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/apiConfig';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function BrowseFarmersPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/users/farmers/all'), { credentials: 'include' });
      if (response.ok) {
        const result = await response.json();
        if (result.success) setFarmers(result.data);
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Browse Farmers</h1>
          <p className="text-surface-400 mt-1">Shop directly from local farmers</p>
        </div>
        <Link
          href="/dashboard/buyer/marketplace"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all"
        >
          <Store className="w-4 h-4" />
          View All Products
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search farmers by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-800/60 border border-white/10 rounded-xl text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all"
          />
        </div>
      </motion.div>

      {/* Farmers Grid */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">
          {loading ? 'Loading farmers...' : `${filteredFarmers.length} Farmer${filteredFarmers.length !== 1 ? 's' : ''} Found`}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl border border-white/[0.06] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 skeleton rounded-full" />
                  <div className="flex-1"><div className="h-4 w-2/3 skeleton rounded-lg mb-2" /><div className="h-3 w-1/2 skeleton rounded-lg" /></div>
                </div>
                <div className="space-y-2"><div className="h-3 w-full skeleton rounded-lg" /><div className="h-3 w-3/4 skeleton rounded-lg" /></div>
              </div>
            ))}
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="glass-card rounded-2xl border border-white/[0.06] p-12 text-center">
            <Users className="w-12 h-12 text-surface-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">No farmers found</h3>
            <p className="text-sm text-surface-400">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFarmers.map((farmer) => (
              <Link key={farmer._id} href={`/dashboard/buyer/farmer/${farmer._id}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-2xl border border-white/[0.06] hover:border-white/[0.12] p-5 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-lg">
                        {farmer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-surface-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{farmer.name}</h3>

                  <div className="space-y-1.5 mb-4">
                    {farmer.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-surface-500" />
                        <span className="text-xs text-surface-400">{farmer.location}</span>
                      </div>
                    )}
                    {farmer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-surface-500" />
                        <span className="text-xs text-surface-400">{farmer.phone}</span>
                      </div>
                    )}
                    {farmer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-surface-500" />
                        <span className="text-xs text-surface-400">{farmer.email}</span>
                      </div>
                    )}
                  </div>

                  {farmer.bio && (
                    <p className="text-xs text-surface-400 mb-4 line-clamp-2">{farmer.bio}</p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <span className="text-xs text-surface-500">
                      {farmer.farms?.length || 0} farm{(farmer.farms?.length || 0) !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium group-hover:text-emerald-300">View Products →</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}