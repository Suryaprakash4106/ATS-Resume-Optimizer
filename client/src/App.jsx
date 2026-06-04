import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSScore from './pages/ATSScore';
import AdminPanel from './pages/AdminPanel';
import History from './pages/History';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Background3D />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#1f2937' : '#fff',
              color: darkMode ? '#fff' : '#333',
              borderRadius: '12px',
            },
          }}
        />
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
        
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} isAuthenticated={isAuthenticated} />} />
            <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} darkMode={darkMode} /> : <Navigate to="/login" />} />
            <Route path="/resume-builder" element={isAuthenticated ? <ResumeBuilder user={user} darkMode={darkMode} /> : <Navigate to="/login" />} />
            <Route path="/ats-score" element={isAuthenticated ? <ATSScore user={user} darkMode={darkMode} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel darkMode={darkMode} /> : <Navigate to="/" />} />
            <Route path="/history" element={isAuthenticated ? <History darkMode={darkMode} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;