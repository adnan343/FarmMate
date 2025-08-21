import mongoose from 'mongoose';
import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
    try {
        const farmerId = req.user?._id || req.body.farmer;
        const payload = { ...req.body, farmer: farmerId };
        const task = await Task.create(payload);
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const query = {};
        if (farmerId) query.farmer = farmerId;
        const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getSummary = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const query = {};
        if (farmerId) query.farmer = farmerId;

        const now = new Date();
        const [total, completed, pending, overdue] = await Promise.all([
            Task.countDocuments(query),
            Task.countDocuments({ ...query, status: 'completed' }),
            Task.countDocuments({ ...query, status: { $in: ['pending', 'in_progress', 'scheduled'] } }),
            Task.countDocuments({ ...query, status: { $ne: 'completed' }, dueDate: { $lt: now } })
        ]);

        res.json({ success: true, data: { total, completed, pending, overdue } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getUpcoming = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const now = new Date();
        const soon = new Date();
        soon.setDate(now.getDate() + 14);
        const query = { dueDate: { $gte: now, $lte: soon }, status: { $ne: 'completed' } };
        if (farmerId) query.farmer = farmerId;
        const tasks = await Task.find(query).sort({ dueDate: 1 });
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCategoryProgress = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const match = {};
        if (farmerId) {
            try {
                match.farmer = new mongoose.Types.ObjectId(farmerId);
            } catch (e) {
                return res.status(400).json({ success: false, message: 'Invalid farmerId' });
            }
        }
        const agg = await Task.aggregate([
            { $match: match },
            { $group: { _id: '$category', total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } },
            { $project: { category: '$_id', _id: 0, total: 1, completed: 1 } }
        ]);
        res.json({ success: true, data: agg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


