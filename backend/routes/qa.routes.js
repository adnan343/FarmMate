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

const router = express.Router();

// Farmer routes
router.post('/ask', auth, askQuestion);
router.get('/farmer', auth, getFarmerQuestions);
router.put('/:id', auth, editQuestion);
router.delete('/:id', auth, deleteQuestion);

// Admin routes
router.get('/admin', auth, getAllQuestions);
router.put('/:id/answer', auth, answerQuestion); // create/overwrite answer
router.put('/:id/answer/edit', auth, editAnswer); // edit own answer
router.delete('/:id/answer', auth, deleteAnswer); // delete own answer

// General route
router.get('/:id', auth, getQuestion);

export default router; 