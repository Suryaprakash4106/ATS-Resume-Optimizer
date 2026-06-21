// config.js
// API URL configuration - switches between production and development

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Optional: Other configuration variables
export const APP_NAME = 'ATS Resume Optimizer';
export const APP_VERSION = '1.0.0';

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};