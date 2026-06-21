import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUser, FiFileText, FiBarChart2, FiLogOut, 
  FiSun, FiMoon, FiMenu, FiX, FiShield, FiClock 
} from 'react-icons/fi';

const Navbar = ({ darkMode, toggleDarkMode, isAuthenticated, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: <FiHome size={16} /> },
    ...(isAuthenticated ? [
      { path: '/dashboard', name: 'Dashboard', icon: <FiUser size={16} /> },
      { path: '/resume-builder', name: 'Resume', icon: <FiFileText size={16} /> },
      { path: '/ats-score', name: 'ATS Score', icon: <FiBarChart2 size={16} /> },
      { path: '/history', name: 'History', icon: <FiClock size={16} /> },
      ...(user?.role === 'admin' ? [{ path: '/admin', name: 'Admin', icon: <FiShield size={16} /> }] : []),
    ] : [])
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      darkMode ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800' : 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <button onClick={() => handleNavigation('/')} className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <span className="text-white font-bold text-base md:text-xl">A</span>
            </div>
            <span className={`font-bold text-base md:text-xl transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              ATS<span className="text-primary-500">Resume</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`group relative px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center space-x-1.5 text-sm cursor-pointer ${
                  darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
                <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 group-hover:w-full group-hover:left-0`} />
              </button>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className={`ml-4 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center space-x-1.5 text-sm cursor-pointer ${
                  darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              >
                <FiLogOut size={14} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleNavigation('/login')}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-300 text-sm cursor-pointer ${
                    darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`ml-2 p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {darkMode ? <FiSun size={14} /> : <FiMoon size={14} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className={`py-3 space-y-1 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg transition-all duration-300 text-sm cursor-pointer ${
                  darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg transition-all duration-300 text-sm cursor-pointer ${
                    darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg transition-all duration-300 text-sm cursor-pointer ${
                  darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <FiLogOut size={14} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;