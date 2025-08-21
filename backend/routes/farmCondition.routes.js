import express from 'express';
import auth from '../middleware/auth.js';
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

// Create a new farm condition report
router.post('/', createFarmCondition);

// Get farm condition statistics
router.get('/stats', getFarmConditionStats);

// Get all farm conditions for the authenticated farmer
router.get('/', getFarmerFarmConditions);

// Get a specific farm condition report
router.get('/:reportId', getFarmCondition);

// Update farm condition status
router.patch('/:reportId/status', updateFarmConditionStatus);

// Delete a farm condition report
router.delete('/:reportId', deleteFarmCondition);

export default router;
