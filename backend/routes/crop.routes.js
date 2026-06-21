import express from 'express';
import {
    acceptCropSuggestion,
    addCrop,
    addTimelineItem,
    deleteCrop,
    deleteTimelineItem,
    generateCropTimeline,
    generateTimelineForCrop,
    getCrops,
    getCropsByFarm,
    getCropTimeline,
    getStoredCropSuggestions,
    harvestCrop,
    refreshCropSuggestions,
    suggestCrops,
    updateCrop,
    updateCropStage,
    updateTimelineItem
} from '../controllers/crop.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// Get all crops for a farmer (farmer or admin)
router.get('/farmer/:farmerId', auth, requireRole('farmer', 'admin'), getCrops);

// Get crops by farm (farmer or admin)
router.get('/farm/:farmId', auth, requireRole('farmer', 'admin'), getCropsByFarm);

// Add a new crop (farmer only)
router.post('/', auth, requireRole('farmer'), addCrop);

// Update crop stage (farmer only)
router.patch('/:cropId/stage', auth, requireRole('farmer'), updateCropStage);

// Update crop (farmer only)
router.put('/:cropId', auth, requireRole('farmer'), updateCrop);

// Delete crop (farmer only)
router.delete('/:cropId', auth, requireRole('farmer'), deleteCrop);

// Harvest crop and create product (farmer only)
router.post('/:cropId/harvest', auth, requireRole('farmer'), harvestCrop);

// AI Crop suggestions (farmer only)
router.post('/suggest/:farmId', auth, requireRole('farmer'), suggestCrops);

// Get stored crop suggestions (farmer or admin)
router.get('/suggestions/:farmId', auth, requireRole('farmer', 'admin'), getStoredCropSuggestions);

// Refresh crop suggestions (farmer only)
router.post('/suggestions/:farmId/refresh', auth, requireRole('farmer'), refreshCropSuggestions);

// Generate a crop timeline using OpenRouter for a suggestion (farmer only)
router.post('/timeline/:farmId/generate', auth, requireRole('farmer'), generateCropTimeline);

// Accept a suggestion and create crop with timeline (farmer only)
router.post('/suggestions/:farmId/accept', auth, requireRole('farmer'), acceptCropSuggestion);

// Timeline CRUD for a crop (farmer only)
router.get('/:cropId/timeline', auth, requireRole('farmer', 'admin'), getCropTimeline);
router.post('/:cropId/timeline', auth, requireRole('farmer'), addTimelineItem);
router.put('/:cropId/timeline/:index', auth, requireRole('farmer'), updateTimelineItem);
router.delete('/:cropId/timeline/:index', auth, requireRole('farmer'), deleteTimelineItem);

// Generate timeline for an existing crop (farmer only)
router.post('/:cropId/timeline/generate', auth, requireRole('farmer'), generateTimelineForCrop);

export default router;
