import express from 'express';
import auth from '../middleware/auth.js';
import {addFarm, deleteFarm, getFarms, getFarmsByFarmer, updateFarm} from "../controllers/farm.controller.js";

const router = express.Router();

// Get all farms
router.get('/', auth, getFarms);

router.get('/withoutAuth', getFarms);

// Get farms by farmer
router.get('/farmer/:farmerId', auth, getFarmsByFarmer);

// Add new farm
router.post('/', auth, addFarm);

// Update farm
router.put('/:id', auth, updateFarm);

// Delete farm
router.delete('/:id', auth, deleteFarm);

export default router;  ///api/farms

