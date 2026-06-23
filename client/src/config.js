// Production backend URL (Railway) - hardcoded as primary since Netlify env var injection was unreliable
const PRODUCTION_API_URL = 'https://ats-resume-optimizer-production.up.railway.app';

export const API_URL = import.meta.env.VITE_API_URL || PRODUCTION_API_URL;

export const APP_NAME = 'ATS Resume Optimizer';
export const APP_VERSION = '1.0.0';

export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};