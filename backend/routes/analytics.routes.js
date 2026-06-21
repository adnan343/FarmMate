import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole, requireAdmin } from '../middleware/rbac.js';
import { 
  getYieldAnalyticsByFarmer, 
  getFarmerDashboardAnalytics,
  getAdminAnalytics 
} from '../controllers/analytics.controller.js';

const router = express.Router();

// Admin-only analytics
router.get('/admin', auth, requireAdmin, getAdminAnalytics);

// Farmer analytics (farmer or admin)
router.get('/yield/:farmerId', auth, requireRole('farmer', 'admin'), getYieldAnalyticsByFarmer);
router.get('/farmer/:farmerId/dashboard', auth, requireRole('farmer', 'admin'), getFarmerDashboardAnalytics);

export default router;
