const API_BASE = 'http://localhost:5000/api/users';
const FARM_API_BASE = 'http://localhost:5000/api/farms';
const PRODUCT_API_BASE = 'http://localhost:5000/api/products';
const CROP_API_BASE = 'http://localhost:5000/api/crops';

export async function registerUser(data) {
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
}

export async function loginUser(data) {
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
}

export async function getUserById(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

// Farm API functions
export async function getFarmByOwner(ownerId) {
  const res = await fetch(`${FARM_API_BASE}/owner/${ownerId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const responseData = await res.json();
  
  if (!res.ok) {
    throw new Error(responseData.message || 'Failed to fetch farm data');
  }
  
  return responseData;
}

export async function getFarmById(farmId) {
  const res = await fetch(`${FARM_API_BASE}/${farmId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const responseData = await res.json();
  
  if (!res.ok) {
    throw new Error(responseData.message || 'Failed to fetch farm data');
  }
  
  return responseData;
}

export async function updateFarm(farmId, farmData) {
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
}

export async function createFarm(farmData) {
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
}

// Product API functions
export async function getMarketplaceProducts(filters = {}) {
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
}

export async function getHarvestedProductsByFarmer(farmerId) {
  const res = await fetch(`${PRODUCT_API_BASE}/farmer/${farmerId}/harvested`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const responseData = await res.json();
  
  if (!res.ok) {
    throw new Error(responseData.msg || 'Failed to fetch harvested products');
  }
  
  return responseData;
}

export async function getMarketplaceProductsByFarmer(farmerId) {
  const res = await fetch(`${PRODUCT_API_BASE}/farmer/${farmerId}/marketplace`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const responseData = await res.json();
  
  if (!res.ok) {
    throw new Error(responseData.msg || 'Failed to fetch marketplace products');
  }
  
  return responseData;
}

export async function createHarvestedProduct(productData) {
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
}

export async function addToMarketplace(productId, marketplaceData) {
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
}

export async function removeFromMarketplace(productId) {
  const res = await fetch(`${PRODUCT_API_BASE}/${productId}/remove-marketplace`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const responseData = await res.json();
  
  if (!res.ok) {
    throw new Error(responseData.msg || 'Failed to remove product from marketplace');
  }
  
  return responseData;
}

export async function getProductById(productId) {
  const res = await fetch(`${PRODUCT_API_BASE}/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const responseData = await res.json();
  
  if (!res.ok) {
    throw new Error(responseData.msg || 'Failed to fetch product');
  }
  
  return responseData;
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
}

export async function getStoredCropSuggestions(farmId) {
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
}

export async function refreshCropSuggestions(farmId) {
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
import { NextResponse } from 'next/server';

export function clearAuthCookies() {
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.set('userId', '', { maxAge: 0 });
  response.cookies.set('role', '', { maxAge: 0 });
  response.cookies.set('userName', '', { maxAge: 0 });
  response.cookies.set('userEmail', '', { maxAge: 0 });

  return response;
}

