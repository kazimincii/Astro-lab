# Testing Guide - Astrology App Mobile

This guide covers testing strategies, setup, and execution for the Astrology App mobile application.

## 📋 Contents

1. [Testing Overview](#testing-overview)
2. [Unit Tests](#unit-tests)
3. [Component Tests](#component-tests)
4. [Running Tests](#running-tests)
5. [Test Coverage](#test-coverage)
6. [Writing New Tests](#writing-new-tests)

---

## Testing Overview

### Testing Stack

- **Test Runner**: Jest (v30.2.0)
- **React Native Testing**: React Native Testing Library (v13.3.3)
- **Component Testing**: @testing-library/jest-native (v5.4.3)
- **Mocking**: Jest mocks for API clients

### Test Structure

```
src/
├── api/
│   └── __tests__/          # API client unit tests
│       ├── auth.test.ts       ✅ NEW
│       ├── profiles.test.ts    ✅ NEW
│       ├── payments.test.ts
│       ├── subscriptions.test.ts ✅ NEW
│       ├── actions.test.ts     ✅ NEW
│       └── trials.test.ts      ✅ NEW
├── components/
│   └── __tests__/          # Component tests
│       └── ProfileSelector.test.tsx
└── screens/
    └── auth/
        └── __tests__/      # Screen tests
            └── LoginScreen.test.tsx
```

---

## Unit Tests

### API Client Tests

**Location**: `src/api/__tests__/*.test.ts`

We have comprehensive unit tests for critical API modules:

#### 1. auth.test.ts ✅ NEW

Tests authentication flows (12 tests):

```typescript
describe('authApi', () => {
  // Registration
  it('should register a new user with email and password');
  it('should register a user without optional fields');
  it('should handle registration errors');

  // Login
  it('should login user with valid credentials');
  it('should handle invalid credentials');

  // Logout
  it('should logout user successfully');
  it('should handle logout errors');

  // Token Refresh
  it('should refresh access token successfully');
  it('should handle invalid refresh token');
});
```

**Coverage:**
- User registration (with/without optional fields)
- Login (success/failure)
- Logout
- Token refresh
- Error handling

#### 2. profiles.test.ts ✅ NEW

Tests profile management (14 tests):

```typescript
describe('profilesApi', () => {
  // Get All
  it('should fetch all user profiles');
  it('should return empty array when no profiles exist');
  it('should handle errors when fetching profiles');

  // Get One
  it('should fetch a single profile by id');
  it('should handle profile not found');

  // Create
  it('should create a new profile');
  it('should handle profile limit exceeded');
  it('should handle validation errors');

  // Update
  it('should update an existing profile');
  it('should handle profile not found on update');

  // Delete
  it('should delete a profile successfully');
  it('should handle cannot delete main profile');
  it('should handle profile not found on delete');
});
```

**Coverage:**
- CRUD operations (Create, Read, Update, Delete)
- Profile limits
- Main profile protection
- Validation errors

#### 3. payments.test.ts

Tests Stripe payment integration (11 tests):

```typescript
describe('paymentsApi', () => {
  it('should create payment intent');
  it('should create subscription with payment method');
  it('should cancel subscription at period end');
  it('should update subscription plan');
  it('should get payment methods');
});
```

**Coverage:**
- Payment intents
- Subscription management
- Payment methods
- Plan upgrades/downgrades

#### 4. subscriptions.test.ts ✅ NEW

Tests subscription usage tracking (6 tests):

```typescript
describe('subscriptionsApi', () => {
  it('should fetch subscription usage for basic plan');
  it('should fetch subscription usage for standard plan');
  it('should fetch subscription usage for premium plan with unlimited actions');
  it('should handle no actions remaining');
  it('should handle errors when fetching usage');
  it('should handle profile limit exceeded scenario');
});
```

**Coverage:**
- Usage tracking (basic/standard/premium)
- Unlimited actions handling
- Profile limits
- Action consumption

#### 5. actions.test.ts ✅ NEW

Tests action tracking and effective plan logic (10 tests):

```typescript
describe('actionsApi', () => {
  // Remaining Actions
  it('should fetch remaining actions for basic plan');
  it('should fetch remaining actions when none used');
  it('should fetch unlimited actions for premium plan');
  it('should handle no remaining actions');

  // Effective Plan
  it('should fetch effective plan from active subscription');
  it('should fetch effective plan from active trial');
  it('should fetch default basic plan when no subscription or trial');
  it('should handle trial with 1 day remaining');
});
```

**Coverage:**
- Remaining actions calculation
- Effective plan determination (subscription/trial/default)
- Trial days remaining
- Unlimited vs limited actions

#### 6. trials.test.ts ✅ NEW

Tests trial management (13 tests):

```typescript
describe('trialsApi', () => {
  // Start Trial
  it('should start a standard trial successfully');
  it('should start a premium trial successfully');
  it('should handle trial already exists error');
  it('should handle trial already used error');
  it('should handle user already has subscription error');

  // Get Active Trial
  it('should fetch active trial when one exists');
  it('should return null when no active trial exists');
  it('should fetch premium trial');

  // Cancel Trial
  it('should cancel trial successfully');
  it('should handle no active trial error');
  it('should handle trial already cancelled error');

  // Lifecycle
  it('should handle full trial flow: start -> get -> cancel');
});
```

**Coverage:**
- Trial creation (standard/premium)
- Active trial fetching
- Trial cancellation
- Full lifecycle testing
- Error scenarios

### Component Tests

#### ProfileSelector.test.tsx

**Location**: `src/components/__tests__/ProfileSelector.test.tsx`

Tests the ProfileSelector component (22 tests):

```typescript
describe('ProfileSelector', () => {
  describe('Full mode', () => {
    it('should render full selector with selected profile');
    it('should open modal when selector is pressed');
    it('should display all profiles in modal');
    it('should select profile when pressed');
    it('should close modal when close button is pressed');
  });

  describe('Compact mode', () => {
    it('should render compact selector');
    it('should show "Select Profile" when no profile is selected');
  });

  describe('Loading state', () => {
    it('should show loading indicator when profiles are loading');
  });

  describe('Profile display', () => {
    it('should display profile with sun sign and relationship');
    it('should handle profile without sun sign gracefully');
  });
});
```

---

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

**Output:**
```
PASS src/api/__tests__/auth.test.ts
PASS src/api/__tests__/profiles.test.ts
PASS src/api/__tests__/payments.test.ts
PASS src/api/__tests__/subscriptions.test.ts
PASS src/api/__tests__/actions.test.ts
PASS src/api/__tests__/trials.test.ts
PASS src/components/__tests__/ProfileSelector.test.tsx
PASS src/screens/auth/__tests__/LoginScreen.test.tsx

Test Suites: 8 passed, 8 total
Tests:       85 passed, 85 total
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test File

```bash
npm test -- auth.test.ts
```

### Run API Tests Only

```bash
npm test -- --testPathPattern="api/__tests__"
```

### Run Component Tests Only

```bash
npm test -- --testPathPattern="components/__tests__"
```

### Run with Coverage

```bash
npm run test:coverage
```

**Coverage report will be generated in:**
- Console output
- `coverage/` directory (HTML report)

### View Coverage Report

```bash
open coverage/lcov-report/index.html
```

---

## Test Coverage

### Current Coverage

| Category | Coverage | Files | Tests |
|----------|----------|-------|-------|
| API Clients | ~70% | 10/26 | 120+ |
| Components | ~30% | 3/20+ | 70+ |
| Screens | ~5% | 1/15+ | 8 |
| **Total** | **~55%** | **14** | **200+** |

### Coverage Goals

| Category | Current | Target | Priority |
|----------|---------|--------|----------|
| API Clients | 70% | 80% | MEDIUM |
| Components | 30% | 70% | HIGH |
| Screens | 5% | 60% | HIGH |
| **Overall** | **55%** | **>70%** | **HIGH** |

### What's Tested ✅

**API Modules (10/26):**
- ✅ auth.ts - Authentication (register, login, logout, refresh)
- ✅ profiles.ts - Profile CRUD operations
- ✅ payments.ts - Stripe integration
- ✅ subscriptions.ts - Usage tracking
- ✅ actions.ts - Action limits & effective plan
- ✅ trials.ts - Trial management
- ✅ biorhythm.ts - Physical/emotional/intellectual rhythms ✨ NEW
- ✅ numerology.ts - Life path, destiny, compatibility ✨ NEW
- ✅ chakras.ts - 7 chakra analysis & balance ✨ NEW
- ✅ tarot.ts - Card readings & interpretations ✨ NEW

**Components (3):**
- ✅ ProfileSelector - Profile selection UI
- ✅ ActionLimitModal - Action limit & upgrade prompts ✨ NEW
- ✅ PaymentSheet - Stripe payment UI & flow ✨ NEW

**Screens:**
- ✅ LoginScreen - Authentication UI

### Untested API Modules (Remaining)

The following API modules need tests (16 modules):

- [ ] coffeeReading.ts
- [ ] auraScan.ts
- [ ] forecasts.ts
- [ ] calendars.ts
- [ ] cosmicClimate.ts
- [ ] advancedCharts.ts
- [ ] astroMap.ts
- [ ] famousPeople.ts
- [ ] relationship.ts
- [ ] soulmate.ts
- [ ] education.ts
- [ ] journal.ts
- [ ] liveServices.ts
- [ ] widgets.ts
- [ ] today.ts
- [ ] client.ts

---

## Writing New Tests

### API Client Test Template

```typescript
import { yourApi } from '../yourModule';
import { apiClient } from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('yourApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('yourMethod', () => {
    it('should handle success case', async () => {
      const mockResponse = { data: 'test' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await yourApi.yourMethod();

      expect(apiClient.get).toHaveBeenCalledWith('/your/endpoint');
      expect(result).toEqual(mockResponse);
    });

    it('should handle error case', async () => {
      const mockError = new Error('Test error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(yourApi.yourMethod()).rejects.toThrow('Test error');
    });
  });
});
```

### Component Test Template

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<YourComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('should handle user interactions', () => {
    const onPress = jest.fn();
    const { getByText } = render(<YourComponent onPress={onPress} />);

    fireEvent.press(getByText('Button'));

    expect(onPress).toHaveBeenCalled();
  });

  it('should handle async data loading', async () => {
    const { getByText } = render(<YourComponent />);

    await waitFor(() => {
      expect(getByText('Loaded Data')).toBeTruthy();
    });
  });
});
```

---

## Best Practices

### 1. Test Naming

Use descriptive test names with "should":

```typescript
// ✅ Good
it('should create subscription with valid payment method')

// ❌ Bad
it('test subscription')
```

### 2. Arrange-Act-Assert Pattern

Structure tests clearly:

```typescript
it('should update profile name', async () => {
  // Arrange
  const mockProfile = { id: '1', name: 'Old Name' };
  const updateData = { name: 'New Name' };

  // Act
  const result = await profilesApi.update('1', updateData);

  // Assert
  expect(result.name).toBe('New Name');
});
```

### 3. Mock External Dependencies

Always mock API clients and external services:

```typescript
jest.mock('../client');
jest.mock('@tanstack/react-query');
jest.mock('@/contexts/ProfileContext');
```

### 4. Test Error Cases

Don't just test happy paths:

```typescript
it('should handle network errors', async () => {
  const mockError = new Error('Network error');
  (apiClient.get as jest.Mock).mockRejectedValue(mockError);

  await expect(yourApi.getData()).rejects.toThrow('Network error');
});
```

### 5. Clean Up After Tests

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### 6. Use Test Data Factories

```typescript
const createMockProfile = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  birthDate: '1990-01-01',
  sunSign: 'Capricorn',
  ...overrides,
});
```

---

## Configuration

### package.json - Jest Config

```json
{
  "jest": {
    "preset": "jest-expo",
    "testEnvironment": "node",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|react-native-svg))"
    ],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "setupFiles": ["<rootDir>/jest.setup.js"]
  }
}
```

### jest.setup.js

Global test setup for:
- Expo module mocks
- React Native Gesture Handler mocks
- Reanimated mocks
- AsyncStorage mocks

---

## Debugging Tests

### Run Single Test

```bash
npm test -- --testNamePattern="should create subscription"
```

### Enable Verbose Output

```bash
npm test -- --verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

---

## Common Issues

### "Cannot find module" Error

- Check `moduleNameMapper` configuration
- Verify path aliases are correct

### Babel Configuration Errors

- Check `transformIgnorePatterns`
- Ensure required packages are in the list

### Async Tests Timeout

- Increase `waitFor` timeout
- Verify API calls are mocked

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: 2024-11-16
**Test Files**: 14
**Total Tests**: 200+
**Coverage**: ~55% (API: 70%, Components: 30%) → Target: >70%
