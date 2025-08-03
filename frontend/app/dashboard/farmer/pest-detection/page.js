import { Bug, CheckCircle } from 'lucide-react';

export default function PestDetectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pest Detection</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Scan for Pests
        </button>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Alerts</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-4">
              <Bug className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Rice Stem Borer Detected</p>
                <p className="text-sm text-gray-600">Field A - High infestation level</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Detected 2 hours ago</p>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Critical
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-4">
              <Bug className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Aphids Found</p>
                <p className="text-sm text-gray-600">Wheat Field - Moderate infestation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Detected 1 day ago</p>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Warning
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detection History</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Tomato Hornworm</p>
                <p className="text-sm text-gray-600">Greenhouse - Treated successfully</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">March 1, 2025</p>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Resolved
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Spider Mites</p>
                <p className="text-sm text-gray-600">Field B - Prevented spread</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">February 25, 2025</p>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Field Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Field A</h3>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Alert
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rice Stem Borer</span>
              <span className="text-sm font-medium text-red-600">High</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Infestation Level</span>
              <span className="text-sm font-medium text-red-600">85%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Field B</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Clean
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pest Activity</span>
              <span className="text-sm font-medium text-green-600">Low</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Risk Level</span>
              <span className="text-sm font-medium text-green-600">5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Field C</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Warning
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Aphids</span>
              <span className="text-sm font-medium text-yellow-600">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Infestation Level</span>
              <span className="text-sm font-medium text-yellow-600">45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Recommendations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Recommendations</h2>
        <div className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-semibold text-gray-900 mb-2">Rice Stem Borer - Field A</h3>
            <p className="text-sm text-gray-600 mb-3">
              Immediate action required. Apply neem-based pesticide within 24 hours.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Apply Treatment
              </button>
              <button className="px-3 py-1 border border-red-600 text-red-600 text-sm rounded hover:bg-red-50">
                View Details
              </button>
            </div>
          </div>

          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <h3 className="font-semibold text-gray-900 mb-2">Aphids - Field C</h3>
            <p className="text-sm text-gray-600 mb-3">
              Monitor closely. Consider introducing ladybugs as natural predators.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                Schedule Treatment
              </button>
              <button className="px-3 py-1 border border-yellow-600 text-yellow-600 text-sm rounded hover:bg-yellow-50">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Detection Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Detection Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">98%</p>
            <p className="text-sm text-gray-600">Accuracy Rate</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">24</p>
            <p className="text-sm text-gray-600">Detections This Month</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">5</p>
            <p className="text-sm text-gray-600">Pest Types Identified</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">2.3s</p>
            <p className="text-sm text-gray-600">Average Detection Time</p>
          </div>
        </div>
      </div>
    </div>
  );
} 