import fs from "fs";
import axios from "axios";
import { Detection } from "../models/detection.js";

// Direct Gemini API key
const GEMINI_API_KEY = "AIzaSyBnpvLKGdvevusd3OxqJBcRMiYYtov7iWA"; // Replace with your actual key

// 1. Analyze Image
export const analyzePest = async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
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
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const detection = new Detection({
      pest,
      remedies: JSON.parse(remedies || "[]"),
      treatment,
      image: imagePath
    });

    const savedDetection = await detection.save();
    res.json(savedDetection);
  } catch (err) {
    console.error("Save Detection Error:", err);
    res.status(500).json({ error: "Failed to save detection" });
  }
};

// 3. Get All Detections
export const getDetections = async (req, res) => {
  try {
    const detections = await Detection.find().sort({ createdAt: -1 });
    res.json(detections);
  } catch (err) {
    console.error("Fetch Detections Error:", err);
    res.status(500).json({ error: "Failed to fetch detections" });
  }
};