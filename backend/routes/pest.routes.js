import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { analyzePest, getDetections, saveDetection } from "../controllers/pest.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Configure multer to save files to the correct uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

const upload = multer({ dest: uploadsDir });

// AI Analysis Route
router.post("/pest-analyze", upload.single("image"), analyzePest);

// Save detection result in database (requires authentication)
router.post("/detections", auth, upload.single("image"), saveDetection);

// Fetch detection history (requires authentication)
router.get("/detections", auth, getDetections);

export default router;
