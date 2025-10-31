# STARCOPE MAPS

## Overview
STARCOPE MAPS is an interactive star mapping web application with an admin dashboard that tracks visitor views and earnings. Every visit to the website is tracked and generates earnings for the admin.

## Project Structure
- `server.js` - Node.js/Express backend server with API endpoints
- `public/index.html` - Main landing page with automatic view tracking
- `public/admin-login.html` - Admin login page (password: 1989)
- `public/admin-dashboard.html` - Admin dashboard with earnings and withdrawal management
- `data.json` - JSON database storing views, withdrawals, and sessions

## Technology Stack
- **Backend**: Node.js with Express
- **Frontend**: Pure HTML, CSS, JavaScript
- **Database**: JSON file-based storage
- **Features**: Real-time view tracking, earnings calculation, withdrawal system

## Features
- **Automatic View Tracking**: Every visitor is automatically counted
- **Earnings System**: $2.00 per view
- **Admin Dashboard**: 
  - Total views counter
  - Total earnings display
  - Withdrawal system (no limit)
  - View history (last 50 visitors)
  - Withdrawal history
- **Real-time Updates**: Dashboard updates every 5 seconds
- **Secure Admin Access**: Password-protected admin area (password: 1989)

## API Endpoints
- `POST /api/track-view` - Track a new view
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get admin statistics (requires authentication)
- `POST /api/admin/withdraw` - Process withdrawal (requires authentication)
- `GET /api/stats` - Public stats endpoint

## Recent Changes
- **2025-10-31**: Initial setup
  - Created Node.js/Express backend
  - Implemented view tracking system
  - Built admin dashboard with earnings ($2 per view)
  - Added withdrawal system with no limits
  - Configured for Replit deployment

## Configuration
- **Port**: 5000
- **Admin Password**: 1989
- **Earnings Per View**: $2.00
- **Data Storage**: JSON file (`data.json`)

## Running the Application
The application runs automatically via the configured workflow. To manually start:
```bash
npm start
```

## Deployment
Configured for Replit autoscale deployment with Node.js.
