import { Calendar, Lightbulb, MapPin, TrendingUp } from 'lucide-react';

export default function CropSuggestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Crop Suggestions</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Get New Suggestions
        </button>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Based on your soil conditions, weather patterns, and market demand, here are our top recommendations for this season.
        </p>
      </div>

      {/* Recommended Crops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rice (IR64)</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              High Yield
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Expected yield: 4.2 tons/acre</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Planting window: March-April</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">Best for: Field A & B</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
            Accept Suggestion
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Wheat (BARI Gom-33)</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Market Demand
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Expected yield: 3.8 tons/acre</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Planting window: November-December</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">Best for: Field C</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Accept Suggestion
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tomatoes (Hybrid)</h3>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              High Value
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Expected yield: 25 tons/acre</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Planting window: February-March</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">Best for: Greenhouse</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Accept Suggestion
          </button>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">₹2,500</p>
            <p className="text-sm text-gray-600">Rice per ton</p>
            <p className="text-xs text-green-600">+12% from last month</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">₹1,800</p>
            <p className="text-sm text-gray-600">Wheat per ton</p>
            <p className="text-xs text-blue-600">+8% from last month</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">₹45</p>
            <p className="text-sm text-gray-600">Tomatoes per kg</p>
            <p className="text-xs text-purple-600">+15% from last month</p>
          </div>
        </div>
      </div>

      {/* Seasonal Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Seasonal Planting Calendar</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Spring</h3>
            <p className="text-sm text-gray-600">Rice, Corn, Vegetables</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Summer</h3>
            <p className="text-sm text-gray-600">Cotton, Sugarcane</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Autumn</h3>
            <p className="text-sm text-gray-600">Wheat, Barley</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Winter</h3>
            <p className="text-sm text-gray-600">Mustard, Peas</p>
          </div>
        </div>
      </div>
    </div>
  );
} 