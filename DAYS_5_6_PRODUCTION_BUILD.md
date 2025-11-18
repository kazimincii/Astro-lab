# 🚀 DAYS 5-6: PRODUCTION BUILD & TESTFLIGHT

**Duration:** 6-8 hours (split across 2 days)  
**Owner:** DevOps Engineer / DevOps Team  
**Prerequisite:** Days 1-4 completed successfully  

---

## 🎯 DAYS 5-6 OBJECTIVES

**Day 5:**
- [ ] Verify environment and credentials
- [ ] Update version numbers
- [ ] Create production build
- [ ] Monitor build progress
- [ ] Download and inspect build

**Day 6:**
- [ ] Submit build to TestFlight
- [ ] Configure internal testers
- [ ] Monitor TestFlight status
- [ ] Prepare for manual testing

---

## ⚙️ PREREQUISITES CHECK

```bash
# Verify all Day 1 secrets configured
# (Should have been done on Day 1)

echo "Checking credentials..."
eas whoami
# Should show your email

# Verify project ID
cd astrology-app/mobile
cat app.json | grep projectId
# Should show your EAS project ID

# Verify credentials saved
eas credentials
# Should show iOS credentials configured
```

---

## 📋 PHASE 1: PRE-BUILD VERIFICATION (30 minutes)

### Step 1: Verify App Configuration

```bash
# Navigate to mobile app
cd astrology-app/mobile

# Check app.json
cat app.json | grep -A 10 '"expo"'

# Verify these fields:
# - "name": "astrology-mobile"
# - "slug": "astrology"
# - "version": "1.0.0"
# - "ios": { "bundleIdentifier": "com.astrologyapp.superapp" }
# - "extra": { "eas": { "projectId": "YOUR_PROJECT_ID" } }
```

### Step 2: Update Version Numbers

```bash
# Current versions in app.json:
# - version: "1.0.0"
# - ios.buildNumber: "1"

# For production build, update:
nano app.json

# Change:
# "version": "1.0.0",
# "buildNumber": "1"

# To:
# "version": "1.0.0",
# "buildNumber": "2"

# (Increment buildNumber for each new build)
```

### Step 3: Commit Version Update

```bash
# Stage changes
git add app.json

# Commit
git commit -m "chore: Bump build number for production build"

# Push (can skip if network issues)
git push origin feature/claude-haiku-impl
```

### Step 4: Final Environment Check

```bash
# Verify npm packages
npm list expo
npm list eas-cli
# Both should show versions

# Clean npm cache (recommended before build)
npm cache clean --force

# Install dependencies fresh
npm install --force
```

---

## 🏗️ PHASE 2: CREATE PRODUCTION BUILD (2-3 hours)

### Step 1: Initiate EAS Build

```bash
# Start production build
eas build --platform ios --profile production

# This will:
# 1. Compress your app code
# 2. Send to EAS servers
# 3. Compile with Xcode on EAS machines
# 4. Sign with production certificates
# 5. Create IPA file (iOS app package)
# 6. Wait 15-20 minutes for completion

# You'll see:
# Building... (progress bar)
# ✓ Build complete!
# ✓ Download link: https://...
```

### Step 2: Monitor Build Progress

While the build runs, watch the EAS dashboard:

```
1. Go to: https://expo.dev/builds
2. Login with your Expo account
3. Click: Your project
4. Watch the build status:
   - Queued
   - Building
   - Uploading
   - Complete
```

### Step 3: Wait for Build Completion

```
Expected timeline:
- Queue time: 0-5 minutes
- Compilation time: 10-15 minutes
- Signing time: 2-3 minutes
- Total: 15-20 minutes

Once complete, you'll see:
✓ Download IPA
✓ View build logs
✓ Submit to TestFlight
```

---

## 📥 PHASE 3: DOWNLOAD & INSPECT BUILD (20 minutes)

### Step 1: Download Build Artifacts

```bash
# From terminal, after build completes:
eas build:download

# Or download manually:
# 1. Go to: https://expo.dev/builds
# 2. Find your completed build
# 3. Click: Download IPA
# 4. Save to: Downloads/

# Expected file:
# Astro-1.0.0-production.ipa
# Size: ~80-120 MB
```

### Step 2: Verify Build Integrity

```bash
# Check file exists
ls -lh ~/Downloads/Astro-1.0.0-production.ipa

# Should show:
# File size: ~80-120 MB
# Modified date: Today

# Optional: Verify code signature
codesign -d -v ~/Downloads/Astro-1.0.0-production.ipa
# Should show: Apple certificate details
```

### Step 3: Inspect Build Logs

```bash
# View build logs in EAS
# 1. Go to: https://expo.dev/builds
# 2. Click build number
# 3. Check "Logs" tab for:
#    - Build steps
#    - Any warnings
#    - Success confirmation

# No errors should be present
# Warnings are usually okay
```

---

## 📤 PHASE 4: SUBMIT TO TESTFLIGHT (30 minutes - Day 6)

### Step 1: Prepare Submission

```bash
# Make sure you're logged into EAS
eas whoami

# Check credentials still valid
eas credentials

# Verify App Store Connect access
# (You'll need this for TestFlight)
```

### Step 2: Submit Build to TestFlight

```bash
# Submit the build to TestFlight
eas submit --platform ios --latest

# This will:
# 1. Take the latest completed build
# 2. Submit to TestFlight via App Store Connect
# 3. Validate code signing
# 4. Upload to Apple servers
# 5. Make available to testers

# Expected output:
# ✓ Submitted to TestFlight
# ✓ Build available in 5-10 minutes
# ✓ Testers can download and test
```

