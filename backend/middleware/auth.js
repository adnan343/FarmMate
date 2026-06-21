import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { getJwtSecret } from '../config/jwt.js';

const auth = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = req.headers?.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice('Bearer '.length)
      : undefined;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
    }


    // Verify token cryptographically
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret);
    
    // Find user by ID from verified token payload
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, msg: 'User not found' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ success: false, msg: 'Account has been suspended. Please contact an administrator.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ success: false, msg: 'Authentication failed or token invalid' });
  }
};

export default auth;