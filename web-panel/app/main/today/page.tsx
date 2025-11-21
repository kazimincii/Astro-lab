'use client';

import MobileSimulator from '@/components/MobileSimulator';
import Link from 'next/link';

export default function TodayPage() {
  const horoscope = {
    sign: 'Aries',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    overall: 85,
    love: 78,
    career: 92,
    health: 88,
    money: 75,
    message: "Today brings excellent opportunities for career advancement. Your communication skills are at their peak, making it an ideal time for important presentations or negotiations.",
  };

  const categories = [
    { name: 'Overall', score: horoscope.overall, icon: '⭐', color: 'from-purple-500 to-pink-500' },
    { name: 'Love', score: horoscope.love, icon: '💕', color: 'from-pink-500 to-red-500' },
    { name: 'Career', score: horoscope.career, icon: '💼', color: 'from-blue-500 to-indigo-500' },
    { name: 'Health', score: horoscope.health, icon: '💪', color: 'from-green-500 to-emerald-500' },
    { name: 'Money', score: horoscope.money, icon: '💰', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <MobileSimulator>
      <div className="min-h-full bg-gradient-to-b from-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 pt-16 pb-8 rounded-b-3xl">
          <Link href="/" className="text-white mb-4 inline-block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Today's Horoscope</h1>
          <p className="text-purple-200">{horoscope.date}</p>
        </div>

        <div className="px-6 -mt-8">
          {/* Zodiac Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl">
                ♈
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{horoscope.sign}</h2>
                <p className="text-gray-500">March 21 - April 19</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {horoscope.message}
            </p>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-gray-700">{category.name}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${category.score}%` }}
                  />
                </div>

                <div className="text-right">
                  <span className={`text-xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                    {category.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lucky Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Lucky Today</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-xs text-gray-500">Color</div>
                <div className="font-semibold text-gray-700">Red</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🔢</div>
                <div className="text-xs text-gray-500">Number</div>
                <div className="font-semibold text-gray-700">7</div>
              </div>
              <div>
                <div className="text-3xl mb-2">⏰</div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="font-semibold text-gray-700">3-5 PM</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pb-8">
            <Link
              href="/main/explore"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-shadow"
            >
              Explore More
            </Link>
            <Link
              href="/main/journal"
              className="flex-1 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold text-center hover:bg-purple-50 transition-colors"
            >
              Journal
            </Link>
          </div>
        </div>
      </div>
    </MobileSimulator>
  );
}
