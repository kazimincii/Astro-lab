# 🧪 DAY 4: E2E TESTING SETUP & EXECUTION

**Duration:** 4-6 hours  
**Owner:** QA Engineer  
**Prerequisite:** Days 1-3 completed successfully  

---

## 🎯 DAY 4 OBJECTIVES

- [ ] Install Detox CLI locally
- [ ] Build test framework cache
- [ ] Run all 40+ E2E tests
- [ ] Generate test reports
- [ ] Debug any failing tests
- [ ] Verify all tests passing
- [ ] Ready for production build

---

## 📋 PREREQUISITES CHECK

```bash
# Verify environment
node --version      # Should be v18+
npm --version       # Should be v9+
pwd                 # Should show: Astro-lab

# Verify on correct branch
git branch          # Should show: * feature/claude-haiku-impl

# Check package.json has Detox
cat astrology-app/mobile/package.json | grep -A 3 '"detox"'
# Should show detox entries
```

---

## Phase 1: Install Detox CLI (10 minutes)

### Step 1: Install Global Detox CLI

```bash
# Install Detox command-line tool globally
npm install -g detox-cli

# Verify installation
detox --version
# Should show: detox-cli/X.X.X
```

### Step 2: Navigate to Mobile App

```bash
# Go to mobile app directory
cd astrology-app/mobile

# Verify you're in right place
ls -la
# Should show: package.json, app.json, src/, e2e/, etc.
```

### Step 3: Install Project Dependencies

```bash
# Install all npm dependencies
npm install

# This may take 2-3 minutes
# Wait for completion message
```

**Expected Output:**
```
added X packages, Y vulnerabilities fixed
npm notice 
npm notice new major version available: ...
```

---

## Phase 2: Build Detox Framework (20 minutes)

### Step 1: Build Test Framework Cache

```bash
# Build Detox framework for iOS simulator
npm run detox:build:ios

# This creates framework cache
# Takes 5-10 minutes
# Builds Detox matchers and actions

# Expected output:
# ✓ iOS framework built successfully
# ✓ Test environment ready
```

### Step 2: Verify Build Successful

```bash
# Check if build artifacts exist
ls -la node_modules/detox-framework/

# Should show framework files (may be in different location depending on version)
# If errors, check Detox docs or run again
```

**If Build Fails:**
```bash
# Clean and rebuild
rm -rf node_modules/.detox
npm run detox:build:ios

# Or try individual steps:
detox build-framework-cache
detox build-app-cache --configuration ios.sim.release
```

---

## Phase 3: Run E2E Tests (30-45 minutes)

### Step 1: Run All Tests

```bash
# Run the full E2E test suite
npm run detox:test

# This will:
# 1. Launch iPhone simulator
# 2. Install app on simulator
# 3. Run all test files
# 4. Generate results
# Duration: 30-45 minutes

# Watch the output:
# PASS e2e/auth.e2e.test.ts
# PASS e2e/subscriptions.e2e.test.ts
# PASS e2e/features.e2e.test.ts
```

### Step 2: Monitor Test Execution

During test run, you'll see:

```
Test Progress:
✓ Authentication tests (6 tests)
  ├─ New user registration
  ├─ Invalid email validation
  ├─ Mismatched passwords
  ├─ User login
  ├─ Invalid credentials
  └─ Logout

✓ Subscription tests (5 tests)
  ├─ Trial period
  ├─ Plan upgrade
  ├─ Payment processing
  ├─ Premium limits
  └─ Cancellation

✓ Feature tests (12+ tests)
  ├─ Horoscope display
  ├─ Birth chart
  ├─ Tarot reading
  ├─ Profile management
  ├─ Navigation
  └─ ... more tests
```

### Step 3: Wait for Completion

```
Expected final output:
Test Suites: 3 passed, 3 total
Tests: 40+ passed, 40+ total
Snapshots: 0 total
Time: X.XXs

✓ All tests passed successfully!
```

---

## Phase 4: Handle Test Failures (Variable time)

### If Tests Fail

**First, check the failure message:**

```bash
# Read the error output carefully
# Look for line: "● Test Suites: 2 failed, 3 total"
# Shows which test file failed

# Common issues:

1. Element not found
   → Test ID might not be in component
   → Check src/ files for testID={...}
   → Update component if needed

2. Timeout waiting for element
   → App might be slow
   → Increase timeout in test
   → Check for performance issues

3. Detox command error
   → Simulator might have crashed
   → Restart simulator
   → Rebuild framework: npm run detox:build:ios

4. Network/API error
   → Mock API might not be configured
   → Check e2e/setup.ts
   → Verify mocks are loaded
```

### Debugging Failed Tests

```bash
# Run single failing test for debugging
npm run detox:test:single -- e2e/auth.e2e.test.ts

# This runs only that test file
# Easier to debug than running all tests

# Or run with watch mode
npm run detox:test:watch

# Re-runs tests on file changes
# Useful for development
```

