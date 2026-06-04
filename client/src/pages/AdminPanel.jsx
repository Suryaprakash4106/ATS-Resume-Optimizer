import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiActivity, FiBarChart2, FiClock, FiTrash2, 
  FiEye, FiTrendingUp, FiUserCheck, FiUserX, FiRefreshCw,
  FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';  // ← ADD THIS LINE

const AdminPanel = ({ darkMode }) => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [optimizerHistory, setOptimizerHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [usersRes, activityRes, statsRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/admin/user-activity`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/admin/optimizer-history`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setUsers(usersRes.data.users || []);
      setActivities(activityRes.data.activities || []);
      setStats(statsRes.data.stats || {
        totalUsers: 0,
        verifiedUsers: 0,
        adminCount: 0,
        averageATSScore: 0,
        recentUsers: []
      });
      setOptimizerHistory(historyRes.data.history || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 size={14} /> },
    { id: 'users', label: 'Users', icon: <FiUsers size={14} /> },
    { id: 'activity', label: 'Activity', icon: <FiActivity size={14} /> },
    { id: 'optimizer', label: 'History', icon: <FiTrendingUp size={14} /> },
  ];

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers size={18} />, color: 'from-blue-500 to-cyan-500' },
    { title: 'Verified Users', value: stats?.verifiedUsers || 0, icon: <FiUserCheck size={18} />, color: 'from-green-500 to-emerald-500' },
    { title: 'Admin Users', value: stats?.adminCount || 0, icon: <FiUserX size={18} />, color: 'from-purple-500 to-pink-500' },
    { title: 'Avg ATS Score', value: `${Math.round(stats?.averageATSScore || 0)}%`, icon: <FiTrendingUp size={18} />, color: 'from-orange-500 to-red-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage users, view analytics, and monitor system performance
            </p>
          </div>
          <button
            onClick={fetchAllData}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-sm transition-all ${
              darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all duration-300 text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    darkMode ? 'glass-dark' : 'glass bg-white/50'
                  }`}
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white mb-3`}>
                    {stat.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-4 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
            >
              <h2 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Users
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className="text-left py-2 px-3 text-xs font-medium">Name</th>
                      <th className="text-left py-2 px-3 text-xs font-medium">Email</th>
                      <th className="text-left py-2 px-3 text-xs font-medium">Joined</th>
                      <th className="text-left py-2 px-3 text-xs font-medium">ATS Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentUsers || []).map((user, idx) => (
                      <tr key={idx} className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                        <td className="py-2 px-3">{user.name}</td>
                        <td className="py-2 px-3 text-xs">{user.email}</td>
                        <td className="py-2 px-3 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            user.atsScore >= 70 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {user.atsScore || 0}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-gray-500 text-sm">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <h2 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              All Users ({users.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left py-2 px-3 text-xs font-medium">Name</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Email</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Role</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Verified</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Joined</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <td className="py-2 px-3">{user.name}</td>
                      <td className="py-2 px-3 text-xs">{user.email}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {user.isVerified ? (
                          <FiCheckCircle className="text-green-500" size={14} />
                        ) : (
                          <FiAlertCircle className="text-yellow-500" size={14} />
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-3">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-500/20 transition-all"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* User Activity Tab */}
        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <h2 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              User Activity Log
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left py-2 px-3 text-xs font-medium">User</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Email</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Logins</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Last Login</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Last Optimized</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">ATS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, idx) => (
                    <tr key={idx} className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <td className="py-2 px-3">{activity.name}</td>
                      <td className="py-2 px-3 text-xs">{activity.email}</td>
                      <td className="py-2 px-3 text-xs">{activity.logins || 0}</td>
                      <td className="py-2 px-3 text-xs">
                        {activity.lastLogin ? new Date(activity.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {activity.lastOptimized ? new Date(activity.lastOptimized).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          activity.atsScore >= 70 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {activity.atsScore || 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                        No activity data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Optimizer History Tab */}
        {activeTab === 'optimizer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${darkMode ? 'glass-dark' : 'glass bg-white/50'}`}
          >
            <h2 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Resume Optimization History
            </h2>
            <div className="space-y-3">
              {optimizerHistory.length > 0 ? (
                optimizerHistory.map((history, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h3 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {history.name}
                        </h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {history.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          history.score >= 70 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          Score: {history.score}%
                        </span>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {history.optimizedAt ? new Date(history.optimizedAt).toLocaleString() : 'Not optimized'}
                        </p>
                      </div>
                    </div>
                    {history.suggestions && history.suggestions.length > 0 && (
                      <div className="mt-2">
                        <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Suggestions:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {history.suggestions.slice(0, 2).map((suggestion, sidx) => (
                            <li key={sidx} className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiActivity className="text-4xl mx-auto mb-2 text-gray-500" />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No optimization history yet
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;