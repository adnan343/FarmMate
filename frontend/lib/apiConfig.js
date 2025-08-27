// API Configuration utility
export const getApiBaseUrl = () => {
  // Prefer an explicit base URL if provided
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicitBase) return explicitBase.replace(/\/$/, '');

  // Fallback to hostname + port for local/dev usage
  const port = process.env.NEXT_PUBLIC_API_PORT || process.env.PORT || 5000;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:${port}`;
  }
  // Node/server-side fallback
  return `http://localhost:${port}`;
};

export const getApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}/api${endpoint}`;
};

export const getErrorMessage = () => {
  const base = getApiBaseUrl();
  return `Unable to connect to server. Please make sure the backend server is running on ${base}`;
};
