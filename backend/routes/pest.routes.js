import express from "express";
import multer from "multer";
import { analyzePest, saveDetection, getDetections } from "../controllers/pest.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// AI Analysis Route
router.post("/pest-analyze", upload.single("image"), analyzePest);

// Save detection result in database
router.post("/detections", upload.single("image"), saveDetection);

// Fetch detection history
router.get("/detections", getDetections);

export default router;
