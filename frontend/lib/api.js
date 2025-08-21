import { getApiUrl, getErrorMessage } from './apiConfig';

const API_BASE = getApiUrl('/users');
const FARM_API_BASE = getApiUrl('/farms');
const PRODUCT_API_BASE = getApiUrl('/products');
const CROP_API_BASE = getApiUrl('/crops');
const ANALYTICS_API_BASE = getApiUrl('/analytics');
const TASKS_API_BASE = getApiUrl('/tasks');

export async function registerUser(data) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      throw new Error(responseData.msg || 'Registration failed');
    }
    
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function loginUser(data) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Login failed');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('User not found');
    return res.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Fetch all users
export async function fetchAllUsers() {
  try {
    const res = await fetch(`${API_BASE}`);
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Farm API functions
export async function getFarmByOwner(ownerId) {
  try {
    const res = await fetch(`${FARM_API_BASE}/owner/${ownerId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to fetch farm data');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getFarmById(farmId) {
  try {
    const res = await fetch(`${FARM_API_BASE}/${farmId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to fetch farm data');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Update user role (admin function)
export async function updateUserRole(userId, newRole) {
  try {
    const res = await fetch(`${API_BASE}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to update user role');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function updateFarm(farmId, farmData) {
  try {
    const res = await fetch(`${FARM_API_BASE}/${farmId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmData),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to update farm');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function createFarm(farmData) {
  try {
    const res = await fetch(`${FARM_API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmData),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to create farm');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Delete user (admin function)
export async function deleteUserById(userId) {
  try {
    const res = await fetch(`${API_BASE}/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to delete user');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Product API functions
export async function getMarketplaceProducts(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const res = await fetch(`${PRODUCT_API_BASE}/marketplace?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to fetch marketplace products');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getHarvestedProductsByFarmer(farmerId) {
  try {
    const res = await fetch(`${PRODUCT_API_BASE}/farmer/${farmerId}/harvested`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to fetch harvested products');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getMarketplaceProductsByFarmer(farmerId) {
  try {
    const res = await fetch(`${PRODUCT_API_BASE}/farmer/${farmerId}/marketplace`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to fetch marketplace products');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function createHarvestedProduct(productData) {
  try {
    const res = await fetch(`${PRODUCT_API_BASE}/harvested`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to create harvested product');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function addToMarketplace(productId, marketplaceData) {
  try {
    const res = await fetch(`${PRODUCT_API_BASE}/${productId}/marketplace`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(marketplaceData),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to add product to marketplace');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function removeFromMarketplace(productId) {
  try {
    const res = await fetch(`${PRODUCT_API_BASE}/${productId}/remove-marketplace`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to remove product from marketplace');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getProductById(productId) {
  try {
    const res = await fetch(`${PRODUCT_API_BASE}/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to fetch product');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Client-side logout function
export function logout() {
  // Clear all user-related cookies by setting them to expire in the past
  document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Clear any other auth-related cookies
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Redirect to login page
  window.location.href = '/login';
}

// Crop API functions
export async function getCropSuggestions(farmId) {
  try {
    const res = await fetch(`${CROP_API_BASE}/suggest/${farmId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to get crop suggestions');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getStoredCropSuggestions(farmId) {
  try {
    const res = await fetch(`${CROP_API_BASE}/suggestions/${farmId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to get stored crop suggestions');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function refreshCropSuggestions(farmId) {
  try {
    const res = await fetch(`${CROP_API_BASE}/suggestions/${farmId}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to refresh crop suggestions');
    }

    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Analytics API
export async function getYieldAnalytics(farmerId) {
  try {
    const res = await fetch(`${ANALYTICS_API_BASE}/yield/${farmerId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const responseData = await res.json();
    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to fetch yield analytics');
    }
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

// Timeline and suggestion acceptance APIs
export async function generateCropTimeline(farmId, payload) {
  const res = await fetch(`${CROP_API_BASE}/timeline/${farmId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to generate timeline');
  return data;
}

export async function acceptSuggestionAndCreateCrop(farmId, payload) {
  const res = await fetch(`${CROP_API_BASE}/suggestions/${farmId}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create crop');
  return data;
}

export async function getCropTimeline(cropId) {
  const res = await fetch(`${CROP_API_BASE}/${cropId}/timeline`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch timeline');
  return data;
}

export async function addTimelineItem(cropId, item) {
  const res = await fetch(`${CROP_API_BASE}/${cropId}/timeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(item),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add timeline item');
  return data;
}

export async function updateTimelineItem(cropId, index, updates) {
  const res = await fetch(`${CROP_API_BASE}/${cropId}/timeline/${index}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update timeline item');
  return data;
}

export async function deleteTimelineItem(cropId, index) {
  const res = await fetch(`${CROP_API_BASE}/${cropId}/timeline/${index}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete timeline item');
  return data;
}

export async function generateTimelineForCrop(cropId) {
  const res = await fetch(`${CROP_API_BASE}/${cropId}/timeline/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to generate timeline for crop');
  return data;
}

// Server-side logout function (for API routes)
export function clearAuthCookies() {
  // This function should be used in API routes
  // The actual implementation depends on the framework being used
  return {
    clearCookies: () => {
      // Implementation for clearing cookies in server context
      return { message: 'Cookies cleared' };
    }
  };
}

// Task API functions
export async function createTask(task) {
  const res = await fetch(`${TASKS_API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(task),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create task');
  return data.data;
}

export async function getTasksByFarmer(farmerId) {
  const res = await fetch(`${TASKS_API_BASE}/farmer/${farmerId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
  return data.data;
}

export async function getTaskSummary(farmerId) {
  const res = await fetch(`${TASKS_API_BASE}/summary/${farmerId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch task summary');
  return data.data;
}

export async function getUpcomingTasks(farmerId) {
  const res = await fetch(`${TASKS_API_BASE}/upcoming/${farmerId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch upcoming tasks');
  return data.data;
}

export async function getCategoryProgressByFarmer(farmerId) {
  const res = await fetch(`${TASKS_API_BASE}/categories/${farmerId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch category progress');
  return data.data;
}

export async function updateTaskById(id, updates) {
  const res = await fetch(`${TASKS_API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update task');
  return data.data;
}

export async function deleteTaskById(id) {
  const res = await fetch(`${TASKS_API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete task');
  return data;
}

// Farm Condition API functions
const FARM_CONDITION_API = getApiUrl('/farm-conditions');

// Helper function to get auth headers (cookies are automatically sent)
function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

export async function createFarmCondition(reportData) {
  try {
    const res = await fetch(FARM_CONDITION_API, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(reportData),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to create farm condition report');
    }
    
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getFarmerFarmConditions(params = {}) {
  try {
    const queryParams = new URLSearchParams(params);
    const res = await fetch(`${FARM_CONDITION_API}?${queryParams}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch farm conditions');
    const data = await res.json();
    return data.data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getFarmCondition(reportId) {
  try {
    const res = await fetch(`${FARM_CONDITION_API}/${reportId}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch farm condition');
    const data = await res.json();
    return data.data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function updateFarmConditionStatus(reportId, status) {
  try {
    const res = await fetch(`${FARM_CONDITION_API}/${reportId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to update farm condition status');
    }
    
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function deleteFarmCondition(reportId) {
  try {
    const res = await fetch(`${FARM_CONDITION_API}/${reportId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
      throw new Error(responseData.msg || 'Failed to delete farm condition');
    }
    
    return responseData;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}

export async function getFarmConditionStats() {
  try {
    const res = await fetch(`${FARM_CONDITION_API}/stats`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch farm condition stats');
    const data = await res.json();
    return data.data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(getErrorMessage());
    }
    throw error;
  }
}



