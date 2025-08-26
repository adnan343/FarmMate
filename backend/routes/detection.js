import express from "express";
import multer from "multer";
import Detection from "../models/detection.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Serve uploaded images as static files
router.use("/uploads", express.static(UPLOAD_DIR));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// POST detection with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { pest, remedies, treatment } = req.body;

    let remediesArray = [];
    if (remedies) {
      try {
        remediesArray = JSON.parse(remedies);
      } catch (err) {
        remediesArray = [];
      }
    }

    // Save image path (relative URL for frontend access)
    const imagePath = req.file ? `/api/detections/uploads/${req.file.filename}` : null;

    const newDetection = new Detection({
      pest,
      remedies: remediesArray,
      treatment,
      image: imagePath
    });

    const saved = await newDetection.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Failed to save detection:", error);
    res.status(500).json({ message: "Failed to save detection" });
  }
});

// GET all detections
router.get("/", async (req, res) => {
  try {
    const detections = await Detection.find().sort({ createdAt: -1 });
    res.json(detections);
  } catch (error) {
    console.error("Failed to fetch detection history:", error);
    res.status(500).json({ message: "Failed to fetch detection history" });
  }
});

export default router;
