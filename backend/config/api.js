// config/api.js
// NOTE: This file's API_CONFIG object is populated lazily via getter function
// to avoid the issue where dotenv.config() hasn't been called yet at import time.

export const getOpenRouterApiKey = () => {
  return process.env.OPENROUTER_API_KEY || '';
};

export const getApiConfig = () => ({
  OPENROUTER_API_KEY: getOpenRouterApiKey(),
  OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",
  DEFAULT_MODEL: "anthropic/claude-3-haiku",
  VISION_MODEL: "anthropic/claude-3-haiku",
});

export const validateApiKeys = () => {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.warn("⚠️  WARNING: OPENROUTER_API_KEY not properly configured!");
    console.warn("   Please set OPENROUTER_API_KEY in your .env file or environment variables");
    console.warn("   Get your API key from: https://openrouter.ai/keys");
  } else {
    console.log("✅ OPENROUTER_API_KEY is configured");
  }
};