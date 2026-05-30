import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';

const Login = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      if (response.data.success) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update parent state if functions provided
        if (setIsAuthenticated) setIsAuthenticated(true);
        if (setUser) setUser(response.data.user);
        
        toast.success('Login successful!');
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full rounded-3xl p-8 transition-all duration-300 zoom-on-hover ${
          localStorage.getItem('darkMode') === 'true' ? 'glass-dark' : 'glass bg-white/50'
        }`}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <FiLogIn className="text-white text-3xl" />
          </div>
          <h2 className={`text-3xl font-bold ${localStorage.getItem('darkMode') === 'true' ? 'text-white' : 'text-gray-900'}`}>
            Welcome Back
          </h2>
          <p className={localStorage.getItem('darkMode') === 'true' ? 'text-gray-400' : 'text-gray-600'}>
            Sign in to continue to ATS Resume Optimizer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${localStorage.getItem('darkMode') === 'true' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 ${
                  localStorage.getItem('darkMode') === 'true' 
                    ? 'bg-white/10 text-white focus:bg-white/20' 
                    : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                }`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${localStorage.getItem('darkMode') === 'true' ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all duration-300 ${
                  localStorage.getItem('darkMode') === 'true' 
                    ? 'bg-white/10 text-white focus:bg-white/20' 
                    : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={`text-center mt-6 ${localStorage.getItem('darkMode') === 'true' ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;