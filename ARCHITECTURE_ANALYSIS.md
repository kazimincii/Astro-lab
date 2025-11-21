# Astrology Super App - Mobile Architecture Analysis

## Executive Summary
This is a comprehensive astrology mobile application built with React Native + Expo, featuring multiple specialized features including daily forecasts, tarot readings, birth charts, and AI-powered assistance. It's designed as a multi-profile, subscription-based application with heavy emphasis on personalization and astrology services.

---

## 1. Framework & Technology Stack

### Frontend Framework
- **Framework**: React Native 0.81.5 with Expo 54.0.24
- **JavaScript Runtime**: Modern JavaScript ES2021+
- **Type System**: TypeScript 5.9.2
- **Build Tool**: Expo (handles bundling and deployment)

### Core Dependencies
```
React 19.1.0
React Native 0.81.5
Expo ~54.0.24
TypeScript ~5.9.2
```

### Key Technical Libraries
- **Navigation**: React Navigation v6 (Stack, Bottom Tabs, Bottom Sheet)
  - @react-navigation/native
  - @react-navigation/stack
  - @react-navigation/bottom-tabs
- **State Management**: Zustand 4.4.7
- **Data Fetching**: Axios 1.6.5 + TanStack React Query 5.17.9
- **Localization**: i18next 23.7.11 + react-i18next 13.5.0 + expo-localization 15.0.3
- **Styling**: Tailwind CSS 3.4.1 (via NativeWind 4.0.1) + StyleSheet (React Native native)
- **Payments**: Stripe React Native (0.50.3)
- **Icons**: Expo Vector Icons (@expo/vector-icons 15.0.3)
- **Graphics**: React Native SVG (15.12.1) + Expo Linear Gradient

### Development Tools
- **Testing**: Jest 29.7.0 + React Testing Library
- **E2E Testing**: Detox (with custom stubs in scripts folder)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

---

## 2. Application Structure

