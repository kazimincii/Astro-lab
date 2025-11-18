# 🔧 TROUBLESHOOTING GUIDE

**For:** All team members  
**When:** You encounter an issue  
**How:** Search by issue type, follow solution steps  

---

## 🎯 QUICK ISSUE FINDER

### Are you experiencing:

- **Git/GitHub issues?** → [Git Problems](#git-problems)
- **Setup/Installation issues?** → [Setup Problems](#setup-problems)
- **Detox/Testing issues?** → [Testing Problems](#testing-problems)
- **EAS Build issues?** → [Build Problems](#build-problems)
- **TestFlight issues?** → [TestFlight Problems](#testflight-problems)
- **App Store issues?** → [App Store Problems](#app-store-problems)
- **iOS/Widget issues?** → [iOS Problems](#ios-problems)
- **Code/Runtime issues?** → [Runtime Problems](#runtime-problems)

---

## GIT PROBLEMS

### Issue: "On wrong branch"

**Error:**
```
git branch shows: * main
Should show: * feature/claude-haiku-impl
```

**Solution:**
```bash
# Switch to correct branch
git checkout feature/claude-haiku-impl

# Pull latest changes
git pull origin feature/claude-haiku-impl

# Verify
git branch
# Should show: * feature/claude-haiku-impl
```

---

### Issue: "Can't push to GitHub"

**Error:**
```
fatal: could not read Username for 'https://github.com': 
terminal prompts disabled
```

**Solution (Option 1: Use SSH)**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096

# Copy key to GitHub
# Settings → SSH Keys → New SSH Key → Paste

# Change remote to SSH
git remote set-url origin git@github.com:kazimincii/Astro-lab.git

# Try push again
git push origin feature/claude-haiku-impl
```

**Solution (Option 2: Use Personal Access Token)**
```bash
# Generate token on GitHub
# Settings → Developer settings → Personal access tokens → New token
# Scopes: repo, workflow, write:packages

# When git asks for password, paste token instead
git push origin feature/claude-haiku-impl
# Username: your-username
# Password: (paste token here)
```

---

### Issue: "Merge conflicts"

**Error:**
```
conflict in file: src/screens/ProfileScreen.tsx
CONFLICT (content merge): ...
```

**Solution:**
```bash
# Check conflicted files
git status

# Open the file and resolve conflicts
nano src/screens/ProfileScreen.tsx

# Look for:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> branch-name

# Keep what you want, remove markers

# Mark as resolved
git add src/screens/ProfileScreen.tsx

# Complete merge
git commit -m "fix: Resolve merge conflicts"

# Push
git push origin feature/claude-haiku-impl
```

---

## SETUP PROBLEMS

### Issue: "npm install failing"

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependency peer conflicts
```

**Solution:**
```bash
# Navigate to correct folder
cd astrology-app/mobile

# Clear cache
npm cache clean --force

# Install with force flag
npm install --force

# Or use legacy peer deps
npm install --legacy-peer-deps
```

---

### Issue: "Node version wrong"

**Error:**
```
npm ERR! The requested Node version (16) does not match 
the required version (18+)
```

**Solution:**
```bash
# Check current version
node --version

# If < 18, install newer version
# Option 1: Download from nodejs.org
# Option 2: Use nvm (Node Version Manager)

# Using nvm:
nvm install 18
nvm use 18

# Verify
node --version
# Should show: v18.x.x or higher
```

---

### Issue: "Expo token invalid"

**Error:**
```
Error: Expo authentication token is invalid or not found
```

**Solution:**
```bash
# Login to Expo
eas login

# When prompted:
# Email: your-email@example.com
# Password: your-password

# Verify login
eas whoami
# Should show your account email

# Check token is saved
echo $EXPO_TOKEN
# Should show token (don't share!)
```

---

### Issue: "Can't find file/folder"

**Error:**
```
ENOENT: no such file or directory
file: astrology-app/mobile/src/screens/ProileScreen.tsx
```

**Solution:**
```bash
# Find the correct path
find . -name "*ProfileScreen*"

# This shows correct location and spelling

# Update your command/path with correct name

# Or list what's in a directory
ls astrology-app/mobile/src/screens/
# Shows all files in that folder
```

---

## TESTING PROBLEMS

### Issue: "Detox CLI not found"

**Error:**
```
command not found: detox
```

**Solution:**
```bash
# Install Detox CLI globally
npm install -g detox-cli

# Verify installation
detox --version
# Should show: detox-cli/X.X.X

# If still not found, use npx instead
npx detox build-framework-cache
npx detox test e2e/auth.e2e.test.ts
```

---

### Issue: "iOS simulator won't launch"

**Error:**
```
Could not boot iOS Simulator. Original error: ...
```

**Solution:**
```bash
# Kill any running simulators
killall "Simulator"

# Clear simulator cache
xcrun simctl erase all

# Relaunch
open /Applications/Simulator.app

# Try again
npm run detox:test

# If still failing:
# 1. Open Xcode
# 2. Go to: Xcode → Preferences → Locations
# 3. Check "Command Line Tools" is set
# 4. Retry
```

---

### Issue: "Test timeout"

**Error:**
```
TIMEOUT: Test took longer than 120000ms
```

**Solution:**
```bash
# Increase timeout in jest-e2e.json
cat jest-e2e.json

# Edit:
# "testTimeout": 120000
# Change to:
# "testTimeout": 300000

# Or skip slow test temporarily
# In test file:
// it('slow test', async () => { ... })
// Change to:
// it.skip('slow test', async () => { ... })

# Run again
npm run detox:test
```

---

### Issue: "Test element not found"

**Error:**
```
DetoxRuntimeError: Element not found
Could not find element with testID: "login-button"
```

**Solution:**
```bash
# The component doesn't have required testID

# 1. Find the component
grep -r "Login" astrology-app/mobile/src/screens/

# 2. Open the file and add testID
# Before:
<TouchableOpacity>
  <Text>Login</Text>
</TouchableOpacity>

# After:
<TouchableOpacity testID="login-button">
  <Text>Login</Text>
</TouchableOpacity>

# 3. Save and rebuild
npm run detox:build:ios

# 4. Run test again
npm run detox:test:single -- e2e/auth.e2e.test.ts
```

---

## BUILD PROBLEMS

### Issue: "EAS build failed"

**Error (from EAS logs):**
```
Build failed: Code signing error
or
Build failed: Pod error
```

**Solution:**
```bash
# 1. Check build logs on EAS website
# https://expo.dev/builds → Click build → View logs

# 2. For code signing error:
eas credentials

# 3. For Pod error (iOS dependencies):
cd astrology-app/mobile
rm -rf ios/Pods
npm install

# 4. Rebuild locally first to catch errors:
eas build --platform ios --local

# 5. Retry on EAS
eas build --platform ios --profile production
```

---

### Issue: "Build timeout"

**Error:**
```
Build did not complete within timeout (60 minutes)
```

**Solution:**
```bash
# Build is taking too long (rare)

# 1. Check EAS logs for what's slow
# https://expo.dev/builds

# 2. Reduce app size:
# - Remove large assets
# - Optimize images
# - Check for large dependencies

# 3. Try again:
eas build --platform ios --profile production

# 4. Contact EAS support if persists
# support@expo.dev
```

---

### Issue: "Invalid provisioning profile"

**Error:**
```
Code signing error: Invalid provisioning profile
```

**Solution:**
```bash
# Provisioning profile expired or invalid

# 1. Clear old credentials
eas credentials --platform ios --clear

# 2. Reconfigure credentials
eas credentials --platform ios --setup

# 3. Follow prompts to create new profiles

# 4. Rebuild
eas build --platform ios --profile production
```

---

## TESTFLIGHT PROBLEMS

### Issue: "Build not appearing in TestFlight"

**Error:**
```
Build submitted but not showing in TestFlight
```

**Solution:**
```bash
# Builds take 5-15 minutes to appear

# 1. Wait 10 minutes
# 2. Refresh in App Store Connect

# If still not there:

# 1. Check submission status
eas submit --status

# 2. Check build is completed
eas builds --platform ios --status active

# 3. Check build was submitted
# Go to: https://appstoreconnect.apple.com
# App → TestFlight → iOS → Builds

# 4. If build stuck, resubmit
eas submit --platform ios --latest
```

---

### Issue: "Testers not receiving email"

**Error:**
```
Tester doesn't get TestFlight invite email
```

**Solution:**
```bash
# 1. Check tester email is correct
# App Store Connect → TestFlight → Testers

# 2. Check email not in spam folder

# 3. Resend invitation:
# App Store Connect
# Remove tester
# Add same tester again
# New email should send

# 4. Check testers have Apple ID
# (Required for TestFlight)

# 5. If issue persists, escalate to team lead
```

---

### Issue: "App crashes on real device"

**Error:**
```
Crash report from TestFlight tester
```

**Solution:**
```bash
# 1. Get crash details from tester
# - What they were doing
# - Error message
# - Device type

# 2. Check crash reports in App Store Connect
# App → Crashes

# 3. Fix the crash in code
# Find error, apply fix, commit

# 4. Increment build number
# app.json → "buildNumber": "3" (increase)

# 5. Create new build
eas build --platform ios --profile production

# 6. Wait for build
# 7. Submit to TestFlight
eas submit --platform ios --latest

# 8. Notify tester of new build
```

---

## APP STORE PROBLEMS

### Issue: "App rejected"

**Error (from App Store Review):**
```
App rejected due to: [specific reason]
```

**Solution:**
```
Common rejections:

1. "Misleading description"
   → Make sure features exist in app
   → Don't oversell capabilities
   → Be honest about limitations

2. "Broken links"
   → Test all URLs: privacy, support, etc.
   → Use HTTPS not HTTP
   → Check links in app too

3. "Missing content"
   → Add more screenshots
   → Better description
   → Complete all metadata

4. "Performance issue"
   → Should be fixed by TestFlight
   → If issue found: fix, rebuild, resubmit

5. "Privacy concern"
   → Update privacy policy
   → Explain data usage
   → Get permissions for sensitive data

After fixing:
1. Update metadata or code
2. Increment build number
3. Create new EAS build
4. Submit to TestFlight for testing
5. Wait 24-48 hours
6. Resubmit to App Store
7. Wait 24-48 hours for review
```

---

### Issue: "Status stuck on 'Waiting for Review'"

**Error:**
```
Status hasn't changed for days
```

**Solution:**
```bash
# Check current status
# App Store Connect → Your App → Version

# Contact Apple if stuck > 5 days:
# Submit: "App Review - Status Update Request"
# In App Store Connect → Report an Issue

# Or email: app-review@apple.com
# Subject: Status update - [App Name]
# Include: App Store Connect URL + Submission date

# Usually resolved within 24 hours
```

---

## iOS PROBLEMS

### Issue: "Widget not showing on lock screen"

**Error:**
```
After installing app, widget doesn't appear in lock screen
```

**Solution:**
```
Widget troubleshooting:

1. Check widget is in app bundle
   → Xcode: Target → [AppName]
   → Check "iOS Widget" target in "Build Phases"

2. Check App Groups configured
   → Xcode: Target → [WidgetName]
   → Signing & Capabilities → App Groups
   → Group ID: group.com.astrologyapp.superapp

3. Check WidgetDataManager initialized
   → Open: ios-widgets/WidgetDataManager.swift
   → Verify App Groups URL configured

4. Test on simulator:
   → Add widget: Long press home → Widgets → [App Name]
   → Widget should appear

5. If widget still missing:
   → Check build logs for warnings
   → Ask iOS dev team to verify implementation
   → Check with Swift Widget docs
```

---

### Issue: "Watch app won't launch"

**Error:**
```
Watch app doesn't appear on Apple Watch
```

**Solution:**
```
Watch app troubleshooting:

1. Check watch app is in build
   → Xcode: Product → Build
   → Should build both app and watch app

2. Check WatchKit extension target
   → Xcode: Target → [App]WatchKit Extension
   → Build settings correct

3. Pair watch with simulator
   → Simulator → Device → Watch → [Your Watch]

4. Install app on watch
   → Open Watch app on iPhone
   → Find your app
   → Install

5. Check watch app runs
   → Open Watch Simulator
   → Should see your app

6. If issues:
   → Check Astro_WatchApp.swift
   → Verify SwiftUI structure
   → Check ContentView.swift
   → Ask iOS dev for help
```

---

## RUNTIME PROBLEMS

### Issue: "App crashes on launch"

**Error:**
```
App starts but immediately crashes
```

**Solution:**
```bash
# 1. Check JavaScript errors
# Look at console when running:
npm start

# 2. Check metro bundler
# Should show: "Bundled in XXms"

# 3. Run on simulator to see errors:
npm run ios

# 4. Check common causes:
# - Import error in App.tsx
# - Missing component file
# - Syntax error in component
# - Environment variable not set

# 5. Review error message carefully
# Usually shows: "File not found" or "Syntax Error"

# 6. Fix the issue, save file
# Metro auto-refreshes, app should restart

# 7. If still crashing:
# Clean and rebuild:
rm -rf node_modules .expo
npm install
npm start
```

---

### Issue: "Red screen: Module not found"

**Error:**
```
Module not found: Can't resolve './ProfileScreen'
```

**Solution:**
```bash
# Wrong import path

# 1. Find correct file
find . -name "ProfileScreen*"
# Shows: src/screens/ProfileScreen.tsx

# 2. Check import statement
# Wrong: import ProfileScreen from './screens/ProfileScreen'
# Right: import ProfileScreen from '../screens/ProfileScreen'
# Or: import ProfileScreen from '@src/screens/ProfileScreen'

# 3. Fix path in import

# 4. Save file, app should auto-refresh

# 5. If still errors, clear cache:
npm start -- --reset-cache
```

---

## ESCALATION PROCEDURE

### When to Escalate

If you've tried the troubleshooting steps above and issue **persists**:

**1. Post in #astrology-blockers with:**
```
Title: [BLOCKING] Issue type - Brief description

Details:
- What you tried: [steps taken]
- Error message: [exact error]
- Your role: [DevOps/iOS/QA/Product]
- Current day: [Day 1-9]
- Impact: [blocks my work / blocks team]

Attachments:
- Screenshot of error
- Relevant code snippet
- Full error log
```

**2. Assign to appropriate person:**
- DevOps issues → @devops-lead
- iOS issues → @ios-lead  
- Build issues → @devops-lead
- Testing issues → @qa-lead
- App Store → @product-lead
- Urgent → @team-lead

**3. Wait for response:**
- Critical (blocking): 15-30 minutes
- Important: 1-2 hours
- Non-blocking: Same day

---

## EXTERNAL RESOURCES

### Documentation

- **Expo Docs:** https://docs.expo.dev
- **React Native:** https://reactnative.dev
- **Swift/iOS:** https://developer.apple.com
- **Detox:** https://wix.github.io/Detox
- **EAS:** https://docs.expo.dev/eas

### Support Channels

- **Expo Support:** support@expo.dev
- **Apple Support:** https://developer.apple.com/support
- **React Native Issues:** https://github.com/facebook/react-native/issues
- **GitHub Issues:** This repo's issues tab

### Community

- **Expo Community:** https://forums.expo.dev
- **React Native Community:** https://reactnative.dev/community/overview
- **Stack Overflow:** Tag [react-native], [expo], [ios]

---

## 📋 BEFORE ESCALATING

**Make sure you've:**

```
☑ Tried all troubleshooting steps above
☑ Searched documentation for the issue
☑ Cleared caches (npm, Xcode, etc.)
☑ Restarted relevant tools/simulators
☑ Checked error message very carefully
☑ Asked in team Slack (might be quick answer)
☑ Waited at least 15-30 minutes before escalating
```

---

## 📞 QUICK CONTACTS

```
Team Lead: @team-lead
DevOps Lead: @devops-lead
iOS Lead: @ios-lead
QA Lead: @qa-lead
Product Lead: @product-lead

Emergency: #astrology-blockers

Response Time:
🔴 CRITICAL (blocking all work): 15 min
🟠 HIGH (blocking my task): 1-2 hours
🟡 MEDIUM (slowing me down): Same day
🟢 LOW (nice to have): Within 2-3 days
```

---

**Last Updated:** Today  
**Maintained By:** DevOps Team  
**Issue Not Listed?** Create new section or post in #astrology-help
