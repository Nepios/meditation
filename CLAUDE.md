# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start application**: `node index.js` or `npm start` (starts on port 3000 or PORT env var)
- **Deploy**: Uses Heroku with `web: node index.js` (see Procfile)

## Architecture Overview

This is a full-stack meditation app built with the MEAN stack (MongoDB, Express, AngularJS, Node.js) that provides guided meditations and a meditation timer.

### Backend Structure (Node.js/Express)
- **Entry point**: `index.js` - Express server with JWT authentication
- **Models**: 
  - `models/meditation.js` - Meditation schema (title, description, audiofile, link, author, duration, emotion)
  - `models/user.js` - User schema with bcrypt password hashing
- **Controllers**:
  - `controllers/meditations.js` - CRUD operations and AWS S3 file uploads
  - `controllers/users.js` - User management
- **Authentication**: JWT tokens with express-jwt middleware, secret stored as hardcoded string

### Frontend Structure (AngularJS)
- **Main app**: `public/app/app.js` - UI Router configuration and SCE whitelist for AWS S3
- **Controllers**: `public/app/controllers.js` - HomeCtrl, NewCtrl, ShowCtrl, NavCtrl, etc.
- **Services**: `public/app/services.js` - API factories and Auth service using localStorage
- **Views**: `public/app/views/` - HTML templates for each route
- **Static files**: `public/` serves static assets and `index.html`

### Key Features
- **Meditation Library**: Meditations categorized by emotion (numeric emotion field)
- **AWS S3 Integration**: Audio files uploaded to S3, URLs stored in MongoDB
- **Timer Feature**: Self-guided meditation countdown timer (5-minute increments)
- **Authentication**: User signup/login with JWT tokens
- **Mood-based Filtering**: Route `/meditations/mood/:id` filters meditations by emotion

### Database
- **MongoDB**: Uses Mongoose ODM
- **Connection**: Environment variable `MONGO` for production, localhost fallback commented out
- **AWS S3**: Audio files stored in `meditationappstorage` bucket due to MongoDB 16MB limit

### Environment Variables Required
- `MONGO` - MongoDB connection string
- `AWS_ACCESS_KEY_ID` - AWS access key for S3
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3
- `PORT` - Server port (defaults to 3000)

### Routing
- Frontend uses AngularJS UI-Router with HTML5 mode
- Backend serves `public/index.html` for all non-API routes
- API routes: `/api/meditations` and `/api/users`