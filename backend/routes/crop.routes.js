import express from 'express';
import { 
    getCrops, 
    getCropsByFarm, 
    addCrop, 
    updateCropStage, 
    updateCrop, 
    deleteCrop, 
    harvestCrop 
} from '../controllers/crop.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all crops for a farmer
router.get('/farmer/:farmerId', auth, getCrops);

// Get crops by farm
router.get('/farm/:farmId', auth, getCropsByFarm);

// Add a new crop
router.post('/', auth, addCrop);

// Update crop stage
router.patch('/:cropId/stage', auth, updateCropStage);

// Update crop
router.put('/:cropId', auth, updateCrop);

// Delete crop
router.delete('/:cropId', auth, deleteCrop);

// Harvest crop and create product
router.post('/:cropId/harvest', auth, harvestCrop);

export default router; 