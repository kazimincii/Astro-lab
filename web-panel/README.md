# Astrology App - Web Panel

Web panel for testing the Astrology mobile app on the web with a mobile simulator.

## Features

- 🎨 **Mobile Simulator**: Test the app in iPhone 14 or Pixel 7 viewport
- 📱 **Responsive Design**: All screens adapted for mobile viewing
- 🌐 **28+ Screens**: Complete mobile app experience on the web
- 🔄 **Reusable Code**: Shares API client, types, stores, and i18n with mobile app
- ⚡ **Fast Development**: Built with Next.js 15 and React 19

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd web-panel
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the web panel.

## Available Screens

### Auth Screens
- Welcome, Login, Register, Forgot Password, Onboarding

### Main Screens  
- Today (Daily horoscope), Explore, Journal, Settings, Profiles

### Feature Screens
- Advanced Charts, AI Assistant, Astro Map, Aura Scan, Biorhythm, Calendars, Chakras
- Coffee Reading, Cosmic Climate, Education, Famous People, Forecasts, Live Services
- Numerology, Relationship, Tarot, My Plan, Widgets

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **i18n**: i18next + react-i18next

## Testing Mobile Screens

1. Navigate to http://localhost:3000
2. Click on any screen from the list
3. Use the device selector to switch between iPhone 14 and Pixel 7
4. The mobile simulator shows exact viewport dimensions and UI

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Building for Production

```bash
npm run build
npm start
```

## Notes

- This web panel uses the same API client, types, and business logic as the mobile app
- The mobile simulator provides realistic device dimensions and UI elements
- All screens are optimized for mobile viewport sizes
- Navigation between screens works seamlessly
