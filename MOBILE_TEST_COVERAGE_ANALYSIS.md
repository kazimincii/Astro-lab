# Mobile App Structure Analysis Report
**Location:** `/home/user/Astro-lab/astrology-app/mobile/src`  
**Analysis Date:** November 17, 2025  
**Test Framework Detected:** Jest + React Testing Library

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Source Files** | 69 |
| **Test Files** | 11 |
| **Overall Coverage** | 16% (11/69) |
| **Untested Modules** | 58 files (84%) |
| **Critical Gap** | Main screens have 0% test coverage |

---

## Detailed Directory Analysis

### 1. API Module `/api` 
**Priority: CRITICAL**

**Overview:** 27 API integration files handling all backend communication

| Metric | Count |
|--------|-------|
| Files | 27 |
| With Tests | 10 (37%) |
| Missing Tests | 17 (63%) |

**Files WITH Tests:**
- ✓ actions.test.ts (actions.ts)
- ✓ auth.test.ts (auth.ts)
- ✓ biorhythm.test.ts (biorhythm.ts)
- ✓ chakras.test.ts (chakras.ts)
- ✓ numerology.test.ts (numerology.ts)
- ✓ payments.test.ts (payments.ts)
- ✓ profiles.test.ts (profiles.ts)
- ✓ subscriptions.test.ts (subscriptions.ts)
- ✓ tarot.test.ts (tarot.ts)
- ✓ trials.test.ts (trials.ts)

**Files MISSING Tests (17):**
- advancedCharts.ts
- astroMap.ts
- auraScan.ts
- calendars.ts
- client.ts (HTTP client - critical!)
- coffeeReading.ts
- cosmicClimate.ts
- education.ts
- famousPeople.ts
- forecasts.ts
- index.ts (barrel export - critical!)
- journal.ts
- liveServices.ts
- relationship.ts
- soulmate.ts
- today.ts
- widgets.ts

**Key Gaps:** API client and index files lack tests

---

### 2. Main Screens `/screens/main`
**Priority: CRITICAL**

**Overview:** 26 full-featured screen components with complex UI logic

| Metric | Count |
|--------|-------|
| Files | 26 |
| With Tests | 0 (0%) |
| Missing Tests | 26 (100%) |

**ALL Files Missing Tests:**
- AIAssistantScreen.tsx
- AdvancedChartsScreen.tsx
- AstroMapScreen.tsx
- AuraScanScreen.tsx
- BiorhythmScreen.tsx
- BirthChartDetailScreen.tsx
- CalendarsScreen.tsx
- ChakrasScreen.tsx
- ChartTypeDetailScreen.tsx
- CoffeeReadingScreen.tsx
- CosmicClimateScreen.tsx
- EducationArticleScreen.tsx
- EducationScreen.tsx
- ExploreScreen.tsx
- FamousPeopleScreen.tsx
- ForecastsScreen.tsx
- JournalScreen.tsx
- LiveServicesScreen.tsx
- MyPlanScreen.tsx
- NumerologyScreen.tsx
- ProfilesScreen.tsx
- RelationshipSoulmateScreen.tsx
- SettingsScreen.tsx
- TarotScreen.tsx
- TodayScreen.tsx
- WidgetsScreen.tsx

**Impact:** No user interface testing whatsoever

---

### 3. Components `/components`
**Priority: HIGH**

**Overview:** 7 reusable UI components used throughout the app

| Metric | Count |
|--------|-------|
| Files | 7 |
| With Tests | 1 (14%) |
| Missing Tests | 6 (86%) |

**Files WITH Tests:**
- ✓ ProfileSelector.test.tsx (ProfileSelector.tsx) - Uses jest mocks for ProfileContext

**Files MISSING Tests (6):**
- ActionLimitModal.tsx
- ActionsCounter.tsx
- ChartWheel.tsx (complex charting component)
- MembershipCard.tsx
- PaymentSheet.tsx (payment critical!)
- TarotCard.tsx

**Key Gaps:** Payment and modal components lack tests

---

### 4. Auth Screens `/screens/auth`
**Priority: HIGH**

**Overview:** 6 authentication flow screens

| Metric | Count |
|--------|-------|
| Files | 6 |
| With Tests | 1 (17%) |
| Missing Tests | 5 (83%) |

**Files WITH Tests:**
- ✓ LoginScreen.test.tsx (LoginScreen.tsx)

**Files MISSING Tests (5):**
- ForgotPasswordScreen.tsx
- OnboardingScreen.tsx
- RegisterScreen.tsx
- ResetPasswordScreen.tsx
- WelcomeScreen.tsx

**Impact:** 83% of auth flow untested

---

### 5. Navigation `/navigation`
**Priority: MEDIUM**

**Overview:** 4 React Navigation stack configurators

| Metric | Count |
|--------|-------|
| Files | 4 |
| With Tests | 0 (0%) |
| Missing Tests | 4 (100%) |

**Files MISSING Tests:**
- AuthNavigator.tsx
- ExploreNavigator.tsx (complex nested navigation)
- MainNavigator.tsx
- RootNavigator.tsx

---

### 6. Hooks `/hooks`
**Priority: MEDIUM**

**Overview:** Custom React hooks

| Metric | Count |
|--------|-------|
| Files | 1 |
| With Tests | 0 (0%) |
| Missing Tests | 1 (100%) |

**Files MISSING Tests:**
- useWidgetUpdates.ts

---

### 7. Services `/services`
**Priority: MEDIUM**

**Overview:** Business logic services

| Metric | Count |
|--------|-------|
| Files | 1 |
| With Tests | 0 (0%) |
| Missing Tests | 1 (100%) |

**Files MISSING Tests:**
- widgetService.ts

---

### 8. Store `/store`
**Priority: MEDIUM**

