# ✅ DAY 1 SETUP CHECKLIST - Detailed Walkthrough

**Date:** [Today]  
**Team Lead:** [Name]  
**Duration:** 2-3 hours  
**Owner:** DevOps Engineer / Team Lead  

---

## 🎯 DAY 1 OBJECTIVES

- [ ] GitHub Actions secrets configured (5 secrets)
- [ ] EAS account initialized
- [ ] Apple Developer credentials set up
- [ ] All environment checks passed
- [ ] CI/CD pipeline tested successfully
- [ ] Team ready for Day 2 implementation

---

## 📝 PHASE 1: GitHub Actions Secrets (15 minutes)

### Step 1: Access GitHub Repository

```bash
# Go to repository
https://github.com/kazimincii/Astro-lab

# Navigate to secrets
Settings → Secrets and variables → Actions
```

### Step 2: Create EAS_TOKEN Secret

**Source:** Expo Development Platform

```bash
# 1. Go to: https://expo.dev/settings
# 2. Login with your Expo account
# 3. Find: "CLI Token" or "Tokens" section
# 4. Click: "Create Token"
# 5. Name: "GitHub Actions CI/CD"
# 6. Duration: 30 days (or max 60 days)
# 7. Scope: "Full Access" (or minimum required)
# 8. Copy the token (you won't see it again!)
```

**Add to GitHub:**
```
Name: EAS_TOKEN
Value: [Paste the token you copied]
Click: Add secret
```

**✅ Verification:**
```bash
# In your terminal:
echo $EAS_TOKEN  # Should show token value (in GitHub Actions environment)

# In GitHub Actions:
# The workflow will use this automatically
```

---

### Step 3: Create EAS_PROJECT_ID Secret

**Source:** Your app.json

```bash
# 1. Open: astrology-app/mobile/app.json
# 2. Find: "expo" → "projectId"
# 3. Copy the project ID (looks like: "astrologyapp" or similar)
```

**If not in app.json:**
```bash
# Run in terminal:
cd astrology-app/mobile
eas project:info
# This will show your project ID
```

**Add to GitHub:**
```
Name: EAS_PROJECT_ID
Value: [Paste your project ID]
Click: Add secret
```

**✅ Verification:**
```bash
# Verify in app.json:
cat astrology-app/mobile/app.json | grep projectId
```

---

### Step 4: Create APPLE_ID Secret

**Source:** Your Apple Developer Account

```
# 1. Your Apple Developer email address
# Example: dev@example.com
# (The email you use to login to developer.apple.com)
```

**Add to GitHub:**
```
Name: APPLE_ID
Value: [Your Apple Developer email]
Click: Add secret
```

**✅ Verification:**
```bash
# This is just your email, should be valid format:
# user@domain.com
```

---

### Step 5: Create APPLE_PASSWORD Secret

⚠️ **IMPORTANT:** This is NOT your regular Apple ID password!

**Creating App-Specific Password:**

```
1. Go to: https://appleid.apple.com/account/security
2. Login with your Apple ID
3. Find: "APP-SPECIFIC PASSWORDS"
4. Click: Generate password
5. Select App: "Other (Custom name)"
6. Enter: "GitHub Actions CI/CD"
7. Click: Create
8. Copy the 16-character password shown
9. Save it securely (you'll need it)
```

**Why App-Specific Password?**
- Regular Apple ID password is too powerful
- App-specific password is limited to that app only
- More secure if GitHub is compromised

**Add to GitHub:**
```
Name: APPLE_PASSWORD
Value: [Paste the 16-char app-specific password]
Click: Add secret
```

**✅ Verification:**
```bash
# Password should be 16 characters, like:
# abcd-efgh-ijkl-mnop
```

---

### Step 6: Create APPLE_TEAM_ID Secret

**Source:** Apple Developer Program

```
1. Go to: https://developer.apple.com/account/#!/
2. Login with your Apple Developer account
3. Find: "Membership Details"
4. Look for: "Team ID"
5. Format: 10 alphanumeric characters (e.g., ABC123DEFG)
6. Copy the Team ID
```

**Add to GitHub:**
```
Name: APPLE_TEAM_ID
Value: [Paste your Team ID]
Click: Add secret
```

**✅ Verification:**
```bash
# Team ID should be 10 characters
# Format: ABC123DEFG (uppercase letters and numbers)
```

