'use client';

import { getUserById, loginUser } from '@/lib/api';
import Cookies from 'js-cookie';
import { Leaf, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      setLoading(true);
      setErrors({});
      const loginResponse = await loginUser({ email: formData.email.trim(), password: formData.password });
      if (!loginResponse?.data?.userId) throw new Error('Login response did not return user data.');
      const userDataResponse = await getUserById(loginResponse.data.userId);
      const user = userDataResponse?.data;
      if (!user) throw new Error('Unable to load your profile after login.');

      Cookies.set('userId', user.id);
      Cookies.set('role', user.role);
      Cookies.set('userName', user.name);
      Cookies.set('userEmail', user.email);

      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'farmer') router.push('/dashboard/farmer');
      else if (user.role === 'buyer') router.push('/dashboard/buyer');
      else router.push('/login');
    } catch (err) {
      if (err.message.includes('not found')) setErrors({ email: 'No account found with this email' });
      else if (err.message.includes('Invalid password')) setErrors({ password: 'Incorrect password' });
      else setErrors({ general: err.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Left - Branding */}
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
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Welcome Back</h1>
          <p className="text-xl text-surface-300 leading-relaxed max-w-md">
            Next-Gen Farming Assistant. Sign in to your account to continue your agricultural journey.
          </p>
        </div>
      </div>

      {/* Right - Form */}
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
            <Link href="/login" className="py-3 px-4 text-sm font-semibold text-emerald-400 border-b-2 border-emerald-500">Login</Link>
            <Link href="/register" className="py-3 px-4 text-sm font-semibold text-surface-400 hover:text-white">Register</Link>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome Back!</h2>
          <p className="text-sm text-surface-400 mb-8">Please enter your details to sign in.</p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">{errors.general}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full rounded-xl border ${errors.email ? 'border-red-500/50' : 'border-white/10'} bg-surface-800/60 px-4 py-3 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">Forgot password?</a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full rounded-xl border ${errors.password ? 'border-red-500/50' : 'border-white/10'} bg-surface-800/60 px-4 py-3 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 text-sm font-semibold hover:shadow-emerald-500/20 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}