### Step 3: Monitor Submission

```
Watch in App Store Connect:
1. Go to: https://appstoreconnect.apple.com
2. Login with Apple ID
3. Select your app
4. Go to: TestFlight → iOS → Builds
5. Watch build status:
   - Processing (5-10 min)
   - Ready for Testing
   - Available to Internal Testers
```

---

## 👥 PHASE 5: CONFIGURE INTERNAL TESTERS (20 minutes - Day 6)

### Step 1: Add Internal Testers

```
In App Store Connect:
1. Select app → TestFlight → iOS
2. Click: Internal Testing
3. Add testers:
   - Email addresses of QA team
   - Email of Product Manager
   - Any other team members for testing

4. For each tester:
   - Click: +
   - Enter email
   - Click: Add
   - Testers get email invite
```

### Step 2: Testers Download from TestFlight

```
Testers will receive email:
Subject: You're invited to test [App Name]

Testers need to:
1. Open email
2. Click: View on TestFlight
3. Download TestFlight app (if needed)
4. Install app on their device
5. Launch and test

Expected: 5-10 minutes from submission
```

### Step 3: Monitor TestFlight Status

```bash
# Check build status
eas builds --platform ios --status active

# Should show:
# Build #X: Ready for Testing
# Build #X: Testing
# Build #X: Complete

# Testers can now:
✓ Download app to real device
✓ Test all features
✓ Send feedback
✓ Report crashes
```

---

## 🧪 PHASE 6: TESTING & FEEDBACK (24-48 hours)

### What Happens Next

```
TestFlight Phase:
1. QA team downloads build
2. Runs all manual test scenarios
3. Tests on real devices
4. Reports any bugs found
5. Tests iOS widgets on lock screen
6. Tests Apple Watch app
7. Collects feedback

Timeline:
- Hours 0-2: Testers download
- Hours 2-24: Manual testing
- Hours 24-48: Bug fixing (if needed)
- After 48h: Ready for App Store
```

### Monitoring Tester Feedback

```
In App Store Connect:
1. TestFlight → iOS → Internal Testing
2. View:
   - Tester count
   - Devices tested
   - Crash reports
   - Feedback comments

Check daily for:
✓ Crash counts (should be 0)
✓ Tester feedback (should be positive)
✓ Device compatibility (should work on all)
✓ Major features working (all should work)
```

---

## ✅ Days 5-6 Complete Checklist

```
PHASE 1: Pre-Build Verification
☑ app.json verified
☑ Version numbers updated
☑ Build number incremented
☑ Credentials verified
☑ Environment clean

PHASE 2: Production Build
☑ EAS build initiated
☑ Build completed successfully
☑ No build errors
☑ Code signing verified
☑ Production IPA created

PHASE 3: Download & Inspect
☑ Build downloaded
☑ File integrity verified
☑ Build logs reviewed
☑ No critical warnings
☑ Ready for TestFlight

PHASE 4: Submit to TestFlight
☑ Submitted to TestFlight
☑ Status shows "Ready for Testing"
☑ No submission errors
☑ Apple validation passed

PHASE 5: Configure Testers
☑ Internal testers added
☑ All QA team has access
☑ Product manager has access
☑ Test devices registered
☑ TestFlight email sent

PHASE 6: Testing Started
☑ Testers downloading build
☑ Testing beginning
☑ Monitoring for crashes
☑ Collecting feedback
```

**Time Spent:** 6-8 hours across 2 days ✅

---

## 🚨 TROUBLESHOOTING

### Build Failed in EAS
```
Check build logs:
1. Go to: https://expo.dev/builds
2. Click failed build
3. Check: Logs tab

Common issues:
- Code signing error → Verify Apple credentials
- Pod error → Delete Pods, rebuild
- Timeout → Try again (might be temporary)
```

### TestFlight Submission Failed
```
Check submission logs:
1. App Store Connect → TestFlight
2. Check error message
3. Common fixes:
   - Invalid code signing
   - Missing entitlements
   - Provisioning profile expired
   → Re-run credentials: eas credentials
```

### Testers Not Receiving Email
```
Verify:
1. Tester email is correct
2. Email not in spam folder
3. TestFlight app installed
4. Re-send invite if needed:
   - App Store Connect → Remove tester
   - Add tester again
   - New email sent
```

### App Crashes on TestFlight
```
Debug:
1. Get crash report from TestFlight
2. Review error logs
3. Fix issue in code
4. Increment build number
5. Create new EAS build
6. Re-submit to TestFlight
```

---

## 📞 SUPPORT CONTACTS

**EAS Issues:**
- Docs: https://docs.expo.dev/eas
- Email: support@expo.dev
- Slack: Expo Slack community

**Apple/TestFlight Issues:**
- Docs: https://help.apple.com/app-store-connect
- Support: https://developer.apple.com/support

**Build Failures:**
- Check EAS build logs (very detailed)
- Try local build: `eas build --platform ios --local`

---

## 🎉 READY FOR APP STORE!

Once Days 5-6 complete:

```
✅ Production build created
✅ Submitted to TestFlight
✅ Internal testing begun
✅ 48+ hours for testing
✅ Ready for Days 7-8: App Store

Next Phase: Days 7-8 (App Store Submission)
Duration: 8-10 hours
Owner: Product Manager
```

---

**Expected Completion:** Days 5-6 complete after 6-8 hours  
**Status When Done:** Build in TestFlight, Testing Active ✅
