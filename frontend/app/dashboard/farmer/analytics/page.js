"use client";

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);

export default function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    const uid = getCookie('userId');
    setUserId(uid);
    if (!uid) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    setUser({ _id: uid });

    const fetchAnalyticsData = async () => {
      try {
        const [cropsRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:5000/api/crops/farmer/${uid}`, { credentials: 'include' }),
          fetch(`http://localhost:5000/api/orders/farmer/${uid}?status=delivered`, { credentials: 'include' })
        ]);

        const cropsData = await cropsRes.json();
        if (cropsData.success) setCrops(cropsData.data);

        const ordersData = await ordersRes.json();
        if (ordersData.success) setOrders(ordersData.data);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  const totals = useMemo(() => {
    const expected = crops.reduce((sum, c) => sum + (Number(c.estimatedYield) || 0), 0);
    const predicted = crops.reduce((sum, c) => sum + (Number(c.predictedYield) || 0), 0);
    const actual = crops.reduce((sum, c) => sum + (Number(c.actualYield) || 0), 0);

    let totalIncome = 0;
    const revenueByProductId = new Map();
    
    // Calculate income from delivered orders
    orders.forEach(order => {
      // Only count delivered orders
      if (order.status === 'delivered') {
        order.items.forEach(item => {
          // Check if this item belongs to the current farmer
          // Handle both ObjectId and string comparisons
          const itemFarmerId = item.farmer?._id || item.farmer;
          const currentUserId = user?._id;
          
          if (itemFarmerId && currentUserId && 
              itemFarmerId.toString() === currentUserId.toString()) {
            const itemRevenue = item.price * item.quantity;
            totalIncome += itemRevenue;
            
            // Store revenue by product ID for per-crop analysis
            const productId = item.productId?._id || item.productId;
            if (productId) {
              revenueByProductId.set(productId.toString(), 
                (revenueByProductId.get(productId.toString()) || 0) + itemRevenue);
            }
          }
        });
      }
    });

    const totalCost = crops.reduce((sum, c) => sum + (Number(c.totalCost) || 0), 0);
    const netProfit = totalIncome - totalCost;

    return { expected, predicted, actual, totalIncome, totalCost, netProfit, revenueByProductId };
  }, [crops, orders, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 animate-spin text-teal-600">Loading...</div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-red-600">!</div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expected Yield</p>
              <p className="text-2xl font-bold text-gray-900">{totals.expected.toFixed(2)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Sum of manual expected yields</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Predicted Yield</p>
              <p className="text-2xl font-bold text-gray-900">{totals.predicted.toFixed(2)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">AI predicted using Gemini</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Actual Yield</p>
              <p className="text-2xl font-bold text-gray-900">{totals.actual.toFixed(2)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Captured at harvest</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">৳{totals.totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">৳{totals.totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">৳{totals.netProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>





      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Yield Comparison</h2>
          <Bar
            data={{
              labels: crops.map(c => `${c.name} - ${c.variety}`),
              datasets: [
                {
                  label: 'Expected Yield',
                  data: crops.map(c => Number(c.estimatedYield) || 0),
                  backgroundColor: 'rgba(156, 163, 175, 0.8)',
                  borderColor: 'rgb(156, 163, 175)',
                  borderWidth: 1,
                },
                {
                  label: 'Predicted Yield',
                  data: crops.map(c => Number(c.predictedYield) || 0),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1,
                },
                {
                  label: 'Actual Yield',
                  data: crops.map(c => Number(c.actualYield) || 0),
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                  borderColor: 'rgb(16, 185, 129)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Yield Comparison by Crop',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Yield',
                  },
                },
              },
            }}
          />
        </div>

        {/* Profit Analysis Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profit Analysis</h2>
          <Doughnut
            data={{
              labels: ['Total Income', 'Total Cost', 'Net Profit'],
              datasets: [
                {
                  data: [totals.totalIncome, totals.totalCost, totals.netProfit],
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                  ],
                  borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)',
                    'rgb(59, 130, 246)',
                  ],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                title: {
                  display: true,
                  text: 'Financial Overview',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Per-Crop Profit Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Per-Crop Profit Analysis</h2>
        <Bar
          data={{
            labels: crops.map(c => `${c.name} - ${c.variety}`),
            datasets: [
              {
                label: 'Income',
                data: crops.map(c => {
                  const income = (c.product && totals.revenueByProductId.get(c.product?.toString())) || 0;
                  return income;
                }),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
              },
              {
                label: 'Cost',
                data: crops.map(c => Number(c.totalCost) || 0),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
              },
              {
                label: 'Profit',
                data: crops.map(c => {
                  const income = (c.product && totals.revenueByProductId.get(c.product?.toString())) || 0;
                  const cost = Number(c.totalCost) || 0;
                  return income - cost;
                }),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Income, Cost, and Profit by Crop',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount (৳)',
                },
              },
            },
          }}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            {totals.netProfit >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-500" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-500" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profit Trend</h3>
          <p className={`text-2xl font-bold ${totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totals.netProfit >= 0 ? '+' : ''}{totals.netProfit.toFixed(2)} ৳
          </p>
          <p className="text-sm text-gray-600">Net Profit</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${(totals.actual / Math.max(totals.expected, 1)) * 251.2} 251.2`}
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {((totals.actual / Math.max(totals.expected, 1)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Yield Achievement</h3>
          <p className="text-sm text-gray-600">Actual vs Expected</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${(totals.totalIncome / Math.max(totals.totalCost, 1)) * 251.2} 251.2`}
                className="text-blue-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {((totals.totalIncome / Math.max(totals.totalCost, 1)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ROI</h3>
          <p className="text-sm text-gray-600">Return on Investment</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Yield and Profit by Crop</h2>
        <div className="space-y-3">
          {crops.length === 0 && (
            <p className="text-gray-500">No crops yet.</p>
          )}
          {crops.map((c) => {
            const income = (c.product && totals.revenueByProductId.get(c.product?.toString())) || 0;
            const cost = Number(c.totalCost || 0);
            const profit = income - cost;
            return (
              <div key={c._id} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{c.name} - {c.variety}</p>
                  <p className="text-xs text-gray-500">Area: {c.area} {c.unit} • Unit: {c.yieldUnit}</p>
                </div>
                <div className="grid grid-cols-5 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Expected</p>
                    <p className="font-semibold">{c.estimatedYield ?? '-'} {c.yieldUnit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Predicted</p>
                    <p className="font-semibold">{c.predictedYield ?? '-'} {c.yieldUnit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Actual</p>
                    <p className="font-semibold">{c.actualYield ?? '-'} {c.yieldUnit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Income</p>
                    <p className="font-semibold">৳{income.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Profit</p>
                    <p className="font-semibold">৳{profit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Environmental Summary</h2>
        {data?.env ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">Location</p>
              <p className="text-2xl font-bold text-blue-600">{data.env.location}</p>
            </div>
            {data.env.monthly?.slice(-1).map((m) => (
              <div key={m.month} className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">Last Month Avg Temp</p>
                <p className="text-2xl font-bold text-green-600">{m.avgTempC ?? '-'} °C</p>
              </div>
            ))}
            {data.env.monthly?.slice(-1).map((m) => (
              <div key={m.month + '-p'} className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">Last Month Precip</p>
                <p className="text-2xl font-bold text-purple-600">{m.totalPrecipMm} mm</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Environmental data unavailable.</p>
        )}
      </div>
    </div>
  );
}