import express from 'express';
import {
    answerQuestion,
    askQuestion,
    deleteAnswer,
    deleteQuestion,
    editAnswer,
    editQuestion,
    getAllQuestions,
    getFarmerQuestions,
    getQuestion
} from '../controllers/qa.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// Farmer routes
router.post('/ask', auth, requireRole('farmer'), askQuestion);
router.get('/farmer', auth, requireRole('farmer'), getFarmerQuestions);
router.put('/:id', auth, requireRole('farmer'), editQuestion);
router.delete('/:id', auth, requireRole('farmer'), deleteQuestion);

// Admin routes
router.get('/admin', auth, requireRole('admin'), getAllQuestions);
router.put('/:id/answer', auth, requireRole('admin'), answerQuestion);
router.put('/:id/answer/edit', auth, requireRole('admin'), editAnswer);
router.delete('/:id/answer', auth, requireRole('admin'), deleteAnswer);

// General route (any authenticated user)
router.get('/:id', auth, getQuestion);

export default router;
