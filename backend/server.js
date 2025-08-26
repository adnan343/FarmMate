import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

import cartRoutes from "./routes/cart.routes.js";
import cropRoutes from "./routes/crop.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import qaRoutes from "./routes/qa.routes.js";
import userRoute from "./routes/user.route.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import pestAnalyzeRoutes from "./routes/pestAnalyze.routes.js";
import detectionRoutes from "./routes/detection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use(cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true
}));

// Allow JSON requests
app.use(express.json());

// --------------------------
// Serve uploaded images
// --------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------------
// API routes
// --------------------------
app.use("/api/farms", farmRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pest-analyze", pestAnalyzeRoutes);
app.use("/api/detections", detectionRoutes); // FIXED: Explicit route for detections

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running", port: PORT });
});

// Start server and connect DB
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    try {
        await connectDB();
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed, but server is still running");
    }
});
