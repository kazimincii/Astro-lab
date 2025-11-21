'use client';

import MobileSimulator from '@/components/MobileSimulator';
import Link from 'next/link';

export default function WelcomePage() {
  const features = [
    {
      icon: '🌟',
      title: 'Daily Horoscope',
      description: 'Get personalized insights every day',
    },
    {
      icon: '🔮',
      title: 'Tarot Reading',
      description: 'Discover your fortune with cards',
    },
    {
      icon: '📊',
      title: 'Birth Chart',
      description: 'Detailed astrological analysis',
    },
  ];

  return (
    <MobileSimulator>
      <div className="min-h-full bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-800 flex flex-col items-center justify-between p-6 pt-16">
        {/* Logo */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl mb-8 animate-pulse">
            ✨
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Astrology Super App
          </h1>
          <p className="text-purple-200 text-center text-lg mb-12">
            Unlock the mysteries of the cosmos
          </p>

          {/* Features */}
          <div className="space-y-4 w-full max-w-sm mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-purple-200 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Link
            href="/auth/register"
            className="block w-full py-4 bg-white text-purple-600 rounded-xl font-semibold text-center hover:bg-purple-100 transition-colors"
          >
            Get Started
          </Link>

          <Link
            href="/auth/login"
            className="block w-full py-4 bg-white/10 border-2 border-white text-white rounded-xl font-semibold text-center hover:bg-white/20 transition-colors"
          >
            Sign In
          </Link>

          <p className="text-center text-purple-200 text-sm">
            By continuing, you agree to our{' '}
            <a href="#" className="text-white underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-white underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </MobileSimulator>
  );
}
