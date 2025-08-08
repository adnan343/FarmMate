import express from 'express';
import { 
    getCrops, 
    getCropsByFarm, 
    addCrop, 
    updateCropStage, 
    updateCrop, 
    deleteCrop, 
    harvestCrop,
    suggestCrops,
    getStoredCropSuggestions,
    refreshCropSuggestions
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

router.post('/suggest/:farmId', auth, suggestCrops);

router.post('/suggest-test/:farmId', suggestCrops);

// Get stored crop suggestions
router.get('/suggestions/:farmId', auth, getStoredCropSuggestions);

// Test route without authentication
router.get('/suggestions-test/:farmId', getStoredCropSuggestions);

// Refresh crop suggestions (force new API call)
router.post('/suggestions/:farmId/refresh', auth, refreshCropSuggestions);


export default router; 