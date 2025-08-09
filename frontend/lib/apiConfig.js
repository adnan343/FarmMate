// API Configuration utility
export const getApiBaseUrl = () => {
  // For client-side, we need to use NEXT_PUBLIC_ prefix
  const port = process.env.NEXT_PUBLIC_API_PORT || process.env.PORT || 5000;
  return `http://localhost:${port}`;
};

export const getApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}/api${endpoint}`;
};

export const getErrorMessage = () => {
  const port = process.env.NEXT_PUBLIC_API_PORT || process.env.PORT || 5000;
  return `Unable to connect to server. Please make sure the backend server is running on http://localhost:${port}`;
};
