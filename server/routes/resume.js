const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Save resume data
router.post('/save', protect, async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    const user = await User.findById(req.user._id);
    user.resumeData = resumeData;
    user.updatedAt = new Date();
    await user.save();
    
    res.json({ message: 'Resume saved successfully', success: true, data: user.resumeData });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get resume data
router.get('/my-resume', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('resumeData atsScore atsSuggestions');
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: error.message, success: false });
  }
});

// Analyze resume with AI (without external API - fallback)
router.post('/analyze', protect, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    
    // Check if resume has content
    if (!resumeData || Object.keys(resumeData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resume data is empty. Please add content to your resume first.' 
      });
    }
    
    // Calculate ATS score locally (fallback if Gemini fails)
    const calculateLocalScore = (data, jobDesc) => {
      let score = 0;
      let suggestions = [];
      let missingKeywords = [];
      let strengths = [];
      let formatIssues = [];
      
      // Personal Info check
      if (data.personalInfo?.fullName) score += 5;
      if (data.personalInfo?.email) score += 5;
      if (data.personalInfo?.phone) score += 5;
      if (data.personalInfo?.linkedin) score += 3;
      
      // Summary check
      if (data.summary && data.summary.length > 50) {
        score += 10;
        strengths.push('Professional summary is well-written');
      } else if (data.summary) {
        score += 5;
        suggestions.push('Add more details to your professional summary (at least 50 characters)');
      } else {
        suggestions.push('Add a professional summary to highlight your key strengths');
      }
      
      // Experience check
      if (data.experience && data.experience.length > 0) {
        score += 20;
        strengths.push(`${data.experience.length} work experience entries added`);
        const hasDescriptions = data.experience.some(exp => exp.description && exp.description.length > 30);
        if (!hasDescriptions) {
          suggestions.push('Add detailed descriptions for your work experience with achievements');
        }
      } else {
        suggestions.push('Add work experience to showcase your professional background');
      }
      
      // Education check
      if (data.education && data.education.length > 0) {
        score += 15;
        strengths.push('Education section completed');
      } else {
        suggestions.push('Add your educational qualifications');
      }
      
      // Skills check
      if (data.skills && data.skills.length > 0) {
        score += Math.min(data.skills.length * 2, 20);
        strengths.push(`${data.skills.length} skills listed`);
        if (data.skills.length < 5) {
          suggestions.push('Add more relevant skills (at least 5)');
        }
      } else {
        suggestions.push('Add your technical and professional skills');
      }
      
      // Projects check
      if (data.projects && data.projects.length > 0) {
        score += 10;
        strengths.push(`${data.projects.length} projects added`);
      } else {
        suggestions.push('Add projects to showcase your practical experience');
      }
      
      // Format issues
      if (data.personalInfo?.fullName?.length > 50) {
        formatIssues.push('Full name is too long, keep it concise');
      }
      
      // Job description keyword matching
      if (jobDesc && jobDesc.trim().length > 0) {
        const jobDescLower = jobDesc.toLowerCase();
        const allText = JSON.stringify(data).toLowerCase();
        const commonKeywords = ['react', 'node', 'python', 'java', 'javascript', 'aws', 'docker', 'kubernetes', 'sql', 'mongodb', 'html', 'css', 'api', 'rest', 'git', 'agile', 'scrum'];
        
        commonKeywords.forEach(keyword => {
          if (jobDescLower.includes(keyword) && !allText.includes(keyword)) {
            missingKeywords.push(keyword);
          }
        });
        
        if (missingKeywords.length > 0) {
          suggestions.push(`Add these missing keywords to improve match: ${missingKeywords.slice(0, 5).join(', ')}`);
        }
      }
      
      // Cap score at 100
      score = Math.min(Math.round(score), 100);
      
      // Add final suggestions based on score
      if (score < 50) {
        suggestions.push('Your resume needs significant improvement. Add more details and achievements.');
      } else if (score < 70) {
        suggestions.push('Good start! Add more specific achievements and quantify your results.');
      } else if (score >= 80) {
        strengths.push('Excellent resume! Well optimized for ATS systems.');
      }
      
      return { score, suggestions, missingKeywords, strengths, formatIssues };
    };
    
    // Try Gemini API first, fallback to local calculation
    let analysis;
    let usedGemini = false;
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Analyze this resume for ATS (Applicant Tracking System) compatibility.
        
        Resume: ${JSON.stringify(resumeData)}
        
        Job Description: ${jobDescription || 'Not provided'}
        
        Provide analysis in JSON format only (no other text):
        {
          "score": number between 0-100,
          "missingKeywords": ["keyword1", "keyword2"],
          "suggestions": ["suggestion1", "suggestion2"],
          "formatIssues": ["issue1", "issue2"],
          "strengths": ["strength1", "strength2"]
        }
      `;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean the response (remove markdown code blocks if present)
      let cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanJson);
      usedGemini = true;
      
    } catch (geminiError) {
      console.log('Gemini API failed, using local calculation:', geminiError.message);
      analysis = calculateLocalScore(resumeData, jobDescription);
    }
    
    // Save analysis to user
    const user = await User.findById(req.user._id);
    user.atsScore = analysis.score;
    user.atsSuggestions = analysis.suggestions || [];
    user.lastOptimized = new Date();
    await user.save();
    
    res.json({ 
      success: true, 
      analysis: {
        score: analysis.score,
        missingKeywords: analysis.missingKeywords || [],
        suggestions: analysis.suggestions || [],
        formatIssues: analysis.formatIssues || [],
        strengths: analysis.strengths || []
      },
      usedGemini
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze resume. Please try again.',
      error: error.message 
    });
  }
});

// Get ATS score
router.get('/score', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('atsScore atsSuggestions lastOptimized');
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Score error:', error);
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;