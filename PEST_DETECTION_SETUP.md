# Pest Detection Feature Setup Guide

## Overview

The pest detection feature has been completely redesigned with improved security, modern UI, and proper API key management.

## Key Changes Made

### 1. Security Fixes

- **User Isolation**: Each farmer now only sees their own pest detection history
- **Authentication Required**: All pest detection endpoints now require user authentication
- **User Association**: Detections are now linked to specific users in the database

### 2. API Key Management

- **Environment Variables**: Gemini API key is now managed through environment variables
- **Configuration File**: Created `backend/config/api.js` for centralized API configuration
- **Validation**: Server validates API keys on startup

### 3. UI Redesign

- **Modern Design**: Complete UI overhaul with gradient backgrounds and modern components
- **Better UX**: Improved user experience with loading states, error handling, and visual feedback
- **Responsive Layout**: Mobile-friendly design with proper spacing and typography
- **Enhanced History**: Better detection history display with images and remedies

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `backend` directory with your Gemini API key:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Server Configuration
PORT=5000
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### 3. Database Migration

The Detection model has been updated to include user association. If you have existing data, you may need to migrate it or start fresh.

### 4. Start the Application

```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm run dev
```

## Features

### For Farmers

- **Upload Images**: Drag and drop or click to upload crop images
- **AI Analysis**: Automatic pest detection using Google's Gemini AI
- **Treatment Recommendations**: Get detailed remedies and treatment plans
- **Personal History**: View only your own detection history
- **Image Storage**: Images are saved and displayed in history

### Security Features

- **User Authentication**: All endpoints require valid user session
- **Data Isolation**: Users can only access their own detections
- **Secure API Keys**: API keys are managed through environment variables

## API Endpoints

### POST `/api/pest-analyze`

- Analyzes uploaded image for pest detection
- Returns AI analysis results
- **No authentication required** (for analysis only)

### POST `/api/detections`

- Saves detection results to database
- **Requires authentication**
- Associates detection with current user

### GET `/api/detections`

- Retrieves user's detection history
- **Requires authentication**
- Returns only current user's detections

## Troubleshooting

### API Key Issues

If you see warnings about API key configuration:

1. Check that your `.env` file exists in the `backend` directory
2. Verify the `GEMINI_API_KEY` is set correctly
3. Restart the backend server

### Authentication Issues

If pest detection history is not loading:

1. Ensure you're logged in as a farmer
2. Check that cookies are enabled
3. Verify the backend is running on the correct port

### Image Upload Issues

- Maximum file size: 5MB
- Supported formats: JPEG, PNG, GIF, etc.
- Ensure the uploads directory has write permissions

## File Structure

```
backend/
├── config/
│   └── api.js              # API configuration
├── controllers/
│   └── pest.controller.js  # Updated with user association
├── models/
│   └── detection.js        # Updated with user field
├── routes/
│   └── pest.routes.js      # Updated with auth middleware
└── .env                    # Environment variables (create this)

frontend/
└── app/dashboard/farmer/pest-detection/
    └── page.js             # Completely redesigned UI
```
