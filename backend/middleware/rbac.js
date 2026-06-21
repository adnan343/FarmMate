/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Usage:
 *   router.get('/admin', auth, requireRole('admin'), handler)
 *   router.post('/', auth, requireRole('farmer', 'admin'), handler)
 */

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        msg: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
      });
    }
    next();
  };
};

/**
 * Require admin role
 */
export const requireAdmin = requireRole('admin');

/**
 * Require farmer or admin role
 */
export const requireFarmerOrAdmin = requireRole('farmer', 'admin');

/**
 * Require buyer or admin role
 */
export const requireBuyerOrAdmin = requireRole('buyer', 'admin');

/**
 * Ownership check helper
 * Verifies that the authenticated user owns the resource, or is admin
 */
export const requireOwnershipOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    if (req.user.role === 'admin') return next();

    const ownerId = await getResourceOwnerId(req);
    if (!ownerId) {
      return res.status(404).json({ success: false, msg: 'Resource not found' });
    }

    if (ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'Not authorized to access this resource' });
    }

    next();
  };
};