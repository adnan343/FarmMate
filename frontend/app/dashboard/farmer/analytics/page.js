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
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const userId = getCookie('userId');
    if (!userId) {
      setLoading(false);
      return;
    }
    setUser({ _id: userId });

    Promise.all([
      fetch(`http://localhost:5000/api/crops/farmer/${userId}`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`http://localhost:5000/api/orders/farmer/${userId}?status=delivered`, { credentials: 'include' }).then((r) => r.json()),
    ]).then(([cropsRes, ordersRes]) => {
      if (cropsRes?.success) setCrops(cropsRes.data);
      if (ordersRes?.success) setOrders(ordersRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    const expected = crops.reduce((sum, c) => sum + (Number(c.estimatedYield) || 0), 0);
    const predicted = crops.reduce((sum, c) => sum + (Number(c.predictedYield) || 0), 0);
    const actual = crops.reduce((sum, c) => sum + (Number(c.actualYield) || 0), 0);
    const revenueByProductId = new Map();
    for (const order of orders) {
      for (const item of order.items || []) {
        const key = (item.productId && item.productId._id) || item.productId;
        const lineRevenue = Number(item.price) * Number(item.quantity);
        revenueByProductId.set(key, (revenueByProductId.get(key) || 0) + lineRevenue);
      }
    }
    let totalIncome = 0;
    let totalCost = 0;
    for (const c of crops) {
      const pid = c.product;
      if (pid && revenueByProductId.has(pid.toString())) {
        totalIncome += revenueByProductId.get(pid.toString());
      }
      totalCost += Number(c.totalCost || 0);
    }
    const netProfit = totalIncome - totalCost;
    return { expected, predicted, actual, totalIncome, totalCost, netProfit, revenueByProductId };
  }, [crops, orders]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
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
    </div>
  );
}