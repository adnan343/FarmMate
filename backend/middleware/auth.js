import User from '../models/user.model.js';

const auth = async (req, res, next) => {
  try {
    // Get userId from cookies (similar to how other parts of the app do it)
    const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {}) || {};

    const userId = cookies.userId;
    if (!userId) {
      return res.status(401).json({ success: false, msg: 'No user ID, authorization denied' });
    }

    // Find user by ID
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, msg: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ success: false, msg: 'Authentication failed' });
  }
};

export default auth;