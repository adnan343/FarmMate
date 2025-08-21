import { getApiUrl, getErrorMessage } from './apiConfig';

const API_BASE = getApiUrl('/users');

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
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('User not found');
  return res.json();
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



