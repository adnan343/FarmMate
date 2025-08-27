import QA from '../models/qa.model.js';

// Farmer: Ask a new question
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!req.user || req.user.role !== 'farmer') {
      return res.status(403).json({ success: false, msg: 'Only farmers can ask questions' });
    }
    const qa = new QA({ farmer: req.user._id, question });
    await qa.save();
    res.status(201).json({ success: true, data: qa });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error asking question', error: err.message });
  }
};

// Farmer: Get their own questions
export const getFarmerQuestions = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'farmer') {
      return res.status(403).json({ success: false, msg: 'Access denied' });
    }
    const questions = await QA.find({ farmer: req.user._id })
      .populate('admin', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching questions', error: err.message });
  }
};

// Admin: Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Only admins can view all questions' });
    }
    const questions = await QA.find()
      .populate('farmer', 'name email')
      .populate('admin', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching questions', error: err.message });
  }
};

// Admin: Answer a question
export const answerQuestion = async (req, res) => {
  try {
    const { answer } = req.body;
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, msg: 'Only admins can answer questions' });
    }
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ success: false, msg: 'Question not found' });
    }
    qa.answer = answer;
    qa.admin = req.user._id;
    qa.status = 'answered';
    qa.answeredAt = new Date();
    await qa.save();
    res.json({ success: true, data: qa });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error answering question', error: err.message });
  }
};

// Farmer: Edit their own question
export const editQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ success: false, msg: 'Question not found' });
    }
    if (!req.user || req.user.role !== 'farmer' || qa.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'You can only edit your own questions' });
    }
    qa.question = question;
    await qa.save();
    res.json({ success: true, data: qa });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error editing question', error: err.message });
  }
};

// Farmer: Delete their own question
export const deleteQuestion = async (req, res) => {
  try {
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ success: false, msg: 'Question not found' });
    }
    const isFarmerOwner = req.user && req.user.role === 'farmer' && qa.farmer.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isFarmerOwner && !isAdmin) {
      return res.status(403).json({ success: false, msg: 'Not authorized to delete this question' });
    }
    await QA.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error deleting question', error: err.message });
  }
};

// Admin: Edit their own answer
export const editAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ success: false, msg: 'Question not found' });
    }
    if (!req.user || req.user.role !== 'admin' || !qa.admin || qa.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'You can only edit your own answers' });
    }
    qa.answer = answer;
    await qa.save();
    res.json({ success: true, data: qa });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error editing answer', error: err.message });
  }
};

// Admin: Delete their own answer
export const deleteAnswer = async (req, res) => {
  try {
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ success: false, msg: 'Question not found' });
    }
    if (!req.user || req.user.role !== 'admin' || !qa.admin || qa.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, msg: 'You can only delete your own answers' });
    }
    qa.answer = null;
    qa.admin = null;
    qa.status = 'pending';
    qa.answeredAt = null;
    await qa.save();
    res.json({ success: true, msg: 'Answer deleted successfully', data: qa });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error deleting answer', error: err.message });
  }
};

// Get single question
export const getQuestion = async (req, res) => {
  try {
    const qa = await QA.findById(req.params.id)
      .populate('farmer', 'name email')
      .populate('admin', 'name');
    if (!qa) {
      return res.status(404).json({ success: false, msg: 'Question not found' });
    }
    res.json({ success: true, data: qa });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching question', error: err.message });
  }
}; 