import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTrendingUp, FiBarChart2, FiActivity, FiCalendar, FiLogIn } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const History = ({ darkMode }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const historyItems = [
    {
      title: 'Account Created',
      date: history?.createdAt,
      icon: <FiActivity />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Last Resume Optimization',
      date: history?.lastOptimized,
      icon: <FiTrendingUp />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Current ATS Score',
      value: `${history?.atsScore || 0}%`,
      icon: <FiBarChart2 />,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const loginHistory = history?.loginHistory || [];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Activity History
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your resume optimization journey and login activity
          </p>
        </div>

        {/* History Timeline */}
        <div className="space-y-6">
          {historyItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center p-6 rounded-2xl transition-all duration-300 zoom-on-hover ${
                darkMode ? 'glass-dark' : 'glass bg-white/50'
              }`}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white mr-4`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                {item.date ? (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <FiCalendar className="inline mr-1 mb-0.5" size={12} />
                    {new Date(item.date).toLocaleString()}
                  </p>
                ) : item.value ? (
                  <p className={`text-2xl font-bold ${getScoreColor(history?.atsScore || 0)}`}>
                    {item.value}
                  </p>
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Not yet available
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Login History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-6 p-6 rounded-2xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
        >
          <div className="flex items-center space-x-2 mb-4">
            <FiClock className="text-primary-500 text-xl" />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Login History
            </h2>
          </div>
          
          {loginHistory.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...loginHistory].reverse().map((login, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center p-3 rounded-xl transition-all duration-200 ${
                    darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FiLogIn className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(login.timestamp).toLocaleString()}
                      </p>
                      {login.userAgent && (
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {login.userAgent.split(' ').slice(0, 3).join(' ')}...
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                    ✓ Success
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiActivity className="text-5xl mx-auto mb-3 text-gray-500" />
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                No login history available yet
              </p>
            </div>
          )}
        </motion.div>

        {/* Optimization Suggestions History */}
        {history?.atsSuggestions && history.atsSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-6 p-6 rounded-2xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <div className="flex items-center space-x-2 mb-4">
              <FiTrendingUp className="text-primary-500 text-xl" />
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Optimization Suggestions
              </h2>
            </div>
            <div className="space-y-3">
              {history.atsSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 p-3 rounded-xl ${
                    darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!history?.createdAt && !history?.atsScore && loginHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-12 rounded-2xl text-center ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <FiActivity className="text-6xl mx-auto mb-4 text-gray-500" />
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Activity Yet
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Start building your resume and optimize it to see your activity history here.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default History;