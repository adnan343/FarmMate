import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function PlantingCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Planting Calendar</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Add New Task
        </button>
      </div>

      {/* Current Month Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">March 2025</h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 31 }, (_, i) => (
            <div key={i} className="p-2 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600">{i + 1}</p>
              {i === 5 && (
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
              )}
              {i === 12 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
              )}
              {i === 20 && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto mt-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Plant Rice Seeds</p>
                <p className="text-sm text-gray-600">Field A - 5 acres</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">March 6, 2025</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Fertilize Wheat Field</p>
                <p className="text-sm text-gray-600">Field C - 3 acres</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">March 13, 2025</p>
              <p className="text-xs text-blue-600">Scheduled</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Harvest Tomatoes</p>
                <p className="text-sm text-gray-600">Greenhouse - 2 acres</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">March 21, 2025</p>
              <p className="text-xs text-yellow-600">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rice Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Planting</p>
                <p className="text-sm text-gray-600">March 6 - March 10</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Growth Phase</p>
                <p className="text-sm text-gray-600">March 11 - May 15</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Harvest</p>
                <p className="text-sm text-gray-600">June 1 - June 15</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wheat Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Planting</p>
                <p className="text-sm text-gray-600">November 15 - November 25</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Growth Phase</p>
                <p className="text-sm text-gray-600">November 26 - February 28</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Harvest</p>
                <p className="text-sm text-gray-600">March 1 - March 15</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Alerts</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-900">Rain Expected</p>
              <p className="text-sm text-gray-600">Heavy rainfall expected on March 8-10. Consider delaying rice planting.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Temperature Alert</p>
              <p className="text-sm text-gray-600">High temperatures expected next week. Ensure proper irrigation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 