### Directory Structure
```
astrology-app/mobile/
├── src/
│   ├── api/                    # API client layer (30+ endpoints)
│   │   ├── client.ts           # Axios instance with interceptors
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── profiles.ts         # User profile management
│   │   ├── forecasts.ts        # Daily/weekly forecasts
│   │   ├── tarot.ts            # Tarot reading API
│   │   ├── numerology.ts       # Numerology calculations
│   │   ├── chakras.ts          # Chakra readings
│   │   ├── biorhythm.ts        # Biorhythm analysis
│   │   ├── advancedCharts.ts   # Advanced astrological charts
│   │   ├── astroMap.ts         # Astro location mapping
│   │   ├── relationship.ts     # Relationship analysis
│   │   ├── soulmate.ts         # Soulmate matching
│   │   ├── subscriptions.ts    # Subscription management
│   │   ├── payments.ts         # Payment processing
│   │   ├── trials.ts           # Trial management
│   │   ├── journal.ts          # Journal entries
│   │   ├── education.ts        # Educational content
│   │   ├── widgets.ts          # iOS widget data
│   │   ├── liveServices.ts     # Live consultations
│   │   ├── coffeeReading.ts    # Coffee cup reading
│   │   ├── famousPeople.ts     # Famous personality matches
│   │   ├── cosmicClimate.ts    # Cosmic climate readings
│   │   ├── auraScan.ts         # Aura analysis
│   │   ├── calendars.ts        # Astro calendars
│   │   ├── aiAssistant.ts      # AI assistant API
│   │   └── actions.ts          # Action tracking
│   │
│   ├── components/             # Reusable React Native components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Card.tsx        # Card container with styling
│   │   │   ├── Badge.tsx       # Badge component
│   │   │   └── SectionTitle.tsx
│   │   ├── TarotCard.tsx       # Tarot card visualization
│   │   ├── ChartWheel.tsx      # Astrological chart wheel
│   │   ├── MembershipCard.tsx  # Subscription plan display
│   │   ├── ProfileSelector.tsx # Profile selection dropdown
│   │   ├── PaymentSheet.tsx    # Stripe payment UI
│   │   ├── ActionsCounter.tsx  # Action usage tracker
│   │   └── ActionLimitModal.tsx # Trial limit notifications
│   │
│   ├── screens/                # Screen components
│   │   ├── auth/               # Authentication flows
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   └── ResetPasswordScreen.tsx
│   │   │
│   │   └── main/               # Main app screens (32+ screens)
│   │       ├── TodayScreen.tsx       # Daily horoscope/forecast
│   │       ├── ProfilesScreen.tsx    # Profile management
│   │       ├── ExploreScreen.tsx     # Feature discovery hub
│   │       ├── AIAssistantScreen.tsx # AI-powered chat
│   │       ├── SettingsScreen.tsx    # App settings
│   │       ├── JournalScreen.tsx     # Personal journal
│   │       ├── WidgetsScreen.tsx     # iOS widget setup
│   │       ├── MyPlanScreen.tsx      # Subscription plan details
│   │       ├── BiorhythmScreen.tsx   # Biorhythm analysis
│   │       ├── ChakrasScreen.tsx     # Chakra readings
│   │       ├── TarotScreen.tsx       # Tarot readings
│   │       ├── NumerologyScreen.tsx  # Numerology readings
│   │       ├── CoffeeReadingScreen.tsx
│   │       ├── AuraScanScreen.tsx    # Aura analysis
│   │       ├── ForecastsScreen.tsx   # Long-term forecasts
│   │       ├── AdvancedChartsScreen.tsx
│   │       ├── ChartTypeDetailScreen.tsx
│   │       ├── BirthChartDetailScreen.tsx
│   │       ├── AstroMapScreen.tsx    # Location-based astrology
│   │       ├── RelationshipSoulmateScreen.tsx
│   │       ├── FamousPeopleScreen.tsx # Compare with famous people
│   │       ├── CalendarsScreen.tsx   # Astrological calendars
│   │       ├── CosmicClimateScreen.tsx
│   │       ├── LiveServicesScreen.tsx # Live consultations
│   │       ├── EducationScreen.tsx   # Learning content
│   │       ├── EducationArticleScreen.tsx
│   │       └── __tests__/            # Screen unit tests
│   │
│   ├── navigation/             # Navigation configuration
│   │   ├── RootNavigator.tsx   # Auth/Main switching
│   │   ├── AuthNavigator.tsx   # Stack navigation for auth flows
│   │   ├── MainNavigator.tsx   # Bottom tab navigation (Today, Profiles, Explore, AI, Settings)
│   │   ├── ExploreNavigator.tsx # Stack navigator within Explore tab
│   │   └── screenParams.ts     # Navigation parameter types
│   │
│   ├── store/                  # State management (Zustand)
│   │   └── authStore.ts        # Authentication state
│   │       - isAuthenticated: boolean
│   │       - user: User | null
│   │       - token: string | null
│   │       - login/logout methods
│   │
│   ├── contexts/               # React Context API
│   │   └── ProfileContext.tsx  # Current profile selection context
│   │       - selectedProfile: Profile
│   │       - setSelectedProfile()
│   │       - refreshProfile()
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useScreenProfile.ts    # Get profile from navigation params
│   │   ├── useProfileNavigation.ts # Navigate with profile context
│   │   └── useWidgetUpdates.ts    # iOS widget update hook
│   │
│   ├── i18n/                   # Internationalization
│   │   ├── config.ts           # i18n configuration & language switching
│   │   └── locales/
│   │       ├── en/             # English translations
│   │       │   ├── auth.json        # Login/signup strings
│   │       │   ├── common.json      # Common UI strings
│   │       │   ├── plans.json       # Subscription plan names
│   │       │   └── screens.json     # Screen-specific content
│   │       └── tr/             # Turkish translations (same structure)
│   │
│   ├── theme/                  # Design system
│   │   └── colors.ts           # Cosmic color palette + zodiac colors
│   │
│   ├── config/                 # Configuration
│   │   └── stripe.ts           # Stripe configuration & plan IDs
│   │
│   ├── services/               # Business logic services
│   │   ├── (advanced services if needed)
│   │
│   └── types/                  # TypeScript type definitions
│       └── (domain-specific types)
│
├── App.tsx                     # Root app component with providers
├── app.json                    # Expo configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest testing configuration
├── package.json                # Dependencies
└── babel.config.js             # Babel configuration for Expo
```

