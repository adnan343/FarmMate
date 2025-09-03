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

const router = express.Router();

// Get all crops for a farmer
router.get('/farmer/:farmerId', getCrops);

// Get crops by farm
router.get('/farm/:farmId', getCropsByFarm);

// Add a new crop
router.post('/', addCrop);

// Update crop stage
router.patch('/:cropId/stage', updateCropStage);

// Update crop
router.put('/:cropId', updateCrop);

// Delete crop
router.delete('/:cropId', deleteCrop);

// Harvest crop and create product
router.post('/:cropId/harvest', harvestCrop);

router.post('/suggest/:farmId', suggestCrops);

router.post('/suggest-test/:farmId', suggestCrops);

// Get stored crop suggestions
router.get('/suggestions/:farmId', getStoredCropSuggestions);

// Test route without authentication
router.get('/suggestions-test/:farmId', getStoredCropSuggestions);

// Refresh crop suggestions (force new API call)
router.post('/suggestions/:farmId/refresh', refreshCropSuggestions);

// Generate a crop timeline using Gemini for a suggestion
router.post('/timeline/:farmId/generate', generateCropTimeline);

// Accept a suggestion and create crop with timeline
router.post('/suggestions/:farmId/accept', acceptCropSuggestion);

// Timeline CRUD for a crop
router.get('/:cropId/timeline', getCropTimeline);
router.post('/:cropId/timeline', addTimelineItem);
router.put('/:cropId/timeline/:index', updateTimelineItem);
router.delete('/:cropId/timeline/:index', deleteTimelineItem);

// Generate timeline for an existing crop
router.post('/:cropId/timeline/generate', generateTimelineForCrop);


export default router; 