'use client';

import { MapPin, Phone, Mail, Store, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      const response = await fetch('http://localhost:5000/api/users/farmers/all');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setFarmers(result.data);
        }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Farmers</h1>
          <p className="text-gray-600 mt-2">Shop directly from local farmers</p>
        </div>
        <Link 
          href="/dashboard/buyer/marketplace"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Store className="w-4 h-4" />
          View All Products
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search farmers by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Farmers */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {loading ? 'Loading farmers...' : `${filteredFarmers.length} Farmers Found`}
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No farmers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map((farmer) => (
              <Link 
                key={farmer._id} 
                href={`/dashboard/buyer/farmer/${farmer._id}`}
                className="block"
              >
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-semibold text-lg">
                        {farmer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{farmer.name}</h3>
                  
                  {farmer.location && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{farmer.location}</span>
                    </div>
                  )}
                  
                  {farmer.phone && (
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{farmer.phone}</span>
                    </div>
                  )}
                  
                  {farmer.email && (
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{farmer.email}</span>
                    </div>
                  )}
                  
                  {farmer.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{farmer.bio}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {farmer.farms?.length || 0} farm{farmer.farms?.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-teal-600 font-medium">View Products</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 