---

## 3. Main Screens & Navigation Structure

### Navigation Hierarchy
```
RootNavigator (Stack)
├── Auth Flow (if !isAuthenticated)
│   └── AuthNavigator (Stack)
│       ├── Welcome Screen
│       ├── Login Screen
│       ├── Register Screen
│       ├── Onboarding Screen
│       ├── Forgot Password Screen
│       └── Reset Password Screen
│
└── Main Flow (if isAuthenticated)
    └── MainNavigator (Bottom Tab)
        ├── Today Tab
        │   └── TodayScreen
        │       - Daily horoscope
        │       - Forecast for main profile
        │       - Action usage stats
        │
        ├── Profiles Tab
        │   └── ProfilesScreen
        │       - List of user profiles
        │       - Create/edit profiles
        │       - Set main profile
        │
        ├── Explore Tab
        │   └── ExploreNavigator (Stack)
        │       ├── ExploreScreen (Hub)
        │       ├── MyPlan
        │       ├── Education (with article detail)
        │       ├── Widgets
        │       ├── Journal
        │       ├── Biorhythm
        │       ├── Chakras
        │       ├── Relationship/Soulmate
        │       ├── Advanced Charts
        │       ├── Chart Type Detail
        │       ├── Birth Chart Detail
        │       ├── Forecasts
        │       ├── Tarot Reading
        │       ├── Coffee Reading
        │       ├── Numerology
        │       ├── Calendars
        │       ├── Famous People
        │       ├── Astro Map
        │       ├── Live Services
        │       ├── Cosmic Climate
        │       └── Aura Scan
        │
        ├── AI Tab
        │   └── AIAssistantScreen
        │       - Chat with AI astrology assistant
        │       - Context-aware recommendations
        │
        └── Settings Tab
            └── SettingsScreen
                - User profile settings
                - App preferences
                - Language selection
                - Account management
```

---

## 4. Component Architecture

### Component Hierarchy
```
App (Root)
├── QueryClientProvider (React Query)
├── StripeProvider (Stripe SDK)
├── ProfileProvider (Profile Context)
├── SafeAreaProvider (Safe area handling)
└── NavigationContainer (React Navigation)
    └── RootNavigator
        ├── AuthNavigator (if logged out)
        └── MainNavigator (if logged in)
            ├── TodayScreen
            ├── ProfilesScreen
            ├── ExploreNavigator
            ├── AIAssistantScreen
            └── SettingsScreen
```

### Component Types

**Base UI Components** (`/components/ui/`)
- `Card.tsx` - Styled container with border & padding
- `Badge.tsx` - Small status/label indicator
- `SectionTitle.tsx` - Section header styling

**Domain Components** (`/components/`)
- `TarotCard.tsx` - Tarot card visualization & animation
- `ChartWheel.tsx` - Astrological birth chart wheel rendering
- `ProfileSelector.tsx` - Dropdown for profile selection
- `MembershipCard.tsx` - Subscription tier display
- `PaymentSheet.tsx` - Stripe payment modal integration
- `ActionsCounter.tsx` - Usage tracker for API calls
- `ActionLimitModal.tsx` - Trial limit warning modal

### Design System
- **Color Palette**: "Cosmic" dark theme with zodiac sign colors
- **Styling Approach**: 
  - Primary: NativeWind (Tailwind CSS for React Native)
  - Secondary: StyleSheet for performance-critical areas
  - Mix of inline styles and className utilities
- **Icons**: Ionicons from Expo Vector Icons library

---

## 5. API Integration & Data Sources

### API Architecture