---

### ✅ SECRETS SUMMARY

**Created Secrets Checklist:**
```
☐ EAS_TOKEN                (from expo.dev)
☐ EAS_PROJECT_ID           (from app.json)
☐ APPLE_ID                 (your email)
☐ APPLE_PASSWORD           (app-specific, 16 chars)
☐ APPLE_TEAM_ID            (from developer.apple.com, 10 chars)
```

**Verify All Created:**
```bash
# Go to: GitHub repo → Settings → Secrets and variables → Actions
# Should see all 5 secrets listed (values hidden, just showing names)
```

**Time Spent:** 15 minutes ✅

---

## 📊 PHASE 2: EAS Setup (30 minutes)

### Step 1: Clone Repository

```bash
# If not already cloned:
git clone https://github.com/kazimincii/Astro-lab.git
cd Astro-lab

# Or if already cloned, just update:
git pull origin feature/claude-haiku-impl
git checkout feature/claude-haiku-impl
```

### Step 2: Install Global Tools

```bash
# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI
npm install -g eas-cli

# Verify installations
expo --version   # Should show version
eas --version    # Should show version
```

**Expected Output:**
```
expo@X.X.X
eas-cli/X.X.X
```

### Step 3: Navigate to Mobile App

```bash
# Enter the mobile app directory
cd astrology-app/mobile

# Install dependencies
npm install

# This may take 2-3 minutes
```

### Step 4: Login to EAS

```bash
# Login to EAS
eas login

# Follow prompts:
# 1. Enter your Expo email
# 2. Enter your Expo password
# 3. "Logged in as: [your-email]" should appear
```

**Verify:**
```bash
# Check you're logged in
eas whoami
# Should show your email address
```

### Step 5: Initialize EAS Project (if not done)

```bash
# Check if already initialized
eas project:info

# If error, initialize:
eas init

# Follow prompts:
# 1. Create new project? (Select your project)
# 2. Project ID will be shown/created
# 3. Should match EAS_PROJECT_ID from Step 3 above
```

**Verify:**
```bash
# Check project info
eas project:info

# Should show:
# Project ID: [your-project-id]
# Project Name: [your-project-name]
```

### Step 6: Setup Apple Credentials

```bash
# Setup iOS credentials
eas credentials

# Choose: iOS

# Follow prompts:
# 1. Authenticate with Apple ID: [Enter your Apple email]
# 2. Password: [Enter your Apple password]
# 3. Create app identifier? Yes
# 4. Select development team
# 5. Create signing certificate? Yes (if needed)

# This process may take several minutes
```

**What it does:**
- Creates/verifies Apple signing certificates
- Sets up provisioning profiles
- Configures code signing for EAS builds

**Verify:**
```bash
# Check credentials saved
eas credentials

# Should show configured credentials for iOS
```

**Time Spent:** 30 minutes ✅

---

## 🧪 PHASE 3: Test CI/CD Pipeline (15 minutes)

### Step 1: Make a Test Commit

```bash
# Go back to root directory
cd ../..

# Check current branch
git status
# Should show: "On branch feature/claude-haiku-impl"

# Make a small change to trigger CI/CD
echo "# Test build at $(date)" >> TEST_BUILD_LOG.md

# Stage and commit
git add TEST_BUILD_LOG.md
git commit -m "test: Trigger CI/CD pipeline test"
```

### Step 2: Push to Remote

```bash
# Push the change
git push origin feature/claude-haiku-impl

# Watch GitHub Actions start automatically
```

### Step 3: Monitor GitHub Actions

```
1. Go to: https://github.com/kazimincii/Astro-lab
2. Click: "Actions" tab (top menu)
3. You should see a workflow running:
   "feat: Trigger CI/CD pipeline test"
4. Watch the jobs:
   - ✅ test (E2E tests, 10-15 min)
   - ⏳ build (EAS build, 15-20 min, depends on test)
   - ⏳ deploy (TestFlight, 5 min, depends on build)
```

### Step 4: Wait for Test Job to Complete

```
Job: test
Status: Running...
- Install dependencies
- Build Detox framework
- Run 40+ E2E tests
- Upload test results
Duration: ~10-15 minutes
```

**When test job finishes:**
- ✅ If all tests PASS → Build job will start
- ❌ If any tests FAIL → See "Debugging Test Failures" below

