import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

export default function ConditionReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Condition Reports</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Generate Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Soil Health</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Crop Health</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Water Level</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pest Alert</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Rice Field Report</p>
                <p className="text-sm text-gray-500">Generated 2 hours ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Healthy
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Wheat Field Report</p>
                <p className="text-sm text-gray-500">Generated 1 day ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Attention Needed
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Vegetable Field Report</p>
                <p className="text-sm text-gray-500">Generated 3 days ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Critical
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Soil Analysis</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">pH Level</span>
              <span className="font-medium">6.8 (Optimal)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nitrogen</span>
              <span className="font-medium">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phosphorus</span>
              <span className="font-medium">High</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Potassium</span>
              <span className="font-medium">Low</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Conditions</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Temperature</span>
              <span className="font-medium">28°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Humidity</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rainfall</span>
              <span className="font-medium">2.5mm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Wind Speed</span>
              <span className="font-medium">8 km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 