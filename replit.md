# BRIGADA NEWS FM - Radio Streaming Platform

## Overview

BRIGADA NEWS FM is a Filipino news radio streaming web application. The platform provides live radio broadcasting with an interactive web player, program schedule, news sections, and contact functionality. The application is designed to deliver real-time news and information to listeners through a modern, user-friendly web interface with Filipino (Tagalog) language support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology**: Single-page application (SPA) using vanilla JavaScript with DOM manipulation.

**Key Components**:
- **Audio Streaming**: HTML5 `<audio>` element for radio stream playback with error handling
- **State Management**: Client-side JavaScript variables tracking player state (play/pause, volume)
- **UI Components**: 
  - Hero section with live radio player
  - Breaking news ticker with auto-rotation
  - News grid with featured articles
  - Program schedule with time-based highlighting
  - About section with statistics
  - Contact form
  - Footer with social links
- **Navigation**: Smooth scroll navigation with active link highlighting
- **Styling**: CSS3 with custom properties (CSS variables) for theming
- **Animations**: Entrance animations using Intersection Observer API

**Design Rationale**: 
- Vanilla JavaScript chosen for simplicity and zero client-side dependencies
- Lightweight architecture ensures fast load times for radio streaming
- Responsive design supports mobile and desktop listeners
- Error handling with user-visible notifications for stream failures

### Backend Architecture

**Technology**: Express.js web server serving static files.

**Key Components**:
- **Web Server**: Express.js v4.18.2
- **Static File Serving**: All frontend assets (HTML, CSS, JS) served directly
- **Port Configuration**: Environment-aware port binding (PORT env variable with 5000 fallback)
- **Error Handling**: Port conflict detection and retry mechanism
- **Cache Control**: Aggressive no-cache headers for real-time content delivery

**Design Rationale**:
- Express chosen for its simplicity and minimal overhead
- Static file serving eliminates need for complex build processes
- No database or authentication layer required for current scope
- Server-side logic kept minimal to focus on reliable streaming delivery

### Audio Streaming Implementation

**Technology**: HTML5 Audio API with streaming source

**Key Features**:
- Live audio stream integration via `<audio>` element
- Play/pause controls with state synchronization
- Volume control with real-time adjustment
- Error handling with automatic UI state reset
- User-visible notifications for connection failures
- Stream error recovery mechanism

**Stream Source**: Configurable streaming URL (currently set to radio.co demo stream)

### Data Architecture

**Current Implementation**:
- Program schedule stored as JavaScript array of objects
- News articles hardcoded in HTML
- Breaking news ticker with rotating messages
- Time-based program highlighting

**Future Considerations**:
- Content management could be migrated to a database (PostgreSQL) for dynamic updates
- API layer could be added for CRUD operations on programs and news content
- Real-time listener count integration

### Caching Strategy

**Implementation**: Aggressive no-cache headers set on all responses.

```javascript
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

**Rationale**: Live radio content requires real-time accuracy; caching could serve stale program information.

## External Dependencies

### Runtime Dependencies

**Express.js (v4.18.2)**
- **Purpose**: Web server framework
- **Usage**: Static file serving, HTTP server creation
- **Rationale**: Industry-standard, minimal, and well-documented

### Frontend Dependencies

**Google Fonts (Poppins)**
- **Purpose**: Typography
- **Usage**: Primary font family across the application
- **CDN**: fonts.googleapis.com

**Unsplash Images**
- **Purpose**: News article placeholder images
- **Usage**: Visual content for news cards
- **CDN**: images.unsplash.com

### Development Environment

**Node.js Runtime**
- **Version**: Node.js 20
- **Purpose**: Execute Express.js server
- **Package Manager**: npm

### Localization

**Language**: Filipino (Tagalog)
- HTML lang attribute set to "tl"
- Content presented in Filipino with some English technical terms
- Target audience: Filipino radio listeners

## Features

### Live Radio Player
- Play/pause controls with visual feedback
- Volume slider with real-time adjustment
- Current program and host display
- Live listener count (simulated)
- FM frequency display (99.5)
- Error notifications for stream failures

### Breaking News Ticker
- Auto-rotating news headlines
- Smooth scrolling animation
- Updates every 10 seconds

### News Section
- Grid layout with featured article
- Category badges
- Placeholder images from Unsplash
- Timestamps for each article
- Author attribution

### Program Schedule
- Time-based program listing
- Active program highlighting
- Host information
- Program descriptions

### About Section
- Station information
- Statistics display (24/7 broadcast, listeners, years, journalists)
- Hover animations

### Contact Section
- Contact information (phone, email, address, frequency)
- Contact form with validation
- Form submission handling

### Navigation
- Sticky header
- Smooth scroll navigation
- Active section highlighting
- Responsive mobile menu

## Recent Changes

**November 6, 2025**
- Created complete radio station website for BRIGADA NEWS FM
- Implemented HTML5 audio streaming with error handling
- Added comprehensive CSS styling with animations
- Created JavaScript for interactive features
- Set up Express.js server with cache control
- Configured workflow for automatic server restart on port 5000
- Added user-visible error notifications for stream failures
- Implemented proper state management for audio playback

## Potential Future Integrations

- **Actual Radio Stream**: Replace demo stream URL with real BRIGADA NEWS FM stream
- **CMS Integration**: PostgreSQL database with admin panel for content management
- **Analytics**: Google Analytics or custom analytics for listener metrics
- **Real-time Features**: WebSocket integration for live listener count and chat
- **Email Service**: SendGrid or Nodemailer for contact form submissions
- **Social Media**: Integration with Facebook, Twitter for news sharing
- **Mobile App**: React Native or PWA conversion for mobile platforms
- **Podcast Archive**: Audio storage and playback for past broadcasts
