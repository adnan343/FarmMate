import { Activity, BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹2,45,000</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Crop Yield</p>
              <p className="text-2xl font-bold text-gray-900">85.2%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-blue-600 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-purple-600 mt-2">+5% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cost per Acre</p>
              <p className="text-2xl font-bold text-gray-900">₹8,500</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-red-600 mt-2">-3% from last month</p>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue by Crop</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700">Rice</span>
              </div>
              <span className="font-medium">₹1,20,000</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-700">Wheat</span>
              </div>
              <span className="font-medium">₹85,000</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-gray-700">Tomatoes</span>
              </div>
              <span className="font-medium">₹40,000</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Trends</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">January</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div className="w-12 h-2 bg-teal-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">₹1,80,000</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">February</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div className="w-14 h-2 bg-teal-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">₹2,10,000</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">March</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div className="w-16 h-2 bg-teal-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">₹2,45,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Water Usage</h3>
            <p className="text-2xl font-bold text-blue-600">78%</p>
            <p className="text-sm text-gray-600">Efficiency</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Fertilizer Usage</h3>
            <p className="text-2xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-600">Efficiency</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Labor Efficiency</h3>
            <p className="text-2xl font-bold text-purple-600">92%</p>
            <p className="text-sm text-gray-600">Efficiency</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Expenses Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Labor</span>
                <span className="font-medium">₹45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fertilizers</span>
                <span className="font-medium">₹25,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pesticides</span>
                <span className="font-medium">₹15,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Equipment</span>
                <span className="font-medium">₹30,000</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-gray-900">₹1,15,000</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Profitability</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Revenue</span>
                <span className="font-medium text-green-600">₹2,45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Expenses</span>
                <span className="font-medium text-red-600">₹1,15,000</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-semibold text-gray-900">Net Profit</span>
                <span className="font-semibold text-green-600">₹1,30,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profit Margin</span>
                <span className="font-medium text-green-600">53%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">Rice Price</p>
            <p className="text-2xl font-bold text-green-600">₹2,500/ton</p>
            <p className="text-sm text-green-600">+15% from last month</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">Wheat Price</p>
            <p className="text-2xl font-bold text-blue-600">₹1,800/ton</p>
            <p className="text-sm text-blue-600">+8% from last month</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">Tomato Price</p>
            <p className="text-2xl font-bold text-purple-600">₹45/kg</p>
            <p className="text-sm text-purple-600">+12% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
} 