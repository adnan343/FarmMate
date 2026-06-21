"use client";

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { useToast } from '@/app/components/ToastProvider';
import { createTask, deleteTaskById, getCategoryProgressByFarmer, getTaskSummary, getTasksByFarmer, getUpcomingTasks, updateTaskById } from '@/lib/api';
import {
    AlertTriangle,
    CheckSquare,
    Clock,
    Eye,
    Lightbulb,
    Plus,
    Trash2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function TaskManagementPage() {
  const { success, error, info } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [tasks, setTasks] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
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
      if (t.status === 'completed') continue;
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
        success('Task updated successfully');
      } else {
        const created = await createTask(payload);
        setTasks(prev => [created, ...prev]);
        success('Task created successfully');
      }
      loadData(user._id);
      setShowModal(false);
    } catch (err) {
      error(err.message || 'Failed to save task');
    }
  };

  const markComplete = async (task) => {
    try {
      const updated = await updateTaskById(task._id, { status: 'completed', endDate: new Date() });
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      if (user) loadData(user._id);
      success('Task marked as complete');
    } catch (e) {
      error('Failed to mark as complete');
    }
  };

  const requestDelete = (taskId) => {
    setPendingDeleteId(taskId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteTaskById(pendingDeleteId);
      setTasks(prev => prev.filter(t => t._id !== pendingDeleteId));
      if (user) loadData(user._id);
      success('Task deleted');
    } catch (e) {
      error('Failed to delete');
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const statusPill = (task) => {
    const now = new Date();
    const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now;
    const status = isOverdue ? 'overdue' : task.status || 'pending';
    const map = {
      overdue: 'bg-red-500/50/10 text-red-400 border-red-500/20',
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      in_progress: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      scheduled: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
    return <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${map[status] || 'bg-surface-500/10 text-surface-400 border-surface-500/20'}`}>{status.replace('_', ' ')}</span>;
  };

  const priorityPill = (priority) => {
    const p = (priority || 'medium').toLowerCase();
    const map = {
      critical: 'bg-red-500/50/10 text-red-400 border-red-500/20',
      high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      medium: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      low: 'bg-surface-500/10 text-surface-400 border-surface-500/20',
    };
    return <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${map[p] || map.medium}`}>{p}</span>;
  };

  const categoryBarColor = (cat) => {
    const colors = {
      planting: 'bg-emerald-500', maintenance: 'bg-sky-500', harvesting: 'bg-amber-500',
      watering: 'bg-cyan-500', fertilizing: 'bg-emerald-400', pest_control: 'bg-red-500/50',
      irrigation: 'bg-sky-400', weeding: 'bg-lime-500', monitoring: 'bg-purple-500', other: 'bg-surface-500'
    };
    return colors[cat] || 'bg-surface-500';
  };

  const displayCategory = (cat) => cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 skeleton rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl border border-white/[0.06] p-6"><div className="h-6 w-16 skeleton rounded-lg mb-2" /><div className="h-4 w-24 skeleton rounded-lg" /></div>
          ))}
        </div>
        <div className="glass-card rounded-2xl border border-white/[0.06] p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-full skeleton rounded-lg mb-3" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Task Management</h1>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </motion.div>

      {/* KPI Summary */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: summary.total, icon: CheckSquare, color: 'from-emerald-500 to-emerald-600', valueColor: 'text-white' },
          { label: 'Completed', value: summary.completed, icon: CheckSquare, color: 'from-emerald-500 to-emerald-600', valueColor: 'text-emerald-400' },
          { label: 'Pending', value: summary.pending, icon: Clock, color: 'from-amber-500 to-amber-600', valueColor: 'text-amber-400' },
          { label: 'Overdue', value: summary.overdue, icon: AlertTriangle, color: 'from-red-500 to-red-600', valueColor: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl border border-white/[0.06] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${stat.valueColor} tracking-tight`}>{stat.value}</span>
            </div>
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Current Tasks */}
      <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
        <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Current Tasks</h2>
        <div className="space-y-3">
          {tasks.length === 0 && (
            <div className="text-center py-8">
              <CheckSquare className="w-10 h-10 text-surface-600 mx-auto mb-2" />
              <p className="text-sm text-surface-400">No tasks yet. Add your first task to get started.</p>
            </div>
          )}
          {tasks.map((task) => {
            const now = new Date();
            const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now;
            const isComplete = task.status === 'completed';
            const Icon = isOverdue ? AlertTriangle : isComplete ? CheckSquare : Clock;
            const iconColor = isOverdue ? 'text-red-400' : isComplete ? 'text-emerald-400' : 'text-amber-400';
            const rowBg = isOverdue ? 'border-red-500/10 bg-red-500/50/5' : isComplete ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-white/[0.04] bg-white/[0.02]';
            return (
              <div key={task._id} className={`flex items-center justify-between p-4 border rounded-xl ${rowBg} transition-colors hover:bg-white/[0.04]`}>
                <div className="flex items-center gap-4 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm">{task.title}</p>
                    <p className="text-xs text-surface-400 truncate">{task.description}</p>
                    {task.assignedTeam && <p className="text-[10px] text-surface-500 mt-0.5">Team: {task.assignedTeam}</p>}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-surface-400">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                  <div className="flex items-center gap-1.5 justify-end mt-2">
                    {statusPill(task)}
                    {priorityPill(task.priority)}
                    {task.status !== 'completed' && (
                      <button onClick={() => markComplete(task)} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full hover:bg-emerald-500/20 transition-colors">
                        Complete
                      </button>
                    )}
                    <button onClick={() => openEditModal(task)} className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full hover:bg-sky-500/20 transition-colors flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => requestDelete(task._id)} className="text-[10px] bg-red-500/50/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full hover:bg-red-500/50/20 transition-colors flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Assignment */}
        <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Team Assignment</h2>
          <div className="space-y-3">
            {teamStats.length === 0 && (
              <p className="text-sm text-surface-400 text-center py-4">No teams assigned yet.</p>
            )}
            {teamStats.map((team, idx) => (
              <div key={team.name + idx} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${idx % 2 === 0 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-sky-500 to-sky-600'} rounded-full flex items-center justify-center`}>
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{team.name}</p>
                    <p className="text-xs text-surface-400">{team.tasks} tasks</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${team.tasks < 3 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {team.tasks < 3 ? 'Available' : 'Busy'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {upcoming.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No upcoming deadlines.</p>}
            {upcoming.map((t) => (
              <div key={t._id} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <Clock className={`w-4 h-4 shrink-0 ${t.priority === 'critical' ? 'text-red-400' : t.priority === 'high' ? 'text-orange-400' : t.priority === 'medium' ? 'text-sky-400' : 'text-surface-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.title}</p>
                  <div className="flex items-center gap-2 text-xs text-surface-400">
                    <span>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}</span>
                    {priorityPill(t.priority)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Task Categories */}
      <motion.div variants={item} className="glass-card rounded-2xl border border-white/[0.06] p-6">
        <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Task Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.length === 0 && (
            <p className="text-sm text-surface-400 text-center py-4 md:col-span-3">No task categories yet.</p>
          )}
          {categories.slice().sort((a, b) => a.category.localeCompare(b.category)).map((c) => {
            const percent = c.total ? Math.round((c.completed / c.total) * 100) : 0;
            const color = categoryBarColor(c.category);
            return (
              <div key={c.category} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <h3 className="font-semibold text-white text-sm mb-2">{displayCategory(c.category)}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-surface-400">Completed</span>
                    <span className="text-xs font-medium text-white">{c.completed}/{c.total}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-surface-800 border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg mx-4 shadow-glow">
            <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">{isEditing ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all min-h-[80px]" rows="3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all">
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
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Assigned Team</label>
                <input value={form.assignedTeam} onChange={(e) => setForm({ ...form, assignedTeam: e.target.value })} className="w-full bg-surface-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all" placeholder="e.g., Team A" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-2.5 text-sm font-semibold hover:brightness-110 transition-all">
                  {isEditing ? 'Update' : 'Create'} Task
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-white/10 text-surface-300 py-2.5 text-sm font-semibold hover:bg-white/5 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete task?"
        description="This action cannot be undone. The task will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </motion.div>
  );
}