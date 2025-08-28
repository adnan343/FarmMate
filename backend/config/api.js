// API Configuration
export const API_CONFIG = {
  // Gemini API Key - Replace with your actual key from https://makersuite.google.com/app/apikey
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyBnpvLKGdvevusd3OxqJBcRMiYYtov7iWA",
  
  // Add other API configurations here as needed
};

// Validate required API keys
export const validateApiKeys = () => {
  if (!API_CONFIG.GEMINI_API_KEY || API_CONFIG.GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.warn("⚠️  WARNING: GEMINI_API_KEY not properly configured!");
    console.warn("   Please set GEMINI_API_KEY in your .env file or environment variables");
    console.warn("   Get your API key from: https://makersuite.google.com/app/apikey");
  }
};
