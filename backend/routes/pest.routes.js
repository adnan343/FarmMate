import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { analyzePest, getDetections, saveDetection, clearDetections } from "../controllers/pest.controller.js";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

const router = express.Router();

// Configure multer to save files to the correct uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

const upload = multer({ dest: uploadsDir });

// AI Analysis Route — farmer only
router.post("/pest-analyze", auth, requireRole('farmer'), upload.single("image"), analyzePest);

// Save detection result in database (farmer only)
router.post("/detections", auth, requireRole('farmer'), upload.single("image"), saveDetection);

// Fetch detection history (farmer or admin)
router.get("/detections", auth, requireRole('farmer', 'admin'), getDetections);

// Clear all detection history (farmer only)
router.delete("/detections", auth, requireRole('farmer'), clearDetections);

export default router;
