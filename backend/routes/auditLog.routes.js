import express from 'express';
import auth from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { getAuditLogs } from '../controllers/auditLog.controller.js';

const router = express.Router();

// Admin-only: list audit logs
router.get('/', auth, requireAdmin, getAuditLogs);

export default router;
