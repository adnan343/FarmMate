// API Configuration utility
export const getApiBaseUrl = () => {
  // Use Railway deployment URL as primary
  const railwayUrl = 'https://farmmate-production.up.railway.app';
  
  // Prefer an explicit base URL if provided (for development override)
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicitBase) return explicitBase.replace(/\/$/, '');

  // Return Railway URL as default
  return railwayUrl;
};

export const getApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}/api${endpoint}`;
};

export const getErrorMessage = () => {
  const base = getApiBaseUrl();
  return `Unable to connect to server. Please make sure the backend server is running on ${base}`;
};
