// server.js

import cookieParser from 'cookie-parser'; // 1. Add this import
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from "./config/db.js";

import analyticsRoutes from "./routes/analytics.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import cropRoutes from "./routes/crop.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import qaRoutes from "./routes/qa.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true               // allow cookies if needed
}));

const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows us to accept json data in the req.body.
app.use(cookieParser()); // 2. Add this middleware after express.json()

app.use("/api/farms", farmRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tasks", taskRoutes);

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', port: PORT });
});

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+PORT);
    // Try to connect to database, but don't fail if it doesn't work
    connectDB().catch(err => {
        console.log('Database connection failed, but server is still running');
    });
});