import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, FiFileText, FiBarChart2, FiShield, 
  FiZap, FiUsers, FiAward, FiClock, FiArrowRight 
} from 'react-icons/fi';

const Home = ({ darkMode, isAuthenticated }) => {
  const features = [
    { icon: <FiFileText className="text-3xl" />, title: 'Resume Builder', desc: 'Create professional ATS-friendly resumes with our intelligent builder.', color: 'from-blue-500 to-cyan-500' },
    { icon: <FiBarChart2 className="text-3xl" />, title: 'ATS Score', desc: 'Get real-time ATS compatibility score and improvement suggestions.', color: 'from-purple-500 to-pink-500' },
    { icon: <FiZap className="text-3xl" />, title: 'AI Optimization', desc: 'AI-powered keyword optimization for better job matching.', color: 'from-green-500 to-emerald-500' },
    { icon: <FiShield className="text-3xl" />, title: 'Privacy First', desc: 'Your data is secure and never shared with third parties.', color: 'from-orange-500 to-red-500' },
  ];

  const stats = [
    { value: '50K+', label: 'Users', icon: <FiUsers /> },
    { value: '95%', label: 'Success Rate', icon: <FiTrendingUp /> },
    { value: '10K+', label: 'Resumes Optimized', icon: <FiAward /> },
    { value: '24/7', label: 'Support', icon: <FiClock /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                darkMode ? 'bg-primary-500/20 text-primary-300' : 'bg-primary-100 text-primary-700'
              }`}>
                🚀 AI-Powered Resume Optimization
              </span>
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Beat the ATS Bots &{' '}
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  Land Your Dream Job
                </span>
              </h1>
              <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our AI-powered platform helps you create, optimize, and score your resume against any job description. 
                Get past automated screening systems and into real human hands.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg shadow-lg shadow-primary-500/25"
                      >
                        Get Started Free
                      </motion.button>
                    </Link>
                    <Link to="/login">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                          darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        Login
                      </motion.button>
                    </Link>
                  </>
                ) : (
                  <Link to="/resume-builder">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg shadow-lg shadow-primary-500/25 flex items-center gap-2 mx-auto"
                    >
                      Build Your Resume <FiArrowRight />
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl transition-all duration-300 zoom-on-hover border-animate ${
                  darkMode ? 'glass-dark' : 'glass bg-white/50'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white mb-4`}>
                  {stat.icon}
                </div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Powerful Features to{' '}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Supercharge Your Job Search
              </span>
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to create a winning resume that passes any ATS system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`group p-6 rounded-2xl transition-all duration-500 cursor-pointer zoom-on-hover ${
                  darkMode ? 'glass-dark hover:bg-white/10' : 'glass bg-white/50 hover:bg-white/70'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden rounded-3xl p-12 text-center ${
              darkMode ? 'glass-dark' : 'glass bg-white/50'
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-3xl" />
            
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Boost Your ATS Score?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of job seekers who have successfully landed interviews using our platform
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg shadow-lg shadow-primary-500/25"
                >
                  Start Optimizing Now
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;