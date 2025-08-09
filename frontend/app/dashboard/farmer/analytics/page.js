"use client";

import { Activity, BarChart3, DollarSign, TrendingDown, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getYieldAnalytics } from '../../../../lib/api';
import dynamic from 'next/dynamic';
import 'chart.js/auto';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

export default function AnalyticsPage() {
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
    (async () => {
      try {
        const resp = await getYieldAnalytics(uid);
        setData(resp.data);
      } catch (e) {
        setError(e.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const timeSeriesChart = useMemo(() => {
    if (!data?.timeSeries?.length) return null;
    const labels = data.timeSeries.map((p) => p.month);
    return {
      labels,
      datasets: [
        {
          label: 'Total Yield (kg)',
          data: data.timeSeries.map((p) => p.totalYieldKg),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.3)',
          tension: 0.3,
        },
      ],
    };
  }, [data]);

  const perCropBarChart = useMemo(() => {
    if (!data?.perCrop?.length) return null;
    const labels = data.perCrop.map((c) => c.crop);
    return {
      labels,
      datasets: [
        {
          label: 'Avg Yield (kg)',
          data: data.perCrop.map((c) => c.averageYieldKg),
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
        {
          label: 'Predicted Next Yield (kg)',
          data: data.perCrop.map((c) => c.predictedNextYieldKg ?? 0),
          backgroundColor: 'rgba(139, 92, 246, 0.4)',
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
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
            <AlertCircle className="w-6 h-6 text-red-600" />
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

      {/* Yield Time Series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Yield (kg)</h2>
          {timeSeriesChart ? (
            <Line
              data={timeSeriesChart}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          ) : (
            <p className="text-gray-600">No yield data yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Per-Crop Yield & Prediction (kg)</h2>
          {perCropBarChart ? (
            <Bar
              data={perCropBarChart}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          ) : (
            <p className="text-gray-600">No per-crop data yet.</p>
          )}
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