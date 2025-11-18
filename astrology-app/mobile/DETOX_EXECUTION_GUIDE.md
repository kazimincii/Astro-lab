# Detox E2E Testing - Implementation Guide

## ✅ Başarıyla Oluşturulan Dosyalar

```
✅ e2e/auth.e2e.test.ts (150+ lines)
✅ e2e/subscriptions.e2e.test.ts (300+ lines)
✅ e2e/features.e2e.test.ts (450+ lines)
✅ detox.config.js (Detox configuration)
✅ jest-e2e.json (Jest configuration)
✅ .detoxrc.json (Detox runner config)
✅ scripts/setup-detox.sh (Installation script)
```

**Total Test Scenarios:** 40+ tests covering 6 categories

---

## 🎯 Installation & Setup Steps

### Adım 1: Detox Packages'ı Install Et

```bash
cd astrology-app/mobile

# Option 1: Manual installation
npm install --save-dev detox detox-cli detox-test-utils

# Option 2: Script ile (eğer bash varsa)
bash scripts/setup-detox.sh
```

**Beklenen sonuç:**
```
✅ detox@latest installed
✅ detox-cli available globally
✅ Test dependencies installed
```

---

### Adım 2: Test IDs'i App'e Ekle

Her test element'e `testID` prop'u ekle. Örnek:

```typescript
// Before
<Button onPress={handleLogin}>Login</Button>

// After
<Button testID="login-submit-btn" onPress={handleLogin}>Login</Button>
```

**Gerekli test IDs:**
```
# Auth Screen
- auth-login-tab
- auth-register-tab
- login-email-input
- login-password-input
- login-submit-btn
- register-email-input
- register-password-input
- register-confirm-input
- register-submit-btn

# Home Tabs
- today-tab
- explore-tab
- profiles-tab
- settings-tab

# Today Screen
- horoscope-card
- zodiac-sign
- horoscope-text
- lucky-numbers
- moon-phase-card
- biorhythm-chart

# Features
- birth-chart-btn
- tarot-btn
- numerology-btn
- chakras-btn
- education-btn

# Settings
- dark-mode-toggle
- language-select
- account-section

# And more (see e2e test files for complete list)
```

---

### Adım 3: Build Framework Cache

```bash
# macOS'ta çalıştır (Windows'ta cross-compile gerekli)
cd ios
xcodebuild -workspace AstrologyApp.xcworkspace \
  -scheme AstrologyApp \
  -configuration Release \
  -derivedDataPath ./build \
  -arch x86_64 \
  -sdk iphonesimulator
```

**Ya da script kullan:**
```bash
npm run detox:build:ios
```

---

### Adım 4: Detox Test'leri Çalıştır

#### Full Test Suite
```bash
npm run detox:test
```

#### Single Test File
```bash
npm run detox:test:single
```

#### Watch Mode (continuous)
```bash
npm run detox:test:watch
```

#### With Logging
```bash
detox test e2e --configuration ios.sim.release --cleanup --record-logs all
```

---

## 📊 Test Scenarios Overview

### Category 1: Authentication (6 tests)
```
✅ New user registration
✅ Invalid email validation
✅ Mismatched password validation
✅ Registered user login
✅ Invalid credentials error
✅ Logout from settings
```

### Category 2: Trial & Subscriptions (5 tests)
```
✅ Start free trial
✅ Trial countdown display
✅ Plan upgrade to Premium
✅ Payment failure handling
✅ Subscription cancellation
```

### Category 3: Features & Navigation (12 tests)
```
✅ Daily horoscope display
✅ Moon phase widget
✅ Biorhythm chart
✅ Birth chart analysis
✅ Tarot reading flow
✅ All explore screens navigation
✅ Profile creation
✅ Profile switching
✅ Language change
✅ Dark mode toggle
✅ Deep linking
✅ Network error handling
```

### Category 4: Premium Features (3 tests)
```
✅ Free user action limit
✅ Premium unlimited actions
✅ Billing details view
```

### Category 5: Settings (3 tests)
```
✅ Language switching
✅ Dark mode toggle
✅ Privacy policy & terms
```

### Category 6: Error Handling (2 tests)
```
✅ Network error with retry
✅ Session expiration prompt
```

---

## 🔧 Detox Commands Reference

