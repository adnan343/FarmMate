import { Calendar, Mail, MapPin, Phone } from 'lucide-react';

export default function FarmProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Farm Profile</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Farm Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-900">Dhaka, Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Established</p>
                <p className="text-gray-900">2018</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Farm Size</p>
              <p className="text-gray-900">25 acres</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Primary Crops</p>
              <p className="text-gray-900">Rice, Wheat, Vegetables</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">+880 1712 345 678</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">farmer@farmmate.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Crops */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Crops</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Rice</p>
                <p className="text-sm text-gray-500">5 acres</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Growing
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Wheat</p>
                <p className="text-sm text-gray-500">3 acres</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Planning
              </span>
            </div>
          </div>
        </div>

        {/* Farm Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Farm Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <p className="text-2xl font-bold text-teal-600">25</p>
              <p className="text-sm text-gray-600">Total Acres</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">8</p>
              <p className="text-sm text-gray-600">Active Crops</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">15</p>
              <p className="text-sm text-gray-600">Workers</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">95%</p>
              <p className="text-sm text-gray-600">Efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 