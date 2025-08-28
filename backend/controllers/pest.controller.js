import axios from "axios";
import fs from "fs";
import { API_CONFIG } from "../config/api.js";
import { Detection } from "../models/detection.js";

// 1. Analyze Image
export const analyzePest = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    if (!API_CONFIG.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in configuration");
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_CONFIG.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: "Analyze this image for pest detection. Format: **1. Detected Pest:** ... **2. Remedies:** ... **3. Suggested Treatment:** ..." },
              { inline_data: { mime_type: "image/jpeg", data: base64Image } }
            ]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    fs.unlinkSync(imagePath); // Remove local file after upload
    res.json(response.data);
  } catch (error) {
    console.error("AI Analysis Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI analysis failed" });
  }
};

// 2. Save Detection to MongoDB
export const saveDetection = async (req, res) => {
  try {
    const { pest, remedies, treatment } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      console.log("No file uploaded for detection");
      return res.status(400).json({ error: "No image file provided" });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    console.log("Saving detection with image path:", imagePath);

    const detection = new Detection({
      user: req.user._id, // Associate with authenticated user
      pest,
      remedies: JSON.parse(remedies || "[]"),
      treatment,
      image: imagePath
    });

    const savedDetection = await detection.save();
    console.log("Detection saved successfully:", savedDetection._id);
    res.json(savedDetection);
  } catch (err) {
    console.error("Save Detection Error:", err);
    res.status(500).json({ error: "Failed to save detection" });
  }
};

// 3. Get User's Detections Only
export const getDetections = async (req, res) => {
  try {
    const detections = await Detection.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log(`Found ${detections.length} detections for user ${req.user._id}`);
    res.json(detections);
  } catch (err) {
    console.error("Fetch Detections Error:", err);
    res.status(500).json({ error: "Failed to fetch detections" });
  }
};