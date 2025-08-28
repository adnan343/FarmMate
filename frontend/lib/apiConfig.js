// API Configuration utility
export const getApiBaseUrl = () => {
  // Prefer an explicit base URL if provided
  return process.env.BACKEND_SERVER||"https://farmmate-production.up.railway.app"
};

export const getApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}/api${endpoint}`;
};

export const getErrorMessage = () => {
  const base = getApiBaseUrl();
  return `Unable to connect to server. Please make sure the backend server is running on ${base}`;
};