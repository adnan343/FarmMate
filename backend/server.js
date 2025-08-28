// server.js

import cookieParser from 'cookie-parser'; // 1. Add this import
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateApiKeys } from "./config/api.js";
import { connectDB } from "./config/db.js";
import pestRoutes from "./routes/pest.routes.js";

import analyticsRoutes from "./routes/analytics.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import cropRoutes from "./routes/crop.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import farmConditionRoutes from "./routes/farmCondition.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import qaRoutes from "./routes/qa.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();

// CORS configuration to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://farmmate-frontend.vercel.app',
  'https://farmmate-git-main-yourusername.vercel.app',
  'https://farmmate.vercel.app',
  'https://farmmate-production.vercel.app',
  'https://farmmate-frontend-production.vercel.app',
  // Add your actual frontend deployment URL here
  "https://farm-mate-indol.vercel.app/"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.log('Blocked origin:', origin);
            callback(null, true); // Temporarily allow all origins for debugging
        }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows us to accept json data in the req.body.
app.use(cookieParser()); // 2. Add this middleware after express.json()

// Serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/farms", farmRoutes);
app.use("/api/crops", cropRoutes);

app.use("/api/farm-conditions", farmConditionRoutes);


app.use("/api/users", userRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", pestRoutes);


// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', port: PORT });
});

// Test endpoint to check uploads directory
app.get('/api/test-uploads', (req, res) => {
    const fs = require('fs');
    const uploadsPath = path.join(__dirname, '../uploads');
    
    try {
        const files = fs.readdirSync(uploadsPath);
        res.json({ 
            message: 'Uploads directory accessible',
            path: uploadsPath,
            fileCount: files.length,
            files: files.slice(0, 5) // Show first 5 files
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Cannot access uploads directory',
            message: error.message,
            path: uploadsPath
        });
    }
});

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+PORT);
    console.log('Static files served from: /uploads');
    
    // Validate API keys on startup
    validateApiKeys();
    
    // Try to connect to database, but don't fail if it doesn't work
    connectDB().catch(err => {
        console.log('Database connection failed, but server is still running');
    });
});