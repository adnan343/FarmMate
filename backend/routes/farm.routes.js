import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {addFarm, deleteFarm, getFarms, getFarmById, getFarmsByFarmer, updateFarm} from "../controllers/farm.controller.js";

const router = express.Router();

// Public routes (for browsing farms)
router.get('/withoutAuth', getFarms);

// Get all farms (authenticated users)
router.get('/', auth, getFarms);

// Get farm by ID (authenticated users)
router.get('/:id', auth, getFarmById);

// Get farms by farmer (farmer or admin)
router.get('/farmer/:farmerId', auth, requireRole('farmer', 'admin'), getFarmsByFarmer);

// Add new farm (farmer only)
router.post('/', auth, requireRole('farmer'), addFarm);

// Update farm (farmer owner or admin)
router.put('/:id', auth, requireRole('farmer', 'admin'), updateFarm);

// Delete farm (farmer owner or admin)
router.delete('/:id', auth, requireRole('farmer', 'admin'), deleteFarm);

export default router;

