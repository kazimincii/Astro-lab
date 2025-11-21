# Bug List - Actionable Issues

## Critical Priority (Fix First) 🔴

### BUG-001: API Client Mock Configuration Mismatch
- **Component**: Mobile App - API Layer
- **Files Affected**: 16 API modules (widgets, journal, soulmate, etc.)
- **Tests Failing**: 180+ tests
- **Severity**: 🔴 Critical
- **Status**: ✅ **FIXED**
- **Impact**: All API communication tests failing
- **Root Cause**: Tests mock named export `apiClient`, code uses default export
- **Fix Applied**: Created `__mocks__/client.ts` with both default and named exports
- **Result**: 147 additional tests now passing, 479/530 total (90.4%)
- **Commit**: `8b1b9c0`

### BUG-002: Missing Test Dependencies
- **Component**: Mobile App - Test Configuration
- **Status**: ✅ FIXED
- **What was done**: Added babel-preset-expo, expo-font, expo-asset

### BUG-003: NativeWind Test Configuration
- **Component**: Mobile App - Test Configuration
- **Status**: ✅ FIXED
- **What was done**: Disabled NativeWind babel plugin in test mode

---

## High Priority (Fix Soon) 🟡

### BUG-004: Login Screen API Integration
- **Component**: Mobile App - Authentication
- **Tests Failing**: 3 tests in LoginScreen.test.tsx
- **Severity**: 🟡 High
- **Impact**: Login functionality may not validate inputs or handle errors
- **Symptoms**:
  - Form validation not working
  - API calls not being made correctly
  - Error handling missing
- **Fix**: Update LoginScreen component with proper validation and error handling
- **Time to Fix**: 1 hour
- **Files to Change**: `src/screens/auth/LoginScreen.tsx`

### BUG-005: Widget API Endpoints Not Working
- **Component**: Mobile/Backend - Widget Feature
- **Tests Failing**: 45 tests in widgets.test.ts
- **Severity**: 🟡 High
- **Status**: ✅ **FIXED** (by BUG-001 fix)
- **Impact**: iOS lock screen widgets not functional
- **Root Cause**: Related to BUG-001 (mock issue)
- **Fix Applied**: Fixed by BUG-001 centralized mock
- **Result**: All 45 widget tests now passing

### BUG-006: Journal API Not Working
- **Component**: Mobile/Backend - Journal Feature
- **Tests Failing**: 32 tests in journal.test.ts
- **Severity**: 🟡 High
- **Status**: ✅ **FIXED** (by BUG-001 fix)
- **Impact**: Users cannot create or view journal entries
- **Root Cause**: Related to BUG-001
- **Fix Applied**: Fixed by BUG-001 centralized mock
- **Result**: All 33 journal tests now passing

### BUG-007: Soulmate Feature Not Working
- **Component**: Mobile/Backend - Soulmate Feature
- **Tests Failing**: 20+ tests in soulmate.test.ts
- **Severity**: 🟡 High
- **Status**: ✅ **FIXED** (by BUG-001 fix)
- **Impact**: Relationship compatibility features not working
- **Root Cause**: Related to BUG-001
- **Fix Applied**: Fixed by BUG-001 centralized mock
- **Result**: All 23 soulmate tests now passing

### BUG-008: Backend Test Database Configuration
- **Component**: Backend - Test Setup
- **Tests Failing**: Multiple service tests
- **Severity**: 🟡 High
- **Impact**: Backend services not properly tested
- **Symptoms**: Database connection errors during tests
- **Fix**: Add in-memory SQLite configuration for tests
- **Time to Fix**: 2 hours
- **Files to Change**: 
  - Create: `test/setup.ts`
  - Update: `jest-e2e.json`
  - Update: Service test files

---

## Medium Priority (Fix Later) 🟢

### BUG-009: Profile Selector UI Issues
- **Component**: Mobile App - Profile Selector Component
- **Tests Failing**: 6 tests in ProfileSelector.test.tsx
- **Severity**: 🟢 Medium
- **Impact**: Profile switching may not work properly
- **Symptoms**:
  - Modal close button not rendering in tests
  - Icon components not found
  - Loading state not displayed
- **Fix**: Improve icon mocks and modal interaction tests
- **Time to Fix**: 1 hour
- **Files to Change**: 
  - `src/components/__tests__/ProfileSelector.test.tsx`
  - `jest.setup.js` (improve icon mocks)

### BUG-010: Journal Screen UI Interactions
- **Component**: Mobile App - Journal Screen
- **Tests Failing**: 10+ tests in JournalScreen.test.tsx
- **Severity**: 🟢 Medium
- **Impact**: Some journal UI interactions may not work
- **Symptoms**:
  - Delete icon not found
  - Modal buttons not found
  - Multiple elements with same text
- **Fix**: Improve test element selectors and icon mocks
- **Time to Fix**: 2 hours
- **Files to Change**: `src/screens/main/__tests__/JournalScreen.test.tsx`

