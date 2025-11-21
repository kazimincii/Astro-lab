# Quick Reference: What to Copy vs. Rewrite for Web

A quick lookup table for migrating each part of the mobile app to web.

---

## API Layer (src/api/)

| File | Reusability | Notes |
|------|-------------|-------|
| `client.ts` | ✅ 95% | Update API URL env variable only |
| `auth.ts` | ✅ 100% | Copy as-is, same endpoints |
| `profiles.ts` | ✅ 100% | Copy as-is |
| `forecasts.ts` | ✅ 100% | Copy as-is |
| `tarot.ts` | ✅ 100% | Copy as-is |
| `numerology.ts` | ✅ 100% | Copy as-is |
| `chakras.ts` | ✅ 100% | Copy as-is |
| `biorhythm.ts` | ✅ 100% | Copy as-is |
| `advancedCharts.ts` | ✅ 100% | Copy as-is |
| `astroMap.ts` | ✅ 100% | Copy as-is |
| `relationship.ts` | ✅ 100% | Copy as-is |
| `soulmate.ts` | ✅ 100% | Copy as-is |
| `subscriptions.ts` | ✅ 100% | Copy as-is |
| `payments.ts` | ⚠️ 80% | Update Stripe logic |
| `trials.ts` | ✅ 100% | Copy as-is |
| `journal.ts` | ✅ 100% | Copy as-is |
| `education.ts` | ✅ 100% | Copy as-is |
| `widgets.ts` | ❌ 0% | iOS only, skip |
| `liveServices.ts` | ✅ 100% | Copy as-is |
| `coffeeReading.ts` | ✅ 100% | Copy as-is |
| `famousPeople.ts` | ✅ 100% | Copy as-is |
| `cosmicClimate.ts` | ✅ 100% | Copy as-is |
| `auraScan.ts` | ✅ 100% | Copy as-is |
| `calendars.ts` | ✅ 100% | Copy as-is |
| `aiAssistant.ts` | ✅ 100% | Copy as-is |
| `actions.ts` | ✅ 100% | Copy as-is |

**Summary**: Copy all 24 API files (except widgets.ts)

---

## Store & State (src/store/, src/contexts/)

| File | Reusability | Notes |
|------|-------------|-------|
| `store/authStore.ts` | ✅ 100% | Copy as-is, Zustand works on web |
| `contexts/ProfileContext.tsx` | ✅ 100% | Copy as-is, React Context same |

**Summary**: Copy both files without changes

---

## i18n & Localization (src/i18n/)

| File | Reusability | Notes |
|------|-------------|-------|
| `config.ts` | ⚠️ 90% | Remove `expo-localization`, use `navigator.language` |
| `locales/en/*.json` | ✅ 100% | Copy all JSON files as-is |
| `locales/tr/*.json` | ✅ 100% | Copy all JSON files as-is |

**Summary**: Copy all JSON files, update config.ts for browser locale detection

---

## Theme & Config (src/theme/, src/config/)

| File | Reusability | Notes |
|------|-------------|-------|
| `theme/colors.ts` | ✅ 100% | Copy as-is |
| `config/stripe.ts` | ⚠️ 80% | Update for web Stripe integration |

**Summary**: Copy colors.ts, adapt stripe.ts for web Stripe.js

---

## Hooks (src/hooks/)

| File | Reusability | Notes |
|------|-------------|-------|
| `useScreenProfile.ts` | ⚠️ 50% | Rewrite for React Router params |
| `useProfileNavigation.ts` | ⚠️ 50% | Rewrite for React Router navigation |
| `useWidgetUpdates.ts` | ❌ 0% | iOS only, skip |

**Summary**: Rewrite profile-related hooks for web routing

---

## Types (src/types/)

| Directory | Reusability | Notes |
|-----------|-------------|-------|
| `types/` | ✅ 100% | Copy all TypeScript definitions as-is |

**Summary**: Copy all type definitions

---

## Components (src/components/)

| File | Reusability | Action |
|------|-------------|--------|
| `ui/Card.tsx` | ⚠️ 10% | Rewrite: View → div, adapt styling |
| `ui/Badge.tsx` | ⚠️ 10% | Rewrite: View → span |
| `ui/SectionTitle.tsx` | ⚠️ 10% | Rewrite: Text → h2/h3 |
| `TarotCard.tsx` | ⚠️ 20% | Rewrite: Animated card, CSS animations |
| `ChartWheel.tsx` | ⚠️ 30% | Adapt: Keep SVG logic, improve styling |
| `ProfileSelector.tsx` | ⚠️ 20% | Rewrite: React Native → HTML select/dropdown |
| `MembershipCard.tsx` | ⚠️ 20% | Rewrite: Text → HTML elements |
| `PaymentSheet.tsx` | ❌ 0% | Rewrite: Stripe React Native → Stripe.js |
| `ActionsCounter.tsx` | ⚠️ 20% | Rewrite: React Native → HTML |
| `ActionLimitModal.tsx` | ⚠️ 20% | Rewrite: React Native Modal → HTML modal |

