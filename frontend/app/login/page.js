'use client';

import { getUserById, loginUser } from '@/lib/api';
import Cookies from 'js-cookie';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      const { data } = await loginUser({ 
        email: formData.email.trim(), 
        password: formData.password 
      });
      
      console.log('Login response:', data);

      const userDataResponse = await getUserById(data.userId);
      const user = userDataResponse.data;

      console.log('User Data:', user);

      // Store complete user information in cookies
      Cookies.set('userId', user.id);
      Cookies.set('role', user.role);
      Cookies.set('userName', user.name);
      Cookies.set('userEmail', user.email);

      // Redirect based on role
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'farmer') router.push('/dashboard/farmer');
      else if (user.role === 'buyer') router.push('/dashboard/buyer');
      else router.push('/login'); // fallback

    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error cases
      if (err.message.includes('not found')) {
        setErrors({ email: 'No account found with this email address' });
      } else if (err.message.includes('Invalid password')) {
        setErrors({ password: 'Incorrect password' });
      } else {
        setErrors({ general: err.message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* Left Column (Branding) */}
      <div className="hidden lg:flex flex-col bg-teal-900 text-white p-12">
        <a href="/" className="flex items-center gap-2">
          <Link2 className="h-6 w-6" />
          <span className="text-xl font-bold">FarmMate</span>
        </a>
        <div className="my-auto">
          <h1 className="text-6xl font-bold mb-6">FarmMate</h1>
          <p className="text-4xl font-semibold text-gray-200">
            Next-Gen Farming Assistant for Sustainable Agriculture.
          </p>
          <p className="mt-4 text-lg text-gray-300">
            Join a community of modern farmers and buyers.
          </p>
        </div>
        <div/> {/* Spacer */}
      </div>

      {/* Right Column (Login Form) */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
             <a href="/" className="flex items-center justify-center gap-2 text-teal-900">
                <Link2 className="h-7 w-7" />
                <span className="text-2xl font-bold">FarmMate</span>
            </a>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b mb-8">
            <Link href="/login" className="py-2 px-4 text-lg font-semibold text-teal-600 border-b-2 border-teal-600">
              Login
            </Link>
            <Link href="/register" className="py-2 px-4 text-lg font-semibold text-gray-500 hover:text-teal-600">
              Register
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">Please enter your details to sign in.</p>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-teal-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
