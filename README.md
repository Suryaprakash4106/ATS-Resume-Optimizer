# ATS Resume Website

An ATS (Applicant Tracking System) optimized resume website built with React and Node.js/Express.

## Project Structure

### `/client` - Frontend (React + Vite)
- **src/**
  - `components/` - Reusable React components
  - `pages/` - Page components
  - `App.jsx` - Main App component
  - `main.jsx` - Entry point
  - `index.css` - Global styles

### `/server` - Backend (Node.js + Express)
- **models/** - Database models
- **routes/** - API routes
- **middleware/** - Custom middleware
- **controllers/** - Request handlers
- **utils/** - Utility functions
- `server.js` - Server entry point
- `db.js` - Database configuration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` in the server folder
   - Update with your configuration

3. Run development servers:
   ```bash
   npm run dev
   ```

## Features
- ATS-optimized resume display
- Responsive design
- API backend for dynamic content
