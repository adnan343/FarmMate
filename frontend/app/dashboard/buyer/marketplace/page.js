import { Filter, Heart, MapPin, Search, ShoppingCart, Star } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          <ShoppingCart className="w-4 h-4 mr-2 inline" />
          View Cart (3)
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
              <option>All Categories</option>
              <option>Grains</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Dairy</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
              <option>Sort by</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <span className="text-4xl">🌾</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Organic Rice</h3>
                <button className="text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">(24 reviews)</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Dhaka, 5km away</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">₹2,500/ton</span>
                <button className="bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
              <span className="text-4xl">🍅</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Fresh Tomatoes</h3>
                <button className="text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-600 ml-1">(18 reviews)</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Chittagong, 8km away</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">₹45/kg</span>
                <button className="bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-4xl">🥛</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Fresh Milk</h3>
                <button className="text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">(32 reviews)</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Sylhet, 3km away</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">₹80/liter</span>
                <button className="bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Products */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Wheat', price: '₹1,800/ton', rating: 4, distance: '6km', emoji: '🌾' },
            { name: 'Potatoes', price: '₹25/kg', rating: 4, distance: '4km', emoji: '🥔' },
            { name: 'Onions', price: '₹30/kg', rating: 3, distance: '7km', emoji: '🧅' },
            { name: 'Carrots', price: '₹35/kg', rating: 5, distance: '5km', emoji: '🥕' },
            { name: 'Cabbage', price: '₹20/kg', rating: 4, distance: '3km', emoji: '🥬' },
            { name: 'Cucumber', price: '₹15/kg', rating: 3, distance: '8km', emoji: '🥒' },
            { name: 'Eggs', price: '₹120/dozen', rating: 5, distance: '2km', emoji: '🥚' },
            { name: 'Honey', price: '₹400/kg', rating: 5, distance: '10km', emoji: '🍯' }
          ].map((product, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="text-center mb-3">
                <span className="text-3xl">{product.emoji}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{product.distance} away</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{product.price}</span>
                <button className="bg-teal-600 text-white px-2 py-1 rounded text-sm hover:bg-teal-700 transition-colors">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Rice - 2 tons</p>
                <p className="text-sm text-gray-600">Order #12345</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">March 5, 2025</p>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Delivered
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍅</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Tomatoes - 50kg</p>
                <p className="text-sm text-gray-600">Order #12346</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">March 3, 2025</p>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                In Transit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 