import express from "express";
import multer from "multer";
import { analyzePestWithGemini } from "../services/gemini.js";

const router = express.Router();
const upload = multer(); // memory storage

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const result = await analyzePestWithGemini(imageBuffer);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

export default router;
