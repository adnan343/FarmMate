import express from 'express';
import { createTask, deleteTask, getCategoryProgress, getSummary, getTaskById, getTasks, getUpcoming, updateTask } from '../controllers/task.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// List tasks (optionally filter by farmerId)
router.get('/', auth, getTasks);
router.get('/farmer/:farmerId', auth, getTasks);
router.get('/summary/:farmerId', auth, getSummary);
router.get('/upcoming/:farmerId', auth, getUpcoming);
router.get('/categories/:farmerId', auth, getCategoryProgress);

// CRUD
router.post('/', auth, createTask);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

export default router;


