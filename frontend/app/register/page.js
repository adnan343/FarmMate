'use client';

import { registerUser } from '@/lib/api';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      setErrors({});
      await registerUser({ name: formData.name.trim(), email: formData.email.trim(), password: formData.password, userType: formData.role });
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      if (err.message.includes('already exists')) setErrors({ email: 'An account with this email already exists' });
      else if (err.message.includes('required fields')) setErrors({ general: 'Please fill in all required fields' });
      else setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex">
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-emerald-900/80 via-surface-800 to-teal-900/40 p-12 relative overflow-hidden">
        <div className="absolute inset-0 mesh-overlay pointer-events-none" />
        <motion.div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <motion.div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-glow-emerald">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">FarmMate</span>
        </Link>
        <div className="my-auto relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Join FarmMate</h1>
          <p className="text-xl text-surface-300 leading-relaxed max-w-md">
            Create your account and start your journey with AI-powered farming.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">FarmMate</span>
            </Link>
          </div>

          <div className="flex border-b border-white/[0.06] mb-8">
            <Link href="/login" className="py-3 px-4 text-sm font-semibold text-surface-400 hover:text-white">Login</Link>
            <Link href="/register" className="py-3 px-4 text-sm font-semibold text-emerald-400 border-b-2 border-emerald-500">Register</Link>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create an Account</h2>
          <p className="text-sm text-surface-400 mb-8">Join our community to get started.</p>

          <form className="space-y-5" onSubmit={handleRegister}>
            {errors.general && <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">{errors.general}</div>}
            {successMessage && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-sm">{successMessage}</div>}

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe"
                className={`w-full rounded-xl border ${errors.name ? 'border-red-500/50' : 'border-white/10'} bg-surface-800/60 px-4 py-3 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all`} />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com"
                className={`w-full rounded-xl border ${errors.email ? 'border-red-500/50' : 'border-white/10'} bg-surface-800/60 px-4 py-3 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all`} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password (min. 8 characters)"
                className={`w-full rounded-xl border ${errors.password ? 'border-red-500/50' : 'border-white/10'} bg-surface-800/60 px-4 py-3 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all`} />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password"
                className={`w-full rounded-xl border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} bg-surface-800/60 px-4 py-3 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all`} />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">I am a</label>
              <select name="role" value={formData.role} onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-surface-800/60 px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all">
                <option value="buyer">Buyer - I want to purchase farm products</option>
                <option value="farmer">Farmer - I want to sell my farm products</option>
              </select>
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 text-sm font-semibold hover:shadow-emerald-500/20 hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}