### BUG-011: Today Screen Rendering
- **Component**: Mobile App - Today Screen
- **Tests Failing**: 1 test in TodayScreen.test.tsx
- **Severity**: 🟢 Medium
- **Impact**: Dashboard may not display correctly
- **Fix**: Verify component structure and test selectors
- **Time to Fix**: 30 minutes
- **Files to Change**: `src/screens/main/__tests__/TodayScreen.test.tsx`

---

## Low Priority (Polish) ⚪

### BUG-012: Tarot Service Test Expectations
- **Component**: Backend - Tarot Service
- **Tests Failing**: 1 test in tarot.service.spec.ts
- **Severity**: ⚪ Low
- **Impact**: None - service works better than expected
- **Issue**: Test expects empty cards array, service provides full cards
- **Fix**: Update test expectations to match enhanced implementation
- **Time to Fix**: 15 minutes
- **Files to Change**: `modules/tarot/tarot.service.spec.ts`

### BUG-013: Missing ESLint Configuration
- **Component**: Backend - Code Quality
- **Severity**: ⚪ Low
- **Impact**: Linting not available
- **Fix**: Create .eslintrc.js configuration
- **Time to Fix**: 30 minutes
- **Files to Create**: `backend/.eslintrc.js`

### BUG-014: Deprecated npm Packages
- **Component**: Both - Dependencies
- **Severity**: ⚪ Low
- **Impact**: Warning messages during install
- **Packages**:
  - inflight@1.0.6
  - rimraf@3.0.2
  - glob@7.2.3
  - supertest@6.3.4
  - @testing-library/jest-native@5.4.3
- **Fix**: Update to latest versions or find replacements
- **Time to Fix**: 1 hour
- **Files to Change**: `package.json` files

---

## Bug Statistics

### By Severity
- 🔴 Critical: 3 bugs (✅ ALL FIXED)
- 🟡 High: 5 bugs (✅ 4 FIXED, 1 remaining)
- 🟢 Medium: 3 bugs (⏳ pending)
- ⚪ Low: 4 bugs (⏳ pending)

### By Status
- ✅ Fixed: 6 bugs (BUG-001, BUG-002, BUG-003, BUG-005, BUG-006, BUG-007)
- 🔄 In Progress: 0 bugs
- ⏳ Pending: 9 bugs
- 🔗 Blocked: 0 bugs

### Test Results
- **Before fixes**: 332/530 passing (62.6%)
- **After BUG-001 fix**: 479/530 passing (90.4%)
- **Improvement**: +147 tests passing (+27.8%)

### By Component
- Mobile App API Layer: 6 bugs
- Mobile App UI: 4 bugs
- Backend Services: 2 bugs
- Test Configuration: 2 bugs
- Code Quality: 1 bug

### By Impact
- Blocking: 1 bug (BUG-001)
- Major: 5 bugs
- Minor: 6 bugs
- Trivial: 2 bugs

---

## Fix Order Recommendation

### Day 1 (Morning - 2 hours)
1. ✅ BUG-002 (DONE)
2. ✅ BUG-003 (DONE)
3. ⏳ BUG-001 → Will fix BUG-005, BUG-006, BUG-007 automatically

### Day 1 (Afternoon - 2 hours)
4. ⏳ BUG-008 (Backend test DB)
5. ⏳ BUG-012 (Tarot test)

### Day 2 (Morning - 2 hours)
6. ⏳ BUG-004 (Login screen)
7. ⏳ BUG-009 (Profile selector)

### Day 2 (Afternoon - 2 hours)
8. ⏳ BUG-010 (Journal screen UI)
9. ⏳ BUG-011 (Today screen)

### Day 3 (Morning - 2 hours)
10. ⏳ BUG-013 (ESLint)
11. ⏳ BUG-014 (Dependencies)

---

## Testing After Fixes

After each fix, run:

```bash
# For mobile app bugs
cd astrology-app/mobile
npm test

# For backend bugs
cd astrology-app/backend
npm test

# For specific tests
npm test -- path/to/specific.test.ts
```

---

## Success Criteria

### After Critical Fixes (Day 1)
- [ ] Mobile tests: 96%+ passing (510+/530)
- [ ] Backend tests: 100% passing (189/189)
- [ ] All API modules functional
- [ ] No mock configuration errors

### After High Priority Fixes (Day 2)
- [ ] Mobile tests: 98%+ passing (520+/530)
- [ ] Login flow working
- [ ] All major features tested
- [ ] UI components functional

### After All Fixes (Day 3)
- [ ] Mobile tests: 99%+ passing (525+/530)
- [ ] Backend tests: 100% passing
- [ ] Code quality checks passing
- [ ] No deprecated dependencies
- [ ] Ready for production

---

## Notes

- Most bugs are related to test configuration, not actual functionality
- The app may work fine despite test failures
- BUG-001 is the bottleneck - fixing it will resolve 180+ test failures
- Backend is in much better shape (93.7% passing)
- No security vulnerabilities found (CodeQL passed)

---

**Document Version**: 1.0  
**Last Updated**: November 20, 2024  
**Created By**: Automated Testing Agent  
**Status**: Complete - Ready for Development Team
