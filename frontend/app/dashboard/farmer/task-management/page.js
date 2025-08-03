import { AlertCircle, Calendar, CheckSquare, Clock, Plus, Users } from 'lucide-react';

export default function TaskManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Task
        </button>
      </div>

      {/* Task Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <CheckSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <CheckSquare className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">4</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Current Tasks */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Tasks</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Apply Pesticide to Rice Field</p>
                <p className="text-sm text-gray-600">Field A - High priority due to pest infestation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Due: Today</p>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Overdue
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Fertilize Wheat Field</p>
                <p className="text-sm text-gray-600">Field C - Apply NPK fertilizer</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Due: Tomorrow</p>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Pending
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-4">
              <CheckSquare className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Harvest Tomatoes</p>
                <p className="text-sm text-gray-600">Greenhouse - Ready for harvest</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Due: March 21</p>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Scheduled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Assignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Assignment</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Team A</p>
                  <p className="text-sm text-gray-600">5 workers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">3 tasks</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Available
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Team B</p>
                  <p className="text-sm text-gray-600">3 workers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">2 tasks</p>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Busy
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Calendar className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Pest Treatment</p>
                <p className="text-sm text-gray-600">Today - Critical</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Fertilization</p>
                <p className="text-sm text-gray-600">Tomorrow - High Priority</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Irrigation Check</p>
                <p className="text-sm text-gray-600">March 15 - Medium Priority</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Planting</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">8/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Maintenance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">6/8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Harvesting</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">4/6</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 