import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'order_created',
      'order_cancelled',
      'order_status_changed',
      'product_created',
      'product_updated',
      'product_deleted',
      'product_marketplace_added',
      'product_marketplace_removed',
      'user_role_changed',
      'user_created',
      'user_deleted',
      'pest_detected',
      'crop_suggested',
      'task_auto_generated',
    ],
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    required: true,
    enum: ['order', 'product', 'user', 'task', 'pest_detection', 'crop_suggestion'],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  previousState: {
    type: mongoose.Schema.Types.Mixed,
  },
  newState: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ targetType: 1, targetId: 1 });
AuditLogSchema.index({ performedBy: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

export default AuditLog;