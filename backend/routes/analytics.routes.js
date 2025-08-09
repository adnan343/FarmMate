import express from 'express';
import auth from '../middleware/auth.js';
import { getYieldAnalyticsByFarmer } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/yield/:farmerId', auth, getYieldAnalyticsByFarmer);

export default router;