**Client Configuration** (`api/client.ts`)
```typescript
- Base URL: EXPO_PUBLIC_API_URL or localhost:3000/api/v1
- HTTP Client: Axios with interceptors
- Auth: Bearer token in Authorization header
- Error Handling: 401 logout trigger
- Fallback: Mock data when backend unreachable
```

### API Module Organization (30+ endpoints)

**Authentication** (`auth.ts`)
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password

**Profiles** (`profiles.ts`)
- GET /profiles - List all user profiles
- GET /profiles/:id - Single profile
- POST /profiles - Create profile
- PUT /profiles/:id - Update profile
- DELETE /profiles/:id - Delete profile

**Forecasts** (`forecasts.ts`)
- GET /forecasts/today/:profileId - Daily forecast
- GET /forecasts/weekly/:profileId - Weekly forecast
- GET /forecasts/monthly/:profileId - Monthly forecast

**Subscription & Payments** (`subscriptions.ts`, `payments.ts`, `trials.ts`)
- GET /subscriptions/usage - Current usage
- GET /subscriptions/plans - Available plans
- POST /payments/intent - Stripe payment intent
- GET /trials/status - Trial information
- POST /trials/claim - Activate trial

**Divination & Analysis** (15+ endpoints)
- Tarot: GET /tarot/reading
- Numerology: GET /numerology/:profileId
- Chakras: GET /chakras/:profileId
- Biorhythm: GET /biorhythm/:profileId
- Coffee Reading: POST /coffee-reading
- Aura Scan: POST /aura-scan
- Advanced Charts: GET /charts/:type/:profileId
- Astro Map: GET /astro-map/:profileId
- Relationship: GET /relationship/:profileId1/:profileId2
- Soulmate: GET /soulmate/:profileId
- Famous People: GET /famous-people/:profileId

**Educational & Content** (`education.ts`)
- GET /education/articles - List articles
- GET /education/articles/:id - Article detail

**Other Services** (`journal.ts`, `widgets.ts`, `liveServices.ts`, `cosmicClimate.ts`, `calendars.ts`, `famousPeople.ts`, `aiAssistant.ts`)
- Various GET/POST endpoints for specialized features

### Data Fetching Strategy
- **Library**: TanStack React Query (formerly React Query)
- **Query Keys**: Structured hierarchical (e.g., `['profiles']`, `['forecast', profileId]`)
- **Caching**: Stale time configuration per query (some 10min, some 1min)
- **Refetching**: Manual refetch via React Query hooks
- **Loading States**: Per-query isLoading flags
- **Error Handling**: Per-query error states with user feedback

---

## 6. State Management

### Global State (Zustand)
**AuthStore** (`store/authStore.ts`)
```typescript
{
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (user, token) => void
  logout: () => void
}
```

**Usage**: Determines Auth vs Main navigation flow

### Local State
**React Context** (`contexts/ProfileContext.tsx`)
```typescript
{
  selectedProfile: Profile | null
  setSelectedProfile: (profile) => void
  isLoading: boolean
  error: Error | null
  refreshProfile: () => Promise<void>
}
```

**Usage**: Current user profile selection across the app

### Server State (React Query)
- Managed automatically by React Query
- Per-screen queries (profiles, forecasts, subscriptions, etc.)
- Automatic background refetching
- Optimistic updates support

### Local Component State
- React.useState for UI state (modals, forms, etc.)
- Controlled inputs for forms
- RefreshControl state for pull-to-refresh

---

## 7. Styling & Design System

### Theme Configuration
**Colors** (`theme/colors.ts`)
```typescript
cosmic: {
  bg: '#0f0f1e',           // Main background
  card: '#1a1b2e',         // Card backgrounds
  purple: '#6366f1',       // Primary accent
  pink: '#ec4899',         // Secondary accent
  blue: '#3b82f6',
  gold: '#f59e0b',
  accent: '#6366f1',
  text: '#ffffff',
  textSecondary: '#9ca3af'
}

zodiac: {  // Per-sign colors
  aries: '#ff4444',
  taurus: '#44ff44',
  gemini: '#ffff44',
  // ... 9 more zodiac signs
}
```

