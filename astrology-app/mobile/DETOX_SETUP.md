# E2E Testing Setup - Detox Guide

## 📱 Detox Installation & Configuration

### ADIM 1: Detox Dependencies Yükle

```bash
cd c:\Users\kazim\Desktop\Astro-lab-main\astrology-app\mobile

# Install Detox CLI
npm install -g detox-cli

# Install Detox dependencies
npm install --save-dev detox detox-cli detox-runtime
```

### ADIM 2: Detox Configuration

**File: `mobile/package.json`**

```json
{
  "detox": {
    "configurations": {
      "ios.sim.release": {
        "device": {
          "type": "iPhone 15 Pro"
        },
        "app": "ios.release"
      }
    },
    "apps": {
      "ios.release": {
        "type": "ios.app",
        "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/AstrologyApp.app",
        "build": "xcodebuild -workspace ios/AstrologyApp.xcworkspace -scheme AstrologyApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build"
      }
    }
  }
}
```

### ADIM 3: Build Test App

```bash
# Build test app for simulator
detox build-framework-cache
detox build-app --configuration ios.sim.release
```

### ADIM 4: Run Tests

```bash
# Run all tests
detox test --configuration ios.sim.release --cleanup

# Run specific test file
detox test e2e/app.e2e.test.ts --configuration ios.sim.release

# Run with video recording
detox test --configuration ios.sim.release --record-logs all
```

---

## 🧪 Test Scenarios

### Authentication Flow
- ✅ Register new user
- ✅ Login existing user
- ✅ Logout
- ✅ Password reset

### Profile Management
- ✅ Create multiple profiles
- ✅ Switch between profiles
- ✅ Update profile info
- ✅ Delete profile

### Feature Navigation
- ✅ Navigate Explore tab
- ✅ Open each screen
- ✅ Navigate back
- ✅ Deep linking

### Subscription & Payment
- ✅ Start free trial
- ✅ Upgrade to premium
- ✅ Manage subscription

### Error Handling
- ✅ Network errors
- ✅ Session expiration
- ✅ Invalid input

---

## 📝 Test Files Location

```
e2e/
├── app.e2e.test.ts (1000+ lines, 8+ scenarios)
├── auth.e2e.test.ts (Authentication flow tests)
├── profiles.e2e.test.ts (Profile management)
├── features.e2e.test.ts (Feature navigation)
└── payment.e2e.test.ts (Payment & subscription)
```

---

## ✅ Success Metrics

- ✅ All tests pass
- ✅ No crashes during tests
- ✅ Average test duration < 60s
- ✅ Network handling works
- ✅ Navigation smooth

---

## 🚀 Running Full Test Suite

```bash
# Full test run with all scenarios
npm run test:e2e

# Watch mode (auto re-run on changes)
detox test --configuration ios.sim.release --cleanup --cleanup

# Generate report
detox test --configuration ios.sim.release --record-logs all --record-logs screenshots
```

---

**Estimated Time:** 4-6 hours (setup + test execution)
**Status:** Ready to configure
