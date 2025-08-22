"use client";

import { createTask, deleteTaskById, getCategoryProgressByFarmer, getTaskSummary, getTasksByFarmer, getUpcomingTasks, updateTaskById } from '@/lib/api';
import { AlertCircle, Calendar, CheckSquare, Clock, Edit, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function TaskManagementPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [tasks, setTasks] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'planting',
    priority: 'medium',
    dueDate: '',
    startDate: '',
    assignedTeam: ''
  });

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    const userId = getCookie('userId');
    const userName = getCookie('userName');
    const userEmail = getCookie('userEmail');
    const role = getCookie('role');
    if (userId) {
      setUser({ _id: userId, name: userName, email: userEmail, role });
      loadData(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async (farmerId) => {
    try {
      setLoading(true);
      const [summaryRes, tasksRes, upcomingRes, categoriesRes] = await Promise.all([
        getTaskSummary(farmerId),
        getTasksByFarmer(farmerId),
        getUpcomingTasks(farmerId),
        getCategoryProgressByFarmer(farmerId)
      ]);
      setSummary(summaryRes);
      setTasks(tasksRes);
      setUpcoming(upcomingRes);
      setCategories(categoriesRes);
    } catch (e) {
      console.error('Failed to load task data', e);
    } finally {
      setLoading(false);
    }
  };

  const teamStats = useMemo(() => {
    const map = {};
    for (const t of tasks) {
      if (t.status === 'completed') continue; // exclude completed from team load
      const key = t.assignedTeam || 'Unassigned';
      if (!map[key]) map[key] = { name: key, tasks: 0 };
      map[key].tasks += 1;
    }
    return Object.values(map).sort((a, b) => b.tasks - a.tasks).slice(0, 4);
  }, [tasks]);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ title: '', description: '', category: 'planting', priority: 'medium', dueDate: '', startDate: '', assignedTeam: '' });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setIsEditing(true);
    setEditingId(task._id);
    setForm({
      title: task.title || '',
      description: task.description || '',
      category: task.category || 'other',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
      assignedTeam: task.assignedTeam || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const payload = {
        ...form,
        farmer: user._id,
        dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
        startDate: form.startDate ? new Date(form.startDate) : undefined
      };
      if (isEditing && editingId) {
        const updated = await updateTaskById(editingId, payload);
        setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      } else {
        const created = await createTask(payload);
        setTasks(prev => [created, ...prev]);
      }
      // refresh summary and categories
      loadData(user._id);
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save task');
    }
  };

  const markComplete = async (task) => {
    try {
      const updated = await updateTaskById(task._id, { status: 'completed', endDate: new Date() });
      // Immediately reflect: remove from team load and update categories via reload
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      if (user) loadData(user._id);
    } catch (e) {
      alert('Failed to mark as complete');
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTaskById(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      if (user) loadData(user._id);
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const statusPill = (task) => {
    const now = new Date();
    const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now;
    const status = isOverdue ? 'overdue' : task.status || 'pending';
    const map = {
      overdue: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800'
    };
    return <span className={`px-2 py-1 ${map[status] || 'bg-gray-100 text-gray-800'} text-xs rounded-full`}>{status.replace('_', ' ')}</span>;
  };

  const priorityPill = (priority) => {
    const p = (priority || 'medium').toLowerCase();
    const map = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 py-1 ${map[p] || map.medium} text-xs rounded-full`}>{p}</span>;
  };

  const categoryBarColor = (cat) => {
    const colors = {
      planting: 'bg-green-500',
      maintenance: 'bg-blue-500',
      harvesting: 'bg-yellow-500',
      watering: 'bg-cyan-500',
      fertilizing: 'bg-emerald-500',
      pest_control: 'bg-red-500',
      irrigation: 'bg-sky-500',
      weeding: 'bg-lime-500',
      monitoring: 'bg-purple-500',
      other: 'bg-gray-500'
    };
    return colors[cat] || 'bg-gray-500';
  };

  const displayCategory = (cat) => cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <button onClick={openAddModal} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{summary.overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Tasks</h2>
        <div className="space-y-4">
          {tasks.length === 0 && (
            <div className="text-sm text-gray-500">No tasks yet. Add your first task.</div>
          )}
          {tasks.map((task) => {
            const now = new Date();
            const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now;
            const border = isOverdue ? 'border-red-200 bg-red-50' : task.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50';
            const Icon = isOverdue ? AlertCircle : task.status === 'completed' ? CheckSquare : Clock;
            return (
              <div key={task._id} className={`flex items-center justify-between p-4 border rounded-lg ${border}`}>
                <div className="flex items-center gap-4">
                  <Icon className={`w-6 h-6 ${isOverdue ? 'text-red-600' : task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`} />
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    {task.assignedTeam && <p className="text-xs text-gray-500 mt-1">Team: {task.assignedTeam}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                  <div className="flex items-center gap-2 justify-end mt-2">
                    {statusPill(task)}
                    {priorityPill(task.priority)}
                    {task.status !== 'completed' && (
                      <button onClick={() => markComplete(task)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        Complete
                      </button>
                    )}
                    <button onClick={() => openEditModal(task)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1">
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => deleteTask(task._id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Assignment</h2>
          <div className="space-y-4">
            {teamStats.length === 0 && (
              <div className="text-sm text-gray-500">No teams yet.</div>
            )}
            {teamStats.map((team, idx) => (
              <div key={team.name + idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${idx % 2 === 0 ? 'bg-teal-600' : 'bg-blue-600'} rounded-full flex items-center justify-center`}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{team.name}</p>
                    <p className="text-sm text-gray-600">{team.tasks} tasks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{team.tasks} tasks</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {team.tasks < 3 ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {upcoming.length === 0 && <div className="text-sm text-gray-500">No upcoming tasks.</div>}
            {upcoming.map((t) => (
              <div key={t._id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <Calendar className={`w-5 h-5 ${t.priority === 'critical' ? 'text-red-500' : t.priority === 'high' ? 'text-orange-500' : t.priority === 'medium' ? 'text-blue-500' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{t.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}</span>
                    {priorityPill(t.priority)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.length === 0 && (
            <div className="text-sm text-gray-500">No task categories yet.</div>
          )}
          {categories
            .slice()
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((c) => {
              const percent = c.total ? Math.round((c.completed / c.total) * 100) : 0;
              const color = categoryBarColor(c.category);
              return (
                <div key={c.category} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{displayCategory(c.category)}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="text-sm font-medium">{c.completed}/{c.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" rows="3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                    <option value="planting">Planting</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="harvesting">Harvesting</option>
                    <option value="watering">Watering</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="pest_control">Pest Control</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="weeding">Weeding</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Team</label>
                <input value={form.assignedTeam} onChange={(e) => setForm({ ...form, assignedTeam: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Team A" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">{isEditing ? 'Update' : 'Create'} Task</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}