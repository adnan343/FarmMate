import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  createFarmCondition,
  getFarmerFarmConditions,
  getFarmCondition,
  updateFarmConditionStatus,
  deleteFarmCondition,
  getFarmConditionStats
} from '../controllers/farmCondition.controller.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new farm condition report (farmer only)
router.post('/', requireRole('farmer'), createFarmCondition);

// Get farm condition statistics (farmer or admin)
router.get('/stats', requireRole('farmer', 'admin'), getFarmConditionStats);

// Get all farm conditions for the authenticated farmer (farmer or admin)
router.get('/', requireRole('farmer', 'admin'), getFarmerFarmConditions);

// Get a specific farm condition report (farmer or admin)
router.get('/:reportId', requireRole('farmer', 'admin'), getFarmCondition);

// Update farm condition status (farmer or admin)
router.patch('/:reportId/status', requireRole('farmer', 'admin'), updateFarmConditionStatus);

// Delete a farm condition report (farmer only)
router.delete('/:reportId', requireRole('farmer'), deleteFarmCondition);

export default router;