### Tailwind CSS Setup (`tailwind.config.js`)
- Custom Cosmic and Zodiac color extensions
- NativeWind integration for React Native
- System font family fallback
- Dark mode by default

### Styling Approach (Mixed)
1. **Component-Level StyleSheet** (React Native native)
   - Performance-critical layouts
   - Complex dynamic styling
   
2. **NativeWind Classes** (Tailwind CSS)
   - Utility-first styling
   - Consistent spacing & colors
   - Example: `className="rounded-2xl bg-[#1a1b2e] border border-[#24243a] p-5"`

3. **Inline Styles**
   - Dynamic colors and sizes
   - Conditional styling
   - Theme colors from `colors.ts`

### Layout System
- React Native Flexbox exclusively
- SafeAreaView for notch/status bar handling
- FlatList/ScrollView for scrollable content
- LinearGradient for decorative backgrounds

---

## 8. Localization (i18n) Setup

### Architecture
**i18n Config** (`i18n/config.ts`)
- Framework: i18next + react-i18next
- Device Detection: expo-localization auto-detects language
- Storage: AsyncStorage persists user preference
- Fallback: English default

**Supported Languages**: English (en) and Turkish (tr)

### Translation Structure
```
locales/
├── en/
│   ├── auth.json        - Login, register, password reset
│   ├── common.json      - Navigation, common UI terms
│   ├── plans.json       - Subscription plan details
│   └── screens.json     - Screen-specific content
└── tr/
    └── [Same structure - Turkish translations]
```

**Usage in Components**:
```typescript
const { t } = useTranslation();
// Access: t('auth.login.title')
// Supports interpolation: t('key', { variable })
```

**Language Switching**:
```typescript
import { changeLanguage } from '@/i18n/config';
changeLanguage('tr'); // Persists to AsyncStorage
```

---

## 9. Payment & Subscription System

### Stripe Integration (`config/stripe.ts`)
```typescript
STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  merchantIdentifier: 'merchant.com.astrology.app'
  urlScheme: 'astrology'
}

Plan Structure:
- Basic: Free tier
- Standard: $10/mo or $100/yr (~$8.33/mo)
- Premium: $19/mo or $180/yr (~$15/mo)
```

### Payment Flow
1. **Stripe Provider Wrapper** (App.tsx)
   - StripeProvider setup at root
   
2. **PaymentSheet Component**
   - Renders Stripe payment modal
   - Handles card entry securely
   
3. **Actions Tracking**
   - Trial limited features (e.g., limited readings per day)
   - Subscription-based feature unlocking
   - ActionsCounter displays usage
   - ActionLimitModal warns near limits

### Subscription Features
- Trial period management (`trials.ts`)
- Usage tracking (`subscriptions.ts` getUsage)
- Plan downgrades/upgrades
- Recurring billing via Stripe

---

## 10. iOS Widget Support

### Widget System
- **Location**: `/ios-widgets` directory (Swift code)
- **Data Source**: Widget Kit framework
- **Updates**: Pushed via `useWidgetUpdates` hook
- **Content Types**:
  - Daily horoscope message
  - Moon phase
  - Current zodiac sign info

**Hook** (`hooks/useWidgetUpdates.ts`):
```typescript
useWidgetUpdates({
  enabled: true,
  fetchHoroscope: () => API call,
  fetchMoonPhase: () => API call,
})
```

---

## 11. Testing Infrastructure

### Unit Testing
- **Framework**: Jest 29.7.0
- **Library**: React Testing Library for React Native
- **Config**: `jest.config.js` with jest-expo preset

### Test Coverage Areas
- Screen components
- Components (ProfileSelector, etc.)
- API client
- Custom hooks
- Store/context

### E2E Testing
- **Framework**: Detox (custom stub in `scripts/detox-stub`)
- **Config**: `.detoxrc.json`
- **Tests**: Located in `e2e/` directory
- **Key Test**: `e2e/auth.e2e.test.ts`