### Fix Test Issues

```bash
# If test needs testID added to component:
# 1. Open: astrology-app/mobile/src/screens/[ScreenName].tsx
# 2. Find the element that test is looking for
# 3. Add: testID="element-id"
# 4. Save file
# 5. Re-run tests

# Example:
// Before:
<TouchableOpacity>
  <Text>Login</Text>
</TouchableOpacity>

// After:
<TouchableOpacity testID="login-button">
  <Text>Login</Text>
</TouchableOpacity>
```

---

## Phase 5: Generate Test Reports (10 minutes)

### Step 1: Create Test Summary

```bash
# Generate test report
npm run detox:report

# Creates report file with:
# - Total tests run
# - Pass/fail count
# - Test execution time
# - Failures details
```

### Step 2: Review Test Coverage

```bash
# Check what tests covered
cat detox-results/report.json

# Should show:
# {
#   "testSuites": 3,
#   "tests": 40+,
#   "passed": 40+,
#   "failed": 0,
#   "duration": "XXXs"
# }
```

### Step 3: Document Results

```bash
# Create test results file
cat > TEST_RESULTS.md << 'EOF'
# E2E Test Results - Day 4

**Date:** [Today]
**Status:** ✅ All tests passed
**Test Count:** 40+
**Pass Rate:** 100%
**Duration:** ~40 minutes

## Test Breakdown
- Authentication: 6 tests ✅
- Subscriptions: 5 tests ✅
- Features: 12+ tests ✅

## Environment
- Detox: X.X.X
- Node: vX.X.X
- npm: X.X.X

## Ready for Day 5: Production Build
EOF
```

---

## Phase 6: Final Verification (15 minutes)

### Checklist: All Tests Passing?

```
BEFORE MOVING ON:
☑ All test files run without errors
☑ 40+ tests executed successfully
☑ Test pass rate is 100%
☑ No timeout errors
☑ No element not found errors
☑ Test report generated
☑ Screenshots captured (if enabled)
☑ No warnings in console
```

### If Any Test Still Failing

```
DO NOT proceed to Day 5 if tests failing!

Instead:
1. Identify which test is failing
2. Read error message carefully
3. Check test file: e2e/[filename].test.ts
4. Verify component has correct testID
5. Run single test again to verify fix
6. Once fixed, run full suite again
7. Confirm 100% pass rate
```

---

## 🚀 Run Tests One More Time

### Final Confidence Run

```bash
# One final complete test run
npm run detox:test

# Should see:
✓ All test suites passed
✓ All tests passed
✓ No warnings
✓ Ready for production
```

---

## ✅ Day 4 Complete Checklist

```
Phase 1: Detox CLI Installed
☑ detox-cli installed globally
☑ detox --version works
☑ npm dependencies installed

Phase 2: Framework Built
☑ detox:build:ios successful
☑ Framework cache created
☑ No build errors

Phase 3: Tests Executed
☑ All 40+ tests ran
☑ 100% pass rate
☑ No test timeouts
☑ No element errors

Phase 4: Failures Handled
☑ All tests now passing
☑ No unresolved issues
☑ Debugging complete

Phase 5: Reports Generated
☑ Test report created
☑ Coverage documented
☑ Results saved

Phase 6: Final Verification
☑ Comprehensive checklist complete
☑ All success criteria met
☑ Ready for Day 5
```

**Time Spent:** 4-6 hours ✅

---

## 📞 TROUBLESHOOTING

### Detox CLI Not Installing
```bash
# Try with sudo
sudo npm install -g detox-cli

# Or use npx instead of detox command
npx detox build-framework-cache
npx detox build-app-cache --configuration ios.sim.release
npx detox test e2e --configuration ios.sim.release
```

### Simulator Not Launching
```bash
# Check if simulator is running
xcrun simctl list devices

# Kill simulator
killall "Simulator"

# Relaunch
open /Applications/Simulator.app

# Rebuild and try again
npm run detox:build:ios
npm run detox:test
```

### Tests Timing Out
```bash
# Increase timeout in jest-e2e.json
// Change: "testTimeout": 120000 (to 300000 for 5 min)

# Or skip slow test temporarily
// In test file, change: it('...') to it.skip('...')
// Then run again to skip that test
```

### App Crashes During Testing
```bash
# Check simulator logs
log stream --predicate 'eventMessage contains[cd] "astrology"'

# Rebuild app cache
detox build-app-cache --configuration ios.sim.release --clean

# Try again
npm run detox:test
```

---

## 🎉 READY FOR PRODUCTION BUILD!

Once Day 4 is complete:

```
✅ All 40+ E2E tests passing
✅ Test infrastructure verified
✅ Ready for Day 5: Production Build

Next Phase: Days 5-6 (Production Build & TestFlight)
Duration: 6-8 hours
Owner: DevOps Engineer
```

---

**Expected Completion:** By end of Day 4  
**Status When Done:** Ready for Day 5 Production Build ✅
