import mongoose from 'mongoose';

const QASchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'answered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const QA = mongoose.model('QA', QASchema);

export default QA; 