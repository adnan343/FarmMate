// services/gemini.js
import fetch from "node-fetch";

// Use a currently supported multimodal model name
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const GEMINI_API_KEY = "AIzaSyBnpvLKGdvevusd3OxqJBcRMiYYtov7iWA";

export async function analyzePestWithGemini(imageBuffer) {
  try {
    const base64Image = imageBuffer.toString("base64");
    
    // ... rest of your code ...
    // ... remains the same as it correctly formats the JSON payload ...
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Identify the pest in this image and give me answer in 3 parts like detected pest, Remedies, Suggested Treatment" },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Gemini API error: ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw error;
  }
}