### Step 5: Verify Test Results

```
Expected Results:
✅ 40+ E2E tests passing
✅ No build errors
✅ Artifacts uploaded successfully
✅ Build job started automatically

In GitHub Actions log you should see:
"All tests passed successfully!"
```

**Time Spent:** 15 minutes (+ wait time) ✅

---

## 🚀 PHASE 4: Final Verification (15 minutes)

### Checklist: All Systems GO?

```
GITHUB ACTIONS:
☐ All 5 secrets created
☐ Secrets visible in GitHub repo settings
☐ No red error indicators

EAS SETUP:
☐ Expo CLI installed
☐ EAS CLI installed
☐ EAS login successful (eas whoami works)
☐ Project ID matches EAS_PROJECT_ID
☐ iOS credentials configured

CI/CD PIPELINE:
☐ Test commit pushed successfully
☐ GitHub Actions workflow triggered
☐ Test job running/completed
☐ No workflow errors visible

ENVIRONMENT:
☐ Node.js v18+ installed (node --version)
☐ npm 9+ installed (npm --version)
☐ Git configured (git config user.name shows name)
☐ All dependencies installed (npm list shows packages)
```

### If Anything Is Red/Wrong

**Debugging Guide:**

```
❌ Secrets not showing in Actions tab?
→ Clear browser cache
→ Refresh GitHub page
→ Verify secret names exactly (case-sensitive)

❌ EAS login failing?
→ Check internet connection
→ Verify Expo account is active
→ Try: eas logout, then eas login again

❌ GitHub Actions workflow not starting?
→ Check branch is feature/claude-haiku-impl
→ Verify push succeeded (git log shows commit)
→ Refresh GitHub Actions tab
→ Check repo settings → Actions → Enabled

❌ Tests failing in CI/CD?
→ Check test output logs in GitHub
→ Run tests locally first: npm run detox:test
→ Fix locally before pushing again

❌ Apple credentials error?
→ Verify APPLE_ID is correct email
→ Verify APPLE_PASSWORD is app-specific (not regular password)
→ Try: eas credentials --remove, then eas credentials again
```

---

## 📞 SUPPORT CONTACTS

### If You Get Stuck

**For GitHub Actions issues:**
- Check: `.github/workflows/detox-build-deploy.yml` in repo
- Check: `.github/SECRETS_SETUP.md` for secrets guide
- Resource: GitHub Actions documentation

**For EAS issues:**
- Check: `IMPLEMENTATION_PLAYBOOK.md` → Day 1 section
- Resource: Expo documentation (https://docs.expo.dev)
- Command: `eas --help` for CLI commands

**For Apple Developer issues:**
- Check: Apple Developer documentation
- Resource: https://developer.apple.com/support
- Tool: Check Xcode for certificate/profile issues

**For TypeScript/Node issues:**
- Run: `npm install` to reinstall dependencies
- Run: `npm run test` to verify Jest setup
- Check: Node version with `node --version`

---

## 🎉 DAY 1 COMPLETE!

**After finishing all 4 phases:**

```
✅ GitHub Actions secrets configured
✅ EAS project set up
✅ Apple credentials configured
✅ CI/CD pipeline tested and working
✅ All environment checks passed

NEXT: Prepare for Day 2 - iOS Widget Implementation
```

---

## ⏱️ TIME TRACKING

| Phase | Est. Time | Actual | Notes |
|-------|-----------|--------|-------|
| 1. GitHub Secrets | 15 min | — | GitHub UI access needed |
| 2. EAS Setup | 30 min | — | Network dependent |
| 3. Test CI/CD | 15 min | — | + wait time for pipeline |
| 4. Verification | 15 min | — | Manual checks |
| **TOTAL** | **75 min** | — | *+ GitHub Actions wait time* |

**Total with CI/CD wait:** ~2 hours

---

## 🚀 READY FOR DAY 2?

Once Day 1 is complete and verified:

```
Next Phase: iOS Widget Implementation (Day 2)
Duration: 3-4 hours
Owner: iOS Developer
Reference: iOS_WIDGET_IMPLEMENTATION.md
```

Tell Team Lead when ready! ✅

---

**Day 1 Checklist Author:** Claude Haiku  
**Last Updated:** November 18, 2025  
**Status:** Ready for Team Use 🎯
