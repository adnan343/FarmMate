import OpenAI from "openai";
import fs from "fs";
import { Detection } from "../models/detection.js";
import { generateTaskFromPestDetection } from "../services/taskGenerator.js";
import { logAudit } from "./auditLog.controller.js";

const OPENROUTER_MODEL = "anthropic/claude-3-haiku";

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not found in environment");
  return new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
}

// 1. Analyze Image
export const analyzePest = async (req, res) => {
  const imagePath = req.file?.path;

  try {
    if (!imagePath) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not found in configuration");
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    const client = getOpenRouterClient();
    const response = await client.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image for pest detection. You MUST respond with a strict JSON object only. Do not include any markdown formatting (such as ```json), explanations, or text outside the JSON object. The JSON structure MUST be precisely:\n{\n  \"detectedPest\": \"\",\n  \"confidence\": \"\",\n  \"treatment\": \"\",\n  \"remedies\": []\n}"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
    });

    // Return in a format the frontend expects: { candidates: [{ content: { parts: [{ text }] } }] }
    const text = response.choices[0]?.message?.content || "No analysis returned.";
    console.log("=== RAW AI RESPONSE BEFORE PARSING ===");
    console.log(text);
    console.log("======================================");

    // Try to parse the AI response into a structured format
    let parsed = null;
    try {
      let cleaned = text;
      // Remove code fencing
      if (cleaned.includes('```')) {
        cleaned = cleaned.replace(/```[a-z]*\n?/gi, '').replace(/\n?```/g, '');
      }
      cleaned = cleaned.trim();
      // Try to extract JSON object
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      console.log("Could not parse pest detection response:", parseErr.message);
    }

    // Ensure structured response with fallback defaults
    const result = {
      detectedPest: parsed?.detectedPest || parsed?.pest || "Unknown pest",
      confidence: parsed?.confidence || "Low",
      treatment: parsed?.treatment || "Apply recommended pesticide treatment or consult local agricultural extension",
      remedies: Array.isArray(parsed?.remedies) ? parsed.remedies : ["Inspect affected areas", "Apply organic pesticide", "Consult agricultural expert"],
    };

    // Audit log
    logAudit({
      action: 'pest_detected',
      performedBy: req.user._id,
      targetType: 'pest_detection',
      targetId: null,
      details: { pest: result.detectedPest, confidence: result.confidence },
    });

    res.json({
      candidates: [{ content: { parts: [{ text: JSON.stringify(result) }] } }],
      data: result
    });
  } catch (error) {
    console.error("AI Analysis Error:", error.message || error);
    res.status(500).json({ error: "AI analysis failed" });
  } finally {
    if (imagePath && fs.existsSync(imagePath)) {
      try { fs.unlinkSync(imagePath); } catch (cleanupErr) {
        console.error("Failed to clean up temp file:", cleanupErr.message);
      }
    }
  }
};

// 2. Save Detection to MongoDB
export const saveDetection = async (req, res) => {
  try {
    const { pest, remedies, treatment } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    const detection = new Detection({
      user: req.user._id,
      pest,
      remedies: JSON.parse(remedies || "[]"),
      treatment,
      image: imagePath
    });
    const savedDetection = await detection.save();

    // Auto-generate task from pest detection (non-blocking)
    try {
      await generateTaskFromPestDetection(
        { pest, remedies: JSON.parse(remedies || "[]"), treatment },
        req.user._id,
        req.body.farmId || null
      );
      console.log('Task auto-generated from pest detection');
    } catch (taskErr) {
      console.error('Task generation from pest detection failed (non-critical):', taskErr.message);
    }

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
    res.json(detections);
  } catch (err) {
    console.error("Fetch Detections Error:", err);
    res.status(500).json({ error: "Failed to fetch detections" });
  }
};

// 4. Clear All Detections for User
export const clearDetections = async (req, res) => {
  try {
    await Detection.deleteMany({ user: req.user._id });
    res.json({ message: "Detection history cleared successfully" });
  } catch (err) {
    console.error("Clear Detections Error:", err);
    res.status(500).json({ error: "Failed to clear detection history" });
  }
};
