import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiFileText, FiBarChart2, FiClock, FiTrendingUp, 
  FiAward, FiTarget, FiCheckCircle, FiArrowRight 
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = ({ user, darkMode }) => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [resumeRes, scoreRes] = await Promise.all([
        axios.get('/api/resume/my-resume', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/score', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setResumeData(resumeRes.data.data);
      setAtsScore(scoreRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const statsCards = [
    { 
      title: 'ATS Score', 
      value: atsScore?.atsScore || 0, 
      icon: <FiBarChart2 size={18} />, 
      color: 'from-green-500 to-emerald-500',
      suffix: '%',
      path: '/ats-score'
    },
    { 
      title: 'Resume Status', 
      value: resumeData?.resumeData?.personalInfo?.fullName ? 'Completed' : 'In Progress', 
      icon: <FiFileText size={18} />, 
      color: 'from-blue-500 to-cyan-500',
      path: '/resume-builder'
    },
    { 
      title: 'Last Optimized', 
      value: atsScore?.lastOptimized ? new Date(atsScore.lastOptimized).toLocaleDateString() : 'Not yet', 
      icon: <FiClock size={18} />, 
      color: 'from-purple-500 to-pink-500',
      path: '/ats-score'
    },
    { 
      title: 'Suggestions', 
      value: atsScore?.atsSuggestions?.length || 0, 
      icon: <FiTrendingUp size={18} />, 
      color: 'from-orange-500 to-red-500',
      suffix: ' tips',
      path: '/ats-score'
    },
  ];

  const quickActions = [
    { name: 'Build Resume', icon: <FiFileText size={16} />, path: '/resume-builder', color: 'from-primary-500 to-accent-500' },
    { name: 'Check ATS Score', icon: <FiBarChart2 size={16} />, path: '/ats-score', color: 'from-purple-500 to-pink-500' },
    { name: 'View History', icon: <FiClock size={16} />, path: '/history', color: 'from-blue-500 to-cyan-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            ! 👋
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Track your resume performance and improve your ATS score
          </p>
        </motion.div>

        {/* Stats Grid - Clickable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -3 }}
              onClick={() => handleNavigation(stat.path)}
              className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                darkMode ? 'glass-dark hover:bg-gray-800/50' : 'glass bg-white/50 hover:bg-white/80'
              }`}
            >
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white mb-3`}>
                {stat.icon}
              </div>
              <h3 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.title}
              </h3>
              <p className={`text-xl font-bold ${stat.title === 'ATS Score' ? getScoreColor(stat.value) : (darkMode ? 'text-white' : 'text-gray-900')}`}>
                {stat.value}{stat.suffix || ''}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions & Resume Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quick Actions - Clickable */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-1 p-5 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <h2 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h2>
            <div className="space-y-2">
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01, x: 3 }}
                  onClick={() => handleNavigation(action.path)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{action.name}</span>
                  </div>
                  <FiArrowRight className={darkMode ? 'text-gray-500' : 'text-gray-400'} size={14} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-2 p-5 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Resume Preview
              </h2>
              <button
                onClick={() => handleNavigation('/resume-builder')}
                className="text-xs text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
              >
                Edit →
              </button>
            </div>
            
            {resumeData?.resumeData?.personalInfo?.fullName ? (
              <div className="space-y-3">
                <div>
                  <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resumeData.resumeData.personalInfo.fullName}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {resumeData.resumeData.personalInfo.jobTitle || 'Job Title not set'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(resumeData.resumeData.skills || []).slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-primary-500/20 text-primary-400">
                      {skill}
                    </span>
                  ))}
                  {(resumeData.resumeData.skills?.length || 0) > 5 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/20 text-gray-400">
                      +{resumeData.resumeData.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <FiFileText className="text-4xl mx-auto mb-2 text-gray-500" />
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No resume yet. Start building your ATS-friendly resume!
                </p>
                <button
                  onClick={() => handleNavigation('/resume-builder')}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  Create Resume
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* ATS Optimization Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-5 p-5 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
        >
          <div className="flex items-center space-x-2 mb-3">
            <FiAward className="text-primary-500 text-base" />
            <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ATS Optimization Tips
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Use standard section headings (Experience, Education, Skills)',
              'Include relevant keywords from job descriptions',
              'Avoid tables, columns, and graphics',
              'Save as .docx or .pdf for best results',
              'Use standard fonts like Arial, Calibri, or Times New Roman',
              'Quantify achievements with numbers and metrics'
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={12} />
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;