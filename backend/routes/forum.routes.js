import express from 'express';
import { addReply, createPost, deletePost, deleteReply, editPost, editReply, getAllPosts, getPost } from '../controllers/forum.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all forum posts
router.get('/', auth, getAllPosts);
// Get a single post
router.get('/:id', auth, getPost);
// Create a new post
router.post('/', auth, createPost);
// Edit a post
router.put('/:id', auth, editPost);
// Delete a post
router.delete('/:id', auth, deletePost);
// Add a reply to a post
router.post('/:id/reply', auth, addReply);
// Edit a reply
router.put('/:postId/reply/:replyId', auth, editReply);
// Delete a reply
router.delete('/:postId/reply/:replyId', auth, deleteReply);

export default router;