import AuditLog from '../models/auditLog.model.js';

/**
 * Helper: create an audit log entry (non-blocking, fire-and-forget)
 * Always returns the log entry; never throws
 */
export async function logAudit({ action, performedBy, targetType, targetId, details, previousState, newState }) {
  try {
    const entry = await AuditLog.create({
      action,
      performedBy,
      targetType,
      targetId,
      details: details || {},
      previousState,
      newState,
    });
    return entry;
  } catch (err) {
    console.error('Audit log creation failed (non-critical):', err.message);
    return null;
  }
}

/**
 * GET /api/audit-logs
 * Admin-only: list audit logs with pagination and filters
 */
export const getAuditLogs = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, msg: 'Admin access required' });
  }

  try {
    const { action, targetType, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (targetType) filter.targetType = targetType;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('performedBy', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
};