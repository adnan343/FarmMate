// API Configuration utility
export const getApiBaseUrl = () => {
  // Use the explicit full API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) return apiUrl.replace(/\/$/, '');

  // Fallback for development
  return 'http://localhost:5000';
};

export const getApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}/api${endpoint}`;
};

export const getErrorMessage = () => {
  const base = getApiBaseUrl();
  return `Unable to connect to server. Please make sure the backend server is running on ${base}`;
};