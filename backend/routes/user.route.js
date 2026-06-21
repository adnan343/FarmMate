import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole, requireAdmin } from '../middleware/rbac.js';
import { createUser, updateUser, deleteUser, loginUser, logoutUser, getUserById, getUsers, getUserIdByUsername, getFarmers, getFarmerPublicProfile, addToFavorites, removeFromFavorites, getUserFavorites, changePassword, updateMyProfile, changeMyPassword, getMyProfile, suspendUser, activateUser } from '../controllers/user.controller.js';

const router = express.Router();

// Public routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

/**
 * Authenticated self-service endpoints (max security: never trust client-provided IDs)
 * NOTE: Must be declared BEFORE any "/:id" routes, otherwise ":id" matches "me"
 */
router.get('/me', auth, getMyProfile);
router.put('/me', auth, updateMyProfile);
router.put('/me/change-password', auth, changeMyPassword);

// Protected routes — require authentication
router.get('/farmers/all', auth, getFarmers);
router.get('/email/:email', auth, getUserIdByUsername);
router.get('/', auth, requireAdmin, getUsers);

// Public farmer profile (buyers browsing farmers)
router.get('/farmer-profile/:id', auth, getFarmerPublicProfile);
router.get('/:id', auth, getUserById);

// Admin-only user management
router.put('/:id/suspend', auth, requireAdmin, suspendUser);
router.put('/:id/activate', auth, requireAdmin, activateUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

// Favorites routes (buyer only for mutations)
router.post('/:userId/favorites', auth, requireRole('buyer'), addToFavorites);
router.delete('/:userId/favorites/:productId', auth, requireRole('buyer'), removeFromFavorites);
router.get('/:userId/favorites', auth, requireRole('buyer'), getUserFavorites);
router.put('/:id/change-password', auth, changePassword);

export default router;
