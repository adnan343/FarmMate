import express from 'express';
import { createTask, deleteTask, getCategoryProgress, getSummary, getTaskById, getTasks, getUpcoming, updateTask, getAIPrioritized, getGroupedTasks } from '../controllers/task.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// List tasks (farmer or admin)
router.get('/', auth, requireRole('farmer', 'admin'), getTasks);
router.get('/farmer/:farmerId', auth, requireRole('farmer', 'admin'), getTasks);
router.get('/summary/:farmerId', auth, requireRole('farmer', 'admin'), getSummary);
router.get('/upcoming/:farmerId', auth, requireRole('farmer', 'admin'), getUpcoming);
router.get('/categories/:farmerId', auth, requireRole('farmer', 'admin'), getCategoryProgress);

// AI-Prioritized endpoints (farmer only)
router.get('/ai-prioritized/:farmerId', auth, requireRole('farmer'), getAIPrioritized);
router.get('/grouped/:farmerId', auth, requireRole('farmer'), getGroupedTasks);

// CRUD (farmer only)
router.post('/', auth, requireRole('farmer'), createTask);
router.get('/:id', auth, requireRole('farmer', 'admin'), getTaskById);
router.put('/:id', auth, requireRole('farmer'), updateTask);
router.delete('/:id', auth, requireRole('farmer'), deleteTask);

export default router;


