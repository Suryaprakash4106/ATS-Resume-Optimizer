import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, FiTrendingUp, FiAlertCircle, FiCheckCircle, 
  FiTarget, FiRefreshCw, FiFileText, FiArrowRight 
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const ATSScore = ({ user, darkMode }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [atsData, setAtsData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [resumeRes, scoreRes] = await Promise.all([
        axios.get('/api/resume/my-resume', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/score', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setResumeData(resumeRes.data.data);
      setAtsData(scoreRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    // Check if resume has content
    if (!resumeData?.resumeData) {
      toast.error('Please create your resume first. Go to Resume Builder.', {
        duration: 4000
      });
      return;
    }

    // Check if any content is filled
    const hasContent = resumeData.resumeData.personalInfo?.fullName || 
                       resumeData.resumeData.summary || 
                       (resumeData.resumeData.skills?.length > 0);
    
    if (!hasContent) {
      toast.error('Your resume is empty. Please add some content in Resume Builder first.', {
        duration: 4000
      });
      return;
    }

    setAnalyzing(true);
    toast.loading('Analyzing your resume...', { id: 'analyze' });
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/resume/analyze', 
        { 
          resumeData: resumeData.resumeData, 
          jobDescription: jobDescription 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        const analysis = response.data.analysis;
        setAnalysisResult(analysis);
        setShowResults(true);
        toast.success(`ATS Score: ${analysis.score}%`, { id: 'analyze' });
        
        // Refresh data to update stored score
        fetchData();
      } else {
        toast.error(response.data.message || 'Analysis failed', { id: 'analyze' });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMsg = error.response?.data?.message || 'Analysis failed. Please try again.';
      toast.error(errorMsg, { id: 'analyze' });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return '🎉 Excellent! Your resume is highly ATS-friendly!';
    if (score >= 60) return '👍 Good! Some improvements needed.';
    if (score > 0) return '⚠️ Needs improvement. Follow suggestions below.';
    return '📝 Click "Analyze Resume" to get your score';
  };

  const score = atsData?.atsScore || 0;
  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (score / 100) * circumference;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading ATS data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ATS Score Analyzer
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Check how well your resume performs against ATS systems
            </p>
          </div>
          <button
            onClick={analyzeResume}
            disabled={analyzing}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-300 text-sm ${
              analyzing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'
            } bg-gradient-to-r from-primary-500 to-accent-500 text-white`}
          >
            <FiRefreshCw className={analyzing ? 'animate-spin' : ''} size={14} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Resume'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Score Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`lg:col-span-1 p-5 rounded-xl flex flex-col items-center ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <h2 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Overall ATS Score
            </h2>
            <div className="relative w-56 h-56">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke={darkMode ? '#374151' : '#e5e7eb'}
                  strokeWidth="10"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  out of 100
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {getScoreMessage(score)}
              </p>
            </div>
          </motion.div>

          {/* Suggestions & Job Description */}
          <div className="lg:col-span-2 space-y-5">
            {/* Job Description Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <FiTarget className="text-primary-500 text-base" />
                <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Target Job Description (Optional)
                </h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 rounded-lg outline-none transition-all resize-none text-sm ${
                  darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                }`}
                placeholder="Paste the job description here for better keyword matching..."
              />
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Adding a job description helps identify missing keywords specific to the role
              </p>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-5 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <FiTrendingUp className="text-primary-500 text-base" />
                <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Optimization Suggestions
                </h2>
              </div>
              
              {atsData?.atsSuggestions && atsData.atsSuggestions.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {atsData.atsSuggestions.map((suggestion, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-start space-x-2 p-2.5 rounded-lg text-sm ${
                        darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <FiAlertCircle className="text-yellow-500 mt-0.5 flex-shrink-0" size={14} />
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  {score === 0 ? (
                    <>
                      <FiBarChart2 className="text-4xl mx-auto mb-2 text-gray-500" />
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click "Analyze Resume" to get personalized suggestions
                      </p>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="text-4xl mx-auto mb-2 text-green-500" />
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Great job! Your resume is well-optimized for ATS.
                      </p>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-5 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <FiFileText className="text-primary-500 text-base" />
                <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ATS Best Practices
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Use standard section headings',
                  'Avoid tables, columns, graphics',
                  'Save as .docx or .pdf',
                  'Include keywords from job description',
                  'Use standard fonts',
                  'Quantify achievements with numbers',
                  'Use bullet points',
                  'Keep formatting simple'
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={12} />
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Analysis Results Modal */}
      {showResults && analysisResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-2xl w-full rounded-xl p-5 ${darkMode ? 'bg-gray-900' : 'bg-white'} max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ATS Analysis Results
              </h2>
              <button
                onClick={() => setShowResults(false)}
                className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>

            {/* Score */}
            <div className={`text-center p-4 rounded-lg mb-4 ${getScoreBgColor(analysisResult.score)}`}>
              <div className={`text-5xl font-bold ${getScoreColor(analysisResult.score)}`}>
                {analysisResult.score}%
              </div>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ATS Compatibility Score
              </p>
            </div>

            {/* Strengths */}
            {analysisResult.strengths?.length > 0 && (
              <div className="mb-4">
                <h3 className={`font-semibold text-sm mb-2 text-green-500`}>✅ Strengths</h3>
                <ul className="space-y-1">
                  {analysisResult.strengths.map((strength, idx) => (
                    <li key={idx} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-start space-x-2`}>
                      <span>•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysisResult.suggestions?.length > 0 && (
              <div className="mb-4">
                <h3 className={`font-semibold text-sm mb-2 text-yellow-500`}>💡 Suggestions</h3>
                <ul className="space-y-1">
                  {analysisResult.suggestions.map((suggestion, idx) => (
                    <li key={idx} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-start space-x-2`}>
                      <span>•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {analysisResult.missingKeywords?.length > 0 && (
              <div className="mb-4">
                <h3 className={`font-semibold text-sm mb-2 text-red-500`}>🎯 Missing Keywords</h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.missingKeywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowResults(false)}
              className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ATSScore;