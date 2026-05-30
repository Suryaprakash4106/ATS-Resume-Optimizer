import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('register');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') setEmail(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Using API_URL from config
      const response = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      if (response.data.success) {
        setEmail(formData.email);
        setStep('verify');
        toast.success('OTP sent to your email!');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Using API_URL from config
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Email verified! Please login.');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      // Using API_URL from config
      await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
      toast.success('OTP resent! Check your email or server console');
    } catch (error) {
      console.error('Resend error:', error.response?.data);
      toast.error('Failed to resend OTP');
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
            <FiUserPlus className="text-white text-3xl" />
          </div>
          <h2 className={`text-3xl font-bold ${localStorage.getItem('darkMode') === 'true' ? 'text-white' : 'text-gray-900'}`}>
            {step === 'register' ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className={localStorage.getItem('darkMode') === 'true' ? 'text-gray-400' : 'text-gray-600'}>
            {step === 'register' ? 'Start your journey to better resumes' : `Enter OTP sent to ${email}`}
          </p>
        </div>

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${localStorage.getItem('darkMode') === 'true' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 ${
                    localStorage.getItem('darkMode') === 'true' 
                      ? 'bg-white/10 text-white focus:bg-white/20' 
                      : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                  }`}
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${localStorage.getItem('darkMode') === 'true' ? 'text-gray-300' : 'text-gray-700'}`}>
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className={`w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl outline-none transition-all duration-300 ${
                  localStorage.getItem('darkMode') === 'true' 
                    ? 'bg-white/10 text-white focus:bg-white/20' 
                    : 'bg-gray-100 text-gray-900 focus:bg-gray-200'
                }`}
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <p className="text-center">
              <button
                type="button"
                onClick={resendOTP}
                className="text-primary-500 hover:text-primary-600 text-sm"
              >
                Resend OTP
              </button>
            </p>
          </form>
        )}

        {step === 'register' && (
          <p className={`text-center mt-6 ${localStorage.getItem('darkMode') === 'true' ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
              Sign In
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Register;