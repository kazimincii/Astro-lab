import Link from "next/link";

export default function Home() {
  const screens = [
    { name: 'Welcome', path: '/auth/welcome', category: 'Auth' },
    { name: 'Login', path: '/auth/login', category: 'Auth' },
    { name: 'Register', path: '/auth/register', category: 'Auth' },
    { name: 'Forgot Password', path: '/auth/forgot-password', category: 'Auth' },
    { name: 'Onboarding', path: '/auth/onboarding', category: 'Auth' },
    { name: 'Today', path: '/main/today', category: 'Main' },
    { name: 'Explore', path: '/main/explore', category: 'Main' },
    { name: 'Journal', path: '/main/journal', category: 'Main' },
    { name: 'Settings', path: '/main/settings', category: 'Main' },
    { name: 'Profiles', path: '/main/profiles', category: 'Main' },
    { name: 'Advanced Charts', path: '/main/advanced-charts', category: 'Features' },
    { name: 'AI Assistant', path: '/main/ai-assistant', category: 'Features' },
    { name: 'Astro Map', path: '/main/astro-map', category: 'Features' },
    { name: 'Aura Scan', path: '/main/aura-scan', category: 'Features' },
    { name: 'Biorhythm', path: '/main/biorhythm', category: 'Features' },
    { name: 'Calendars', path: '/main/calendars', category: 'Features' },
    { name: 'Chakras', path: '/main/chakras', category: 'Features' },
    { name: 'Coffee Reading', path: '/main/coffee-reading', category: 'Features' },
    { name: 'Cosmic Climate', path: '/main/cosmic-climate', category: 'Features' },
    { name: 'Education', path: '/main/education', category: 'Features' },
    { name: 'Famous People', path: '/main/famous-people', category: 'Features' },
    { name: 'Forecasts', path: '/main/forecasts', category: 'Features' },
    { name: 'Live Services', path: '/main/live-services', category: 'Features' },
    { name: 'Numerology', path: '/main/numerology', category: 'Features' },
    { name: 'Relationship', path: '/main/relationship', category: 'Features' },
    { name: 'Tarot', path: '/main/tarot', category: 'Features' },
    { name: 'My Plan', path: '/main/my-plan', category: 'Settings' },
    { name: 'Widgets', path: '/main/widgets', category: 'Settings' },
  ];

  const categories = Array.from(new Set(screens.map(s => s.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ✨ Astrology App - Web Panel
          </h1>
          <p className="text-xl text-purple-200">
            Mobil uygulamanızı web üzerinden test edin
          </p>
          <p className="text-sm text-purple-300 mt-2">
            {screens.length} ekran • Mobil Simülatör ile tam deneyim
          </p>
        </div>

        {/* Screens Grid */}
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="bg-purple-600 px-4 py-1 rounded-lg">
                {category}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {screens
                .filter(screen => screen.category === category)
                .map((screen) => (
                  <Link
                    key={screen.path}
                    href={screen.path}
                    className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {screen.name}
                        </h3>
                        <p className="text-sm text-purple-200">
                          {screen.path}
                        </p>
                      </div>
                      <svg
                        className="w-6 h-6 text-purple-300 group-hover:text-white group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-16 text-center text-purple-200">
          <p>Web Panel v1.0 • Tüm mobil özellikler web üzerinden erişilebilir</p>
        </div>
      </div>
    </div>
  );
}