### Testing Commands
```bash
npm run test              # Unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run detox:test       # E2E tests
npm run detox:report     # E2E reports
```

---

## 12. Backend API Structure (Reference)

The mobile app connects to a NestJS backend with these modules:

```
Backend (NestJS v10)
├── auth/              - JWT authentication
├── profiles/          - User profile CRUD
├── forecasts/         - Astrological forecasts
├── tarot/             - Tarot reading logic
├── numerology/        - Numerology calculations
├── chakras/           - Chakra analysis
├── biorhythm/         - Biorhythm calculations
├── subscriptions/     - Subscription plans & management
├── payments/          - Stripe webhook integration
├── trials/            - Trial period logic
├── journal/           - Journal entry storage
├── education/         - Educational content
├── widgets/           - iOS widget data
├── ai-assistant/      - AI service integration
├── advanced-charts/   - Complex chart rendering
├── relationship/      - Relationship matching
├── soulmate/          - Soulmate matching algorithms
├── famous-people/     - Celebrity horoscope data
├── astro-map/         - Location-based astrology
├── live-services/     - Live consultation booking
├── cosmic-climate/    - Cosmic climate readings
├── aura-scan/         - Aura analysis
├── calendars/         - Astrological calendars
├── coffee-reading/    - Coffee cup reading
└── actions/           - User action tracking
```

**Tech Stack**: NestJS, TypeORM, PostgreSQL, Redis, Stripe, OpenAI/Anthropic

---

## 13. Key Development Features

### Environment Configuration
**Environment Variables** (`.env` and `.env.production`)
```
EXPO_PUBLIC_API_URL        # Backend API URL
STRIPE_PUBLISHABLE_KEY     # Stripe public key
Other service credentials
```

### Development Server
```bash
npm start           # Expo dev server
npm run ios         # iOS simulator
npm run android     # Android emulator
npm run web         # Web browser (experimental)
```

### Code Quality Tools
- **TypeScript**: Strict mode enabled
- **ESLint**: Code style enforcement
- **Prettier**: Code formatting
- **Pre-commit Hooks**: Potential linting (if configured)

---

## 14. Performance Optimizations

### Code Splitting
- Screen-based lazy loading via React Navigation
- Dynamic imports support in Expo

### State Optimization
- Zustand (minimal bundle size vs Redux)
- React Query for server state (prevents prop drilling)
- Context for occasional global state (profiles)

### Rendering Optimization
- React.memo on expensive components
- useMemo/useCallback hooks for derived state
- FlatList with proper key props
- PureComponent patterns possible

### Bundle Size
- Tree-shaking enabled
- Minimal dependencies (axios vs fetch)
- Local color constants (not imported every time)

---

## 15. Architecture Patterns & Best Practices

### Design Patterns Used

1. **Provider Pattern** (Contexts & Providers)
   - ProfileProvider wraps entire app
   - ProfileContext accessed via useProfile hook
   
2. **Factory Pattern** (API endpoints)
   - Each feature has dedicated API module
   - Consistent structure across all endpoints
   
3. **Repository Pattern** (API client abstraction)
   - apiClient handles all HTTP details
   - Screens don't know about HTTP implementation
   
4. **Observer Pattern** (React Query)
   - Automatic refetching
   - Cache invalidation
   
5. **Container/Presentational** (Screens vs Components)
   - Screens handle data fetching + state
   - Components receive data as props

### Code Organization Principles

1. **Feature-Based Folders**
   - All API calls in `/api` folder
   - All screens in `/screens` with sub-folders
   - All components in `/components`
   
2. **Separation of Concerns**
   - API layer: HTTP requests only
   - Hooks: Business logic and state
   - Components: UI rendering
   - Contexts: Global shared state
   
3. **Type Safety**
   - TypeScript everywhere
   - Interfaces for API responses
   - Props types for components

4. **Error Handling**
   - Per-query error states (React Query)
   - Auth error triggers logout
   - Fallback mock data for offline support

---

## 16. Key Insights for Web Panel Version