**Overview:** State management (likely Zustand/Redux)

| Metric | Count |
|--------|-------|
| Files | 1 |
| With Tests | 0 (0%) |
| Missing Tests | 1 (100%) |

**Files MISSING Tests:**
- authStore.ts

---

### 9. Contexts `/contexts`
**Priority: LOW-MEDIUM**

**Overview:** React Context providers

| Metric | Count |
|--------|-------|
| Files | 1 |
| With Tests | 0 (0%) |
| Missing Tests | 1 (100%) |

**Files MISSING Tests:**
- ProfileContext.tsx (used by ProfileSelector tests)

---

### 10. Config `/config`
**Priority: MEDIUM**

**Overview:** Configuration files

| Metric | Count |
|--------|-------|
| Files | 1 |
| With Tests | 0 (0%) |
| Missing Tests | 1 (100%) |

**Files MISSING Tests:**
- stripe.ts (payment integration!)

---

### 11. Types `/types`
**Priority: LOW** *(Type definitions don't typically need tests)*

**Overview:** TypeScript type definitions

| Metric | Count |
|--------|-------|
| Files | 2 |
| With Tests | N/A |
| Notes | Type definitions typically not tested |

**Files:**
- navigation.ts
- widgets.d.ts

---

### 12. Theme `/theme`
**Priority: LOW** *(Style configs don't typically need tests)*

**Overview:** Styling constants and theme configuration

| Metric | Count |
|--------|-------|
| Files | 1 |
| With Tests | N/A |
| Notes | Theme/style files typically not tested |

**Files:**
- colors.ts

---

## Test Coverage Matrix by Category

```
┌─────────────────────┬──────┬───────┬──────────┬────────────┐
│ Category            │Total │Tests  │Coverage  │Testability│
├─────────────────────┼──────┼───────┼──────────┼────────────┤
│ API Integration     │  27  │  10   │   37%    │   High     │
│ Main Screens        │  26  │   0   │    0%    │   High     │
│ Components          │   7  │   1   │   14%    │   High     │
│ Auth Screens        │   6  │   1   │   17%    │   High     │
│ Navigation          │   4  │   0   │    0%    │  Medium    │
│ Services/Hooks/Store│   3  │   0   │    0%    │   High     │
│ Contexts            │   1  │   0   │    0%    │   High     │
│ Config              │   1  │   0   │    0%    │  Medium    │
│ Types (N/A)         │   2  │  N/A  │   N/A    │    N/A     │
│ Theme (N/A)         │   1  │  N/A  │   N/A    │    N/A     │
├─────────────────────┼──────┼───────┼──────────┼────────────┤
│ TOTAL               │  69  │  11   │   16%    │    High    │
└─────────────────────┴──────┴───────┴──────────┴────────────┘
```

---

## Critical Test Gaps - Priority Order

### 🔴 **TIER 1 - Critical (26 items)**
1. **Main Screens (26 files)** - 0% coverage
   - User-facing features with complex logic
   - No integration tests between screens and API

### 🟠 **TIER 2 - High Priority (15 items)**
2. **Untested API Modules (17 files)**
   - `client.ts` - HTTP client (foundation!)
   - `index.ts` - Barrel export
   - Payment-related: `payments.ts` already tested, but `liveServices.ts` not
   - Feature APIs: advanced charts, astro map, aura scan, etc.

3. **Components (6 files)**
   - `PaymentSheet.tsx` - Payment critical
   - `ChartWheel.tsx` - Complex visualization
   - Modal components for user interactions

### 🟡 **TIER 3 - Medium Priority (10 items)**
4. **Auth Screens (5 files)** - Only LoginScreen tested
5. **Navigation (4 files)** - No navigation testing
6. **Business Logic (3 files)** - Services, Hooks, Store

---

## Testing Patterns Observed

**Test Framework:** Jest + React Testing Library

**API Tests Pattern:**
```typescript
// Mock dependencies
jest.mock('../client');

describe('featureApi', () => {
  beforeEach(() => jest.clearAllMocks());
  
  it('should handle request successfully', async () => {
    // Mock response
    const mockResponse = { /* data */ };
    // Assert API behavior
  });
});
```

**Component Tests Pattern:**
```typescript
jest.mock('@/contexts/ProfileContext');
jest.mock('@tanstack/react-query');

describe('ProfileSelector', () => {
  it('should render profiles', () => {
    const { getByText } = render(<ProfileSelector />);
    expect(getByText('profile name')).toBeTruthy();
  });
});
```

---

## Recommendations

### Immediate Actions (Week 1)
1. Add tests for `api/client.ts` - foundation for all API calls
2. Create tests for payment-related components (PaymentSheet, stripe config)
3. Add tests for 3-5 most critical main screens (TodayScreen, ProfilesScreen, etc.)

### Short Term (Weeks 2-4)
1. Increase API test coverage from 37% to 100%
2. Test all Auth screens (add 5 more tests)
3. Create integration tests linking screens to API calls

### Medium Term (Month 2)
1. Achieve 50%+ coverage on main screens
2. Test all navigation flows
3. Add tests for services, hooks, and store

### Long Term (Months 3+)
1. Target 80%+ overall coverage
2. Implement E2E tests with Detox or Playwright
3. Add visual regression testing for charts/cards

---

## Summary Statistics

**Testing Coverage by Importance:**
- Critical Path: 19% (11/59 files in API + Screens)
- Medium Priority: 10% (1/10 in Components + Services)
- Low Priority: 0% (0/5 in Navigation + Contexts)

**Suggested Test Writing Priority:**
1. Main Screens: 26 files
2. API Modules: 17 files
3. Components: 6 files
4. Auth Screens: 5 files
5. Navigation: 4 files
6. Remaining: 4 files

