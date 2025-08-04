import mongoose from 'mongoose';

const ForumPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['question', 'experience', 'reply'],
    required: true
  },
  title: {
    type: String,
    required: function() { return this.type === 'question'; }
  },
  content: {
    type: String,
    required: true
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumPost'
    }
  ]
}, {
  timestamps: true
});

const ForumPost = mongoose.model('ForumPost', ForumPostSchema);

export default ForumPost;