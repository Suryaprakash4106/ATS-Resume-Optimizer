import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiGithub, FiLinkedin, FiTwitter, FiMail, FiPhone, FiMapPin, 
  FiHeart, FiTrendingUp, FiShield, FiUsers, FiAward, FiClock,
  FiArrowRight
} from 'react-icons/fi';

const Footer = ({ darkMode }) => {
  const footerLinks = [
    { name: 'Home', path: '/', icon: <FiTrendingUp size={14} /> },
    { name: 'Resume Builder', path: '/resume-builder', icon: <FiAward size={14} /> },
    { name: 'ATS Score', path: '/ats-score', icon: <FiClock size={14} /> },
    { name: 'Admin', path: '/admin', icon: <FiShield size={14} /> },
  ];

  // Updated with your social links
  const socialLinks = [
    { name: 'GitHub', icon: <FiGithub size={16} />, url: 'https://github.com/prakashkt2004', color: 'hover:text-gray-400' },
    { name: 'LinkedIn', icon: <FiLinkedin size={16} />, url: 'https://linkedin.com/in/prakashkt', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: <FiTwitter size={16} />, url: 'https://twitter.com/prakashkt', color: 'hover:text-blue-300' },
    { name: 'Email', icon: <FiMail size={16} />, url: 'mailto:prakashkt2004@gmail.com', color: 'hover:text-red-400' },
  ];

  return (
    <footer className={`relative mt-20 transition-all duration-300 ${
      darkMode ? 'bg-gray-900/95 backdrop-blur-xl border-t border-gray-800' : 'bg-white/95 backdrop-blur-xl border-t border-gray-200'
    }`}>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-border-slide" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 6 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">A</span>
              </motion.div>
              <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ATS<span className="text-primary-500">Resume</span>
              </span>
            </Link>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              AI-powered ATS Resume Optimizer to help you land your dream job.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${social.color}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - With Hover Effect */}
          <div className="space-y-3">
            <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`group flex items-center justify-between transition-all duration-300 text-xs ${
                      darkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="transition-all duration-300 group-hover:scale-110">
                        {link.icon}
                      </span>
                      <span className="transition-all duration-300 group-hover:translate-x-1">
                        {link.name}
                      </span>
                    </div>
                    <FiArrowRight 
                      size={12} 
                      className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Contact</h3>
            <ul className="space-y-3">
              {/* Email */}
              <motion.li 
                whileHover={{ x: 5 }} 
                className={`flex items-center space-x-3 text-sm transition-all duration-300 cursor-pointer ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiMail className="text-primary-500" size={14} />
                <span>prakashkt2004@gmail.com</span>
              </motion.li>
              
              {/* Phone */}
              <motion.li 
                whileHover={{ x: 5 }} 
                className={`flex items-center space-x-3 text-sm transition-all duration-300 cursor-pointer ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiPhone className="text-primary-500" size={14} />
                <span>+91 63744 29639</span>
              </motion.li>
              
              {/* Location */}
              <motion.li 
                whileHover={{ x: 5 }} 
                className={`flex items-center space-x-3 text-sm transition-all duration-300 cursor-pointer ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiMapPin className="text-primary-500" size={14} />
                <span>India</span>
              </motion.li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Stay Updated</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get latest updates on ATS tips and resume strategies.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className={`flex-1 px-3 py-2 rounded-l-lg outline-none transition-all duration-300 text-sm ${
                  darkMode ? 'bg-gray-800 text-white placeholder-gray-500 focus:bg-gray-700' : 'bg-gray-100 text-gray-800 placeholder-gray-400 focus:bg-gray-200'
                }`}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 rounded-r-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm hover:shadow-lg transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-8 pt-6 text-center border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2026 ATS Resume Optimizer.
            
             <span className="text-primary-500 font-medium">All Rights Reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;