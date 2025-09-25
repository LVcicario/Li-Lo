'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, LogIn, Chrome, Apple, Facebook, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      router.push('/account/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    // Social login to be implemented with Supabase OAuth
    toast.info(`${provider} login will be available soon!`);
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link href="/" className="inline-block mb-8">
              <span className="text-3xl font-bold tracking-tighter text-white">LI-LO</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2 text-white">Welcome Back</h1>
            <p className="text-gray-400">Sign in to access your exclusive sneaker collection</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 pl-12 bg-white/5 border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-white/20",
                    errors.email ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="sneakerhead@example.com"
                />
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 pl-12 pr-12 bg-white/5 border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-white/20",
                    errors.password ? "border-red-500" : "border-white/10"
                  )}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-white/20"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-white">
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                <Chrome className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                <Apple className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                <Facebook className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600"
          alt="Exclusive Sneakers"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Exclusive Access Awaits</h2>
          <p className="text-gray-300">
            Join the elite community of sneaker collectors. Get early access to limited drops,
            exclusive releases, and member-only benefits.
          </p>
          <div className="mt-8 flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-gray-400">Active Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-gray-400">Exclusive Drops</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-gray-400">VIP Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}