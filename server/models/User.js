// server/models/User.js - CORRECT VERSION
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  resumeData: {
    personalInfo: {
      fullName: String,
      jobTitle: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
    },
    summary: String,
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    }],
    education: [{
      degree: String,
      institution: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
    }],
    skills: [String],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String,
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      link: String,
    }],
    languages: [{
      name: String,
      proficiency: String,
    }],
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  atsSuggestions: [String],
  lastOptimized: Date,
  loginHistory: [{
    timestamp: Date,
    ip: String,
    userAgent: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);