/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#0f0f1e',
          card: '#1a1b2e',
          purple: '#6366f1',
          pink: '#ec4899',
          blue: '#3b82f6',
          gold: '#f59e0b',
        },
        zodiac: {
          aries: '#ff4444',
          taurus: '#44ff44',
          gemini: '#ffff44',
          cancer: '#888888',
          leo: '#ff8800',
          virgo: '#8844ff',
          libra: '#ff88ff',
          scorpio: '#ff0000',
          sagittarius: '#8800ff',
          capricorn: '#444444',
          aquarius: '#00ffff',
          pisces: '#88ffff',
        },
      },
      fontFamily: {
        sans: ['System'],
        serif: ['System'],
      },
    },
  },
  plugins: [],
}
