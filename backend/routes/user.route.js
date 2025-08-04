import express from 'express';
import { createUser, updateUser, deleteUser, loginUser, getUserById, getUsers, getUserIdByUsername, getFarmers, addToFavorites, removeFromFavorites, getUserFavorites } from '../controllers/user.controller.js';

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
router.post('/:userId/favorites', addToFavorites);
router.delete('/:userId/favorites/:productId', removeFromFavorites);
router.get('/:userId/favorites', getUserFavorites);

export default router;