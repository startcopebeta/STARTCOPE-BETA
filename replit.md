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
- **Earnings System**: ₱2.00 per view (PHP)
- **GCash Withdrawal System**:
  - GCash number validation (09XXXXXXXXX format)
  - Withdrawal request tracking
  - Ready for PayMongo integration for real money transfers
  - No withdrawal limits (up to available balance)
- **Admin Dashboard**: 
  - Total views counter
  - Total earnings display in PHP
  - GCash withdrawal form with number validation
  - View history (last 50 visitors)
  - Withdrawal history with GCash numbers
- **Real-time Updates**: Dashboard updates every 5 seconds
- **Secure Admin Access**: Password-protected admin area (password: 091211)

## API Endpoints
- `POST /api/track-view` - Track a new view
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get admin statistics (requires authentication)
- `POST /api/admin/withdraw` - Process withdrawal (requires authentication)
- `GET /api/stats` - Public stats endpoint

## Recent Changes
- **2025-10-31**: GCash Integration Update
  - ✅ Added GCash number field to withdrawal form
  - ✅ GCash number validation (09XXXXXXXXX format)
  - ✅ Updated withdrawal tracking to store GCash numbers
  - ✅ Changed currency display to PHP (₱)
  - ✅ Created PayMongo integration guide (GCASH_SETUP_GUIDE.md)
  - ✅ Ready for real money transfers with PayMongo API

- **2025-10-31**: Initial setup
  - Created Node.js/Express backend
  - Implemented view tracking system
  - Built admin dashboard with earnings (₱2 per view)
  - Added withdrawal system with no limits
  - Configured for Replit deployment

## Configuration
- **Port**: 5000
- **Admin Password**: 091211
- **Earnings Per View**: ₱2.00 (PHP)
- **Data Storage**: JSON file (`data.json`)
- **GCash Integration**: See `GCASH_SETUP_GUIDE.md` for PayMongo setup

## Running the Application
The application runs automatically via the configured workflow. To manually start:
```bash
npm start
```

## Deployment
Configured for Replit autoscale deployment with Node.js.