### What Transfers Well
1. **API Layer** - 95% reusable directly
   - Same endpoints and auth
   - Can replace axios with fetch if needed
   
2. **Data Models** - 100% reusable
   - TypeScript interfaces work everywhere
   - Profile, Forecast, Plan structures identical
   
3. **Business Logic** - 85% reusable
   - Custom hooks can become utilities
   - Services are framework-agnostic
   
4. **State Management** - Can adapt
   - Zustand works on web too
   - Or migrate to Redux/Jotai/Zustand
   - React Query works identically

### Web-Specific Changes Needed

1. **Navigation** - Replace React Navigation
   - Use React Router v6 (StackNavigator → Route components)
   - Browser history instead of native navigation
   - URL-based routing instead of stack push/pop
   
2. **Styling** - Keep or migrate
   - NativeWind doesn't work on web
   - Switch to regular Tailwind CSS (all utilities available)
   - Or use CSS Modules/styled-components
   
3. **Components** - Complete rewrite
   - View → div
   - Text → span/p
   - ScrollView → div with overflow-y
   - FlatList → div or table rendering
   - SafeAreaView → not needed
   - StatusBar → document title
   
4. **Platform Specifics** - Remove
   - Platform.select() branches
   - iOS/Android native code
   - Expo-specific APIs (use web alternatives)
   
5. **Payments** - Different integration
   - Stripe.js instead of Stripe React Native
   - Web-based payment flow
   - Different PCI compliance approach
   
6. **Storage** - Different approach
   - AsyncStorage → localStorage or sessionStorage
   - Or use React Query's cache
   
7. **Icons** - Keep Ionicons
   - Ionicons library works on web
   - Or switch to react-icons
   
8. **Testing** - Update test setup
   - Keep Jest and React Testing Library
   - Detox → Cypress or Playwright for E2E
   - Different component rendering (DOM vs native)

### Reusable Directory Structure
```
web-panel/
├── src/
│   ├── api/              ✅ Copy from mobile (100% reusable)
│   ├── types/            ✅ Copy from mobile (100% reusable)
│   ├── hooks/            ⚠️ Keep logic, update React specifics
│   ├── contexts/         ✅ Copy structure, keep logic
│   ├── components/       ❌ Rewrite for web (new structure)
│   ├── pages/            ✨ New: Replace screens/
│   ├── store/            ✅ Copy from mobile (Zustand works on web)
│   ├── theme/            ✅ Colors can be copied
│   ├── styles/           ✨ New: Add web-specific CSS
│   ├── config/           ⚠️ Adapt Stripe for web
│   └── i18n/             ✅ Copy completely (i18next works on web)
```

### Recommended Tech Stack for Web Version
```
Frontend:
- React 19 (same as mobile)
- React Router v6 (routing)
- TypeScript (same)
- Tailwind CSS (styling - already configured)
- Zustand (state - already used)
- React Query (server state - already used)
- react-i18next (localization - already used)
- Stripe.js (payments - different integration)
- Ionicons or react-icons (icons)
- axios (same HTTP client)

Testing:
- Jest (keep)
- React Testing Library (keep)
- Cypress/Playwright (replace Detox)

Build:
- Vite (much faster than CRA)
- Or Next.js (more batteries included)
```

---

## Summary Statistics

- **Total Screen Components**: 32+ screens
- **API Endpoints**: 30+ endpoints
- **Localization**: 2 languages with 4 translation files each
- **Component Files**: 10+ reusable components
- **Store Modules**: 1 Zustand store (auth)
- **Context Providers**: 1 (Profile)
- **Custom Hooks**: 3 main hooks
- **Color Palette**: 1 theme + 12 zodiac colors
- **Test Files**: 20+ test files
- **Navigation Hierarchies**: 2 main flows (Auth/Main)
- **Subscription Plans**: 3 tiers (Basic, Standard, Premium)
- **Payment Provider**: Stripe
- **Database**: PostgreSQL (backend)
- **Real-time Features**: Potential WebSockets for live services