```bash
# Build
npm run detox:build                    # Build framework cache
npm run detox:build:ios                # Build iOS app

# Test
npm run detox:test                     # Run all tests
npm run detox:test:watch               # Run with logging
npm run detox:test:single              # Run single file
npm run detox:report                   # Generate report

# Manual Detox commands
detox init -r ios                      # Initialize Detox
detox clean-framework-cache            # Clear cache
detox build-framework-cache            # Rebuild cache
detox test-summary                     # Generate summary
```

---

## 📝 Adding New Tests

### Template for new test
```typescript
describe('Feature Name', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test('Test description', async () => {
    // Arrange - Setup
    await element(by.id('element-id')).tap();

    // Act - Perform action
    await element(by.id('input-id')).typeText('text');

    // Assert - Verify result
    await expect(element(by.id('result-id'))).toBeVisible();
  });
});
```

### Common Detox methods
```typescript
// Element interaction
element(by.id('id')).tap()
element(by.text('text')).tap()
element(by.label('label')).tap()
element(by.id('id')).typeText('text')
element(by.id('id')).clearText()

// Assertions
expect(element(...)).toBeVisible()
expect(element(...)).toExist()
expect(element(...)).toHaveText('text')
expect(element(...)).toHaveToggleValue(true)

// Waits
await waitFor(element(...)).toBeVisible().withTimeout(5000)
await element(...).waitForRemoved(withTimeout(5000))

// Device
device.launchApp()
device.reloadReactNative()
device.setAirplaneMode(true)
device.openURL({ url: 'scheme://path' })
```

---

## 🐛 Troubleshooting

### "Framework cache not found"
```bash
# Rebuild cache
npm run detox:build:ios

# Or manually
detox build-framework-cache
```

### "Build directory not found"
```bash
# Check Xcode build path
xcodebuild -workspace ios/AstrologyApp.xcworkspace \
  -scheme AstrologyApp \
  -configuration Release \
  -derivedDataPath artifacts/build \
  -arch x86_64 \
  -sdk iphonesimulator \
  -ShowBuildSettings | grep CONFIGURATION_BUILD_DIR
```

### "Tests timeout"
```bash
# Increase timeout in jest-e2e.json
{
  "testTimeout": 180000  // 3 minutes instead of 2
}
```

### "Element not found"
1. Check testID in component
2. Verify element is visible (not hidden/off-screen)
3. Wait for element: `await waitFor(element(...)).toBeVisible()`
4. Check selector syntax: `by.id()`, `by.text()`, `by.label()`

### "Simulator not responding"
```bash
# Reset simulator
xcrun simctl erase all

# Or kill simulator
killall com.apple.CoreSimulator.CoreSimulatorService
```

---

## ✅ Test Execution Checklist

- [ ] All testIDs added to components
- [ ] Detox packages installed (`npm ls detox`)
- [ ] Build cache created (`npm run detox:build:ios`)
- [ ] Test files created and valid
- [ ] Configuration files in place (.detoxrc.json, jest-e2e.json)
- [ ] Package.json scripts updated
- [ ] Test run locally successful
- [ ] CI/CD integration (GitHub Actions)

---

## 🚀 CI/CD Integration Example

### GitHub Actions workflow
```yaml
name: Detox E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Detox
        run: npm run detox:build:ios
      
      - name: Run tests
        run: npm run detox:test
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: detox-results
          path: artifacts/
```

---

## 📊 Expected Test Results

```
PASS  e2e/auth.e2e.test.ts (15s)
  Authentication
    ✓ New user registration (5s)
    ✓ Invalid email validation (2s)
    ✓ Registered user login (4s)

PASS  e2e/subscriptions.e2e.test.ts (45s)
  Subscriptions
    ✓ Start free trial (8s)
    ✓ Plan upgrade (12s)
    ✓ Premium features (15s)

PASS  e2e/features.e2e.test.ts (60s)
  Features
    ✓ Daily horoscope (5s)
    ✓ Birth chart analysis (8s)
    ✓ Profile switching (6s)
    ... (9 more tests)

Test Suites: 3 passed, 3 total
Tests:       40 passed, 40 total
Time:        2m 15s
```

---

## 📞 Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Jest Testing](https://jestjs.io/)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Expo Testing](https://docs.expo.dev/build-reference/how-tos/#testing)

---

**Status:** ✅ Ready for Detox setup
**Estimated Time:** 2-4 hours (setup + initial test runs)
**Device Required:** macOS (for iOS build)

