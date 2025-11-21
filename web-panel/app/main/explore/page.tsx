'use client';

import MobileSimulator from '@/components/MobileSimulator';
import Link from 'next/link';

export default function ExplorePage() {
  const categories = [
    {
      title: 'Readings',
      items: [
        { icon: '🔮', name: 'Tarot', path: '/main/tarot', color: 'from-purple-500 to-pink-500' },
        { icon: '☕', name: 'Coffee Reading', path: '/main/coffee-reading', color: 'from-amber-500 to-orange-500' },
        { icon: '🌈', name: 'Aura Scan', path: '/main/aura-scan', color: 'from-cyan-500 to-blue-500' },
      ],
    },
    {
      title: 'Charts & Maps',
      items: [
        { icon: '📊', name: 'Birth Chart', path: '/main/advanced-charts', color: 'from-indigo-500 to-purple-500' },
        { icon: '🗺️', name: 'Astro Map', path: '/main/astro-map', color: 'from-green-500 to-teal-500' },
        { icon: '📈', name: 'Biorhythm', path: '/main/biorhythm', color: 'from-red-500 to-pink-500' },
      ],
    },
    {
      title: 'Cosmic Insights',
      items: [
        { icon: '🌙', name: 'Cosmic Climate', path: '/main/cosmic-climate', color: 'from-blue-500 to-indigo-500' },
        { icon: '📅', name: 'Calendars', path: '/main/calendars', color: 'from-violet-500 to-purple-500' },
        { icon: '🔢', name: 'Numerology', path: '/main/numerology', color: 'from-orange-500 to-red-500' },
      ],
    },
    {
      title: 'Wellness',
      items: [
        { icon: '🧘', name: 'Chakras', path: '/main/chakras', color: 'from-pink-500 to-rose-500' },
        { icon: '📔', name: 'Journal', path: '/main/journal', color: 'from-teal-500 to-cyan-500' },
      ],
    },
    {
      title: 'Learn & Connect',
      items: [
        { icon: '📚', name: 'Education', path: '/main/education', color: 'from-blue-500 to-cyan-500' },
        { icon: '⭐', name: 'Famous People', path: '/main/famous-people', color: 'from-yellow-500 to-orange-500' },
        { icon: '💬', name: 'Live Services', path: '/main/live-services', color: 'from-green-500 to-emerald-500' },
        { icon: '🤖', name: 'AI Assistant', path: '/main/ai-assistant', color: 'from-purple-500 to-indigo-500' },
      ],
    },
  ];

  return (
    <MobileSimulator>
      <div className="min-h-full bg-gradient-to-b from-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 pt-16 pb-6 rounded-b-3xl">
          <Link href="/" className="text-white mb-4 inline-block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
          <p className="text-purple-200">Discover your cosmic journey</p>
        </div>

        <div className="px-6 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search features..."
                className="w-full px-4 py-3 pl-12 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Categories */}
          {categories.map((category) => (
            <div key={category.title} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{category.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="group bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom Navigation Hint */}
          <div className="text-center text-gray-400 text-sm mb-8">
            Swipe to discover more features
          </div>
        </div>
      </div>
    </MobileSimulator>
  );
}
