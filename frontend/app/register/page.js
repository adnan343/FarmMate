'use client';

import { registerUser } from '@/lib/api';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      // Prepare data for backend
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        userType: formData.role
      };

      await registerUser(registrationData);
      
      setSuccessMessage('Registration successful! Redirecting to login...');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.message.includes('already exists')) {
        setErrors({ email: 'An account with this email already exists' });
      } else if (err.message.includes('required fields')) {
        setErrors({ general: 'Please fill in all required fields' });
      } else {
        setErrors({ general: err.message || 'Registration failed. Please try again.' });
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

      {/* Right Column (Registration Form) */}
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
            <Link href="/login" className="py-2 px-4 text-lg font-semibold text-gray-500 hover:text-teal-600">
              Login
            </Link>
            <Link href="/register" className="py-2 px-4 text-lg font-semibold text-teal-600 border-b-2 border-teal-600">
              Register
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-gray-600">Join our community to get started.</p>

          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full px-4 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a</label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  required
                  className={`block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white ${errors.role ? 'border-red-300' : 'border-gray-300'}`}
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="buyer">Buyer - I want to purchase farm products</option>
                  <option value="farmer">Farmer - I want to sell my farm products</option>
                </select>
              </div>
              {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