**Summary**: 
- Rewrite all UI components (View → div, Text → span/p)
- Keep logic where possible, redo markup/styling
- Stripe payment component needs complete rewrite

---

## Screens (src/screens/)

| File | Reusability | Action |
|------|-------------|--------|
| `auth/WelcomeScreen.tsx` | ⚠️ 40% | Rewrite as `pages/Auth/Welcome/index.tsx` |
| `auth/LoginScreen.tsx` | ⚠️ 40% | Rewrite as `pages/Auth/Login/index.tsx` |
| `auth/RegisterScreen.tsx` | ⚠️ 40% | Rewrite as `pages/Auth/Register/index.tsx` |
| `auth/OnboardingScreen.tsx` | ⚠️ 40% | Rewrite as `pages/Auth/Onboarding/index.tsx` |
| `auth/ForgotPasswordScreen.tsx` | ⚠️ 40% | Rewrite as `pages/Auth/ForgotPassword/index.tsx` |
| `auth/ResetPasswordScreen.tsx` | ⚠️ 40% | Rewrite as `pages/Auth/ResetPassword/index.tsx` |
| `main/TodayScreen.tsx` | ⚠️ 60% | Rewrite as `pages/Today/index.tsx` |
| `main/ProfilesScreen.tsx` | ⚠️ 60% | Rewrite as `pages/Profiles/index.tsx` |
| `main/ExploreScreen.tsx` | ⚠️ 60% | Rewrite as `pages/Explore/index.tsx` |
| `main/AIAssistantScreen.tsx` | ⚠️ 60% | Rewrite as `pages/AIAssistant/index.tsx` |
| `main/SettingsScreen.tsx` | ⚠️ 60% | Rewrite as `pages/Settings/index.tsx` |
| `main/JournalScreen.tsx` | ⚠️ 60% | Rewrite as `pages/Journal/index.tsx` |
| `main/WidgetsScreen.tsx` | ❌ 0% | iOS only, skip |
| `main/MyPlanScreen.tsx` | ⚠️ 60% | Rewrite as `pages/MyPlan/index.tsx` |
| All others (20+ files) | ⚠️ 60% | Rewrite maintaining same feature logic |

**Summary**:
- Keep all business logic (API calls, React Query usage)
- Rewrite all JSX (React Native → HTML)
- Rewrite all styling (StyleSheet → Tailwind/CSS)
- Keep useQuery hooks and state logic
- Skip iOS widget screen

---

## Navigation (src/navigation/)

| File | Reusability | Action |
|------|-------------|--------|
| `RootNavigator.tsx` | ❌ 0% | Rewrite for React Router |
| `AuthNavigator.tsx` | ❌ 0% | Rewrite for React Router |
| `MainNavigator.tsx` | ❌ 0% | Rewrite for React Router |
| `ExploreNavigator.tsx` | ❌ 0% | Rewrite for React Router |
| `screenParams.ts` | ⚠️ 50% | Adapt for React Router params |

**Summary**: Complete navigation rewrite for React Router

---

## Testing (src/**/__tests__/)

| Type | Reusability | Notes |
|------|-------------|-------|
| Unit tests (.test.ts) | ⚠️ 70% | Keep logic, update component imports |
| Detox E2E tests | ❌ 0% | Rewrite for Cypress/Playwright |

**Summary**: 
- Adapt unit tests for web components
- Rewrite E2E tests with Cypress

---

## Configuration Files

| File | Reusability | Action |
|------|-------------|--------|
| `package.json` | ❌ 0% | Create new for web (different deps) |
| `tsconfig.json` | ⚠️ 70% | Copy and update paths |
| `babel.config.js` | ❌ 0% | Not needed for Vite |
| `jest.config.js` | ⚠️ 70% | Adapt for jsdom environment |
| `tailwind.config.js` | ✅ 100% | Copy from mobile |
| `app.json` | ❌ 0% | Expo-specific, not needed |
| `.env.example` | ⚠️ 50% | Adapt variable names for web |

**Summary**:
- Copy tailwind.config.js
- Create new package.json with web deps
- Update tsconfig.json paths
- Adapt jest.config.js for jsdom

---

## Summary Table: Copy vs. Rewrite

| Category | Copy | Adapt | Rewrite | Skip |
|----------|------|-------|---------|------|
| **API Layer** | 24 files | 1 file | 0 | 1 |
| **State Management** | 2 files | 0 | 0 | 0 |
| **i18n** | 8 files | 1 file | 0 | 0 |
| **Theme/Config** | 1 file | 1 file | 0 | 0 |
| **Hooks** | 0 | 2 files | 1 file | 1 |
| **Types** | All | 0 | 0 | 0 |
| **Components** | 0 | 3 files | 7 files | 0 |
| **Screens** | 0 | 6 files | 26 files | 1 |
| **Navigation** | 0 | 1 file | 4 files | 0 |
| **Tests** | 0 | 4 files | Detox | 0 |
| **Config Files** | 1 file | 3 files | 2 files | 2 |

