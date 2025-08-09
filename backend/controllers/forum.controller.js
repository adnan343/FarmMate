import ForumPost from '../models/forum.model.js';

// Get all forum posts (questions and experiences)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ type: { $in: ['question', 'experience'] } })
      .populate('author', 'name')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name' }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching posts', error: err.message });
  }
};

// Get a single post (with replies)
export const getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name' }
      });
    if (!post) return res.status(404).json({ success: false, msg: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching post', error: err.message });
  }
};

// Create a new post (question or experience)
export const createPost = async (req, res) => {
  try {
    const { type, title, content } = req.body;
    if (!req.user || req.user.role !== 'farmer') {
      return res.status(403).json({ success: false, msg: 'Only farmers can post in the forum' });
    }
    const post = new ForumPost({
      author: req.user._id,
      type,
      title: type === 'question' ? title : undefined,
      content
    });
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error creating post', error: err.message });
  }
};

// Edit a post
export const editPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, msg: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'You can only edit your own posts' });
    }
    
    // Update the post
    if (post.type === 'question' && title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error editing post', error: err.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, msg: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'You can only delete your own posts' });
    }
    
    // Delete all replies first
    if (post.replies && post.replies.length > 0) {
      await ForumPost.deleteMany({ _id: { $in: post.replies } });
    }
    
    // Delete the post
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error deleting post', error: err.message });
  }
};

// Add a reply to a post
export const addReply = async (req, res) => {
  try {
    const { content } = req.body;
    if (!req.user || req.user.role !== 'farmer') {
      return res.status(403).json({ success: false, msg: 'Only farmers can reply in the forum' });
    }
    const parentPost = await ForumPost.findById(req.params.id);
    if (!parentPost) return res.status(404).json({ success: false, msg: 'Post not found' });
    const reply = new ForumPost({
      author: req.user._id,
      type: 'reply',
      content
    });
    await reply.save();
    parentPost.replies.push(reply._id);
    await parentPost.save();
    res.status(201).json({ success: true, data: reply });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error adding reply', error: err.message });
  }
};

// Edit a reply
export const editReply = async (req, res) => {
  try {
    const { content } = req.body;
    const reply = await ForumPost.findById(req.params.replyId);
    
    if (!reply) {
      return res.status(404).json({ success: false, msg: 'Reply not found' });
    }
    
    if (reply.type !== 'reply') {
      return res.status(400).json({ success: false, msg: 'This is not a reply' });
    }
    
    // Check if user is the author
    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'You can only edit your own replies' });
    }
    
    reply.content = content;
    await reply.save();
    res.json({ success: true, data: reply });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error editing reply', error: err.message });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  try {
    const reply = await ForumPost.findById(req.params.replyId);
    
    if (!reply) {
      return res.status(404).json({ success: false, msg: 'Reply not found' });
    }
    
    if (reply.type !== 'reply') {
      return res.status(400).json({ success: false, msg: 'This is not a reply' });
    }
    
    // Check if user is the author
    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'You can only delete your own replies' });
    }
    
    // Remove reply from parent post
    const parentPost = await ForumPost.findById(req.params.postId);
    if (parentPost) {
      parentPost.replies = parentPost.replies.filter(id => id.toString() !== reply._id.toString());
      await parentPost.save();
    }
    
    // Delete the reply
    await ForumPost.findByIdAndDelete(req.params.replyId);
    res.json({ success: true, msg: 'Reply deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error deleting reply', error: err.message });
  }
};