const API_BASE = 'http://localhost:5000/api/users';

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}`, {
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

// Fetch all users
export async function fetchAllUsers() {
  const res = await fetch(`${API_BASE}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return data.data;
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