---

## Effort Estimation by Section

### Copy (Almost Free)
- ✅ All API files (24 files): ~1 hour
- ✅ All Type definitions: ~30 min
- ✅ Store/Context (2 files): ~15 min
- ✅ Colors theme: ~5 min
- **Subtotal: ~2 hours**

### Adapt (Minor Changes)
- ⚠️ i18n config: ~1 hour
- ⚠️ Stripe config: ~2 hours
- ⚠️ TypeScript config: ~30 min
- ⚠️ Jest config: ~1 hour
- ⚠️ Hooks (3 files): ~3 hours
- **Subtotal: ~7.5 hours**

### Rewrite (Major Work)
- ❌ Navigation system: ~8 hours (4 navigator files)
- ❌ Components (10 files): ~12 hours
- ❌ Screens/Pages (32 files): ~32 hours (~1 hour each)
- ❌ Tests: ~8 hours (unit + E2E)
- ❌ Configuration setup: ~4 hours
- **Subtotal: ~64 hours**

**Total Estimated Effort: ~73.5 hours (~2 weeks for 1 developer, 1 week for 2 developers)**

---

## Copy-Paste Checklist

### Commands to Copy Entire Directories
```bash
# Setup web project
npm create vite@latest astrology-web -- --template react-ts
cd astrology-web

# Copy full directories from mobile
cp -r ../Astro-lab/astrology-app/mobile/src/api src/
cp -r ../Astro-lab/astrology-app/mobile/src/types src/
cp -r ../Astro-lab/astrology-app/mobile/src/store src/
cp -r ../Astro-lab/astrology-app/mobile/src/contexts src/
cp -r ../Astro-lab/astrology-app/mobile/src/i18n src/
cp ../Astro-lab/astrology-app/mobile/src/theme/colors.ts src/theme/
cp ../Astro-lab/astrology-app/mobile/tailwind.config.js ./

# Create skeleton for new directories (you'll fill these)
mkdir -p src/pages src/components src/layouts src/styles src/tests
```

### Manual Adaptations
```bash
# Review and update these files:
# 1. src/api/client.ts - Change API URL logic
# 2. src/i18n/config.ts - Change locale detection
# 3. src/config/stripe.ts - Adapt for web Stripe.js
# 4. package.json - Install web dependencies
# 5. vite.config.ts - Setup path aliases
```

---

## Development Workflow

### Day 1-2: Setup & Copy
```bash
# ✅ Project creation
# ✅ Dependencies installation
# ✅ Copy API, types, store, i18n
# ✅ Update configuration files
```

### Day 3-4: Navigation & Layouts
```bash
# ✅ React Router setup (App.tsx)
# ✅ MainLayout component
# ✅ SideNavigation component
# ✅ Route structure
```

### Day 5-6: Base Components
```bash
# ✅ Card, Badge, SectionTitle components
# ✅ Form components (input, button, etc.)
# ✅ Modal component
```

### Day 7-10: Screens → Pages
```bash
# ✅ Auth pages (6 pages)
# ✅ Today, Profiles, Explore pages (3 pages)
# ✅ Feature pages (20+ pages, 2-3 per hour)
# ✅ Settings page
```

### Day 11: Payments
```bash
# ✅ Stripe.js setup
# ✅ Payment modal
# ✅ Plan selection UI
```

### Day 12-13: Testing & Polish
```bash
# ✅ Jest unit tests
# ✅ Cypress E2E tests
# ✅ Responsive design
# ✅ Bug fixes
```

---

## Files NOT to Copy

- ❌ `src/screens/main/WidgetsScreen.tsx` - iOS only
- ❌ `src/hooks/useWidgetUpdates.ts` - iOS only
- ❌ `src/api/widgets.ts` - iOS only (optional)
- ❌ `ios-widgets/` - iOS native code
- ❌ `e2e/` - Detox tests (rewrite for Cypress)
- ❌ `.detoxrc.json` - Detox config
- ❌ `app.json` - Expo config
- ❌ `babel.config.js` - Expo/React Native
- ❌ `eas.json` - Expo config

---

## Success Metrics

After completing migration, you should have:

- [ ] All 30 API endpoints working
- [ ] Auth flow (login, register, logout)
- [ ] All 32 feature pages accessible
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Working payments with Stripe
- [ ] i18n working (EN, TR)
- [ ] Dark cosmic theme consistent
- [ ] Basic unit tests passing
- [ ] E2E tests with Cypress passing
- [ ] Performance score > 80 on Lighthouse

