'use client';

import { useState } from 'react';
import MobileSimulator from '@/components/MobileSimulator';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <MobileSimulator>
      <div className="min-h-full bg-gradient-to-b from-purple-600 to-indigo-900 flex flex-col items-center justify-center p-6">
        {/* Back Button */}
        <Link href="/" className="absolute top-16 left-6 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            ✨
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-purple-200 mb-8">Sign in to continue your cosmic journey</p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:border-white/40"
            />
          </div>

          <Link href="/auth/forgot-password" className="block text-right text-purple-200 text-sm">
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-100 transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6 w-full max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-purple-200 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
              Google
            </button>
            <button className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
              Apple
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <span className="text-purple-200">Don't have an account? </span>
          <Link href="/auth/register" className="text-white font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </MobileSimulator>
  );
}
