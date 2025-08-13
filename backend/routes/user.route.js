import express from 'express';
import auth from '../middleware/auth.js';
import { createUser, updateUser, deleteUser, loginUser, getUserById, getUsers, getUserIdByUsername, getFarmers, addToFavorites, removeFromFavorites, getUserFavorites,changePassword } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.get('/email/:email', getUserIdByUsername);
router.get('/farmers/all', getFarmers);

// Favorites routes
router.post('/:userId/favorites', auth, addToFavorites);
router.delete('/:userId/favorites/:productId', auth, removeFromFavorites);
router.get('/:userId/favorites', auth, getUserFavorites);
router.put('/:id/change-password', auth, changePassword); 



export default router;