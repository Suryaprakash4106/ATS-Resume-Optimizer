const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume',
  },
  content: {
    type: Object,
    required: true,
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  keywords: [String],
  suggestions: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  version: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

resumeSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Resume', resumeSchema);