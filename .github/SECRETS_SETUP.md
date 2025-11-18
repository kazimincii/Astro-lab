# GitHub Actions Secrets Setup Guide

To use the CI/CD pipeline, you need to configure these secrets in your GitHub repository.

## 📋 Required Secrets

### 1. EAS Secrets

**EAS_TOKEN**
- Go to: https://expo.dev/settings
- CLI Token section
- Create new token (max 60 days)
- Copy full token value
- Add to GitHub Secrets as: `EAS_TOKEN`

**EAS_PROJECT_ID**
- In `app.json`: `"extra.eas.projectId"`
- Or from: `eas project:info`
- Add to GitHub Secrets as: `EAS_PROJECT_ID`

### 2. Apple Developer Secrets

**APPLE_ID**
- Your Apple ID email (e.g., dev@example.com)
- Add to GitHub Secrets as: `APPLE_ID`

**APPLE_PASSWORD**
- NOT your Apple ID password
- Go to: https://appleid.apple.com/account/security
- Generate "App-specific password"
- Use that password
- Add to GitHub Secrets as: `APPLE_PASSWORD`

**APPLE_TEAM_ID**
- Go to: https://developer.apple.com/account/#
- Team ID (format: ABC123DEFG)
- Add to GitHub Secrets as: `APPLE_TEAM_ID`

### 3. Optional: Slack Notifications

**SLACK_WEBHOOK**
- Go to: https://api.slack.com/apps
- Create new app
- Enable Incoming Webhooks
- Add new webhook URL to your channel
- Copy webhook URL
- Add to GitHub Secrets as: `SLACK_WEBHOOK` (optional)

---

## 🔐 How to Add Secrets to GitHub

1. Go to your repo: https://github.com/kazimincii/Astro-lab
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EAS_TOKEN` (or other secret name)
5. Value: Paste the value
6. Click "Add secret"

**Repeat for all 5 secrets**

---

## ✅ Secrets Checklist

```
- [ ] EAS_TOKEN (from expo.dev)
- [ ] EAS_PROJECT_ID (from app.json)
- [ ] APPLE_ID (your Apple email)
- [ ] APPLE_PASSWORD (app-specific password)
- [ ] APPLE_TEAM_ID (from developer.apple.com)
- [ ] SLACK_WEBHOOK (optional)
```

---

## 🚀 CI/CD Workflow Overview

### 1. On Push to Main

```
workflow: detox-build-deploy.yml

Triggers when:
- Push to main branch
- Push to feature/claude-haiku-impl
- Pull requests to main

Jobs:
1. test (Detox E2E tests)
   ├─ Install dependencies
   ├─ Build test framework
   ├─ Run 40+ tests
   └─ Upload results
   
2. build (EAS Production build)
   ├─ Depends on: test (must pass)
   ├─ Build for App Store
   ├─ Create IPA
   └─ Upload artifact
   
3. deploy (TestFlight submission)
   ├─ Depends on: build
   ├─ Only on main branch
   ├─ Submit to TestFlight
   └─ Notify completion
```

### 2. Test Job (Always Runs)
```
Status: ✅ PASS or ❌ FAIL
Duration: ~10-15 minutes
Artifacts: test-results/*.json
```

### 3. Build Job (If Tests Pass)
```
Condition: Needs test to pass
Duration: ~15-20 minutes
Artifacts: ios-build/
Retention: 7 days
```

### 4. Deploy Job (Main Branch Only)
```
Condition: Push to main + tests/build pass
Duration: ~5 minutes
Result: Build submitted to TestFlight
Notification: Email from Apple
```

---

## 📊 Monitoring Builds

### View Build Status
```
GitHub Repo → Actions tab
→ "Detox E2E Tests & Production Build"
→ Click latest run
→ View logs for each job
```

### Common Statuses
```
🟢 Success - All jobs passed
🟡 In Progress - Currently running
🔴 Failed - One or more jobs failed
⚫ Cancelled - Manually stopped
⏭️ Skipped - Conditions not met
```

### View Test Results
```
Actions → Latest run
→ test job → Artifacts
→ Download detox-results
```

### View Build Artifacts
```
Actions → Latest run
→ build job → Artifacts
→ Download ios-build (if available)
```

---

## 🔧 Manual Runs

### Trigger workflow manually:
```
GitHub Actions → "Detox E2E Tests & Production Build"
→ "Run workflow" button
→ Select branch: main
→ Click "Run workflow"
```

### Then monitor:
```
Watch real-time logs as it runs
Takes ~30-35 minutes total
```

---

## 🐛 Troubleshooting CI/CD

### Test Job Fails
```
1. Click job to see logs
2. Look for "FAIL" messages
3. Check specific test failure
4. Fix code locally
5. Push fix and retry
```

### Build Job Fails
```
1. Check EAS_TOKEN validity
2. Verify app.json version
3. Check certificate/provisioning
4. View full EAS dashboard logs
```

### Deploy Job Fails
```
1. Verify APPLE_ID is correct
2. Check APPLE_PASSWORD (app-specific)
3. Verify APPLE_TEAM_ID format
4. Check App Store Connect access
```

### Secrets Not Working
```
1. Go to Settings → Secrets
2. Verify each secret exists
3. Check for typos in secret names
4. Secrets are case-sensitive!
5. Rerun workflow after updating
```

---

## 📝 Workflow File Location

```
.github/workflows/detox-build-deploy.yml
```

The workflow runs:
- On every push to main or feature/claude-haiku-impl
- On every pull request to main
- Manually via "Run workflow" button

---

## 🎯 Expected Flow

```
Developer makes changes
    ↓
Push to GitHub
    ↓
GitHub Actions triggers
    ↓
1️⃣  Test Job Starts
  - Installs dependencies
  - Builds test framework
  - Runs 40+ Detox tests
  - Duration: 10-15 min
    ↓
2️⃣  Build Job (if tests pass)
  - Builds for App Store
  - Creates IPA
  - Duration: 15-20 min
    ↓
3️⃣  Deploy Job (if on main + build pass)
  - Submits to TestFlight
  - Notifies Apple
  - Duration: 5 min
    ↓
✅ BUILD COMPLETE
  - Check TestFlight for new build
  - Monitor for any crashes
  - Prepare for App Store submission
```

---

## 📞 Need Help?

1. **EAS Issues**: https://docs.expo.dev/build/overview/
2. **GitHub Actions**: https://docs.github.com/en/actions
3. **Apple Certificates**: https://developer.apple.com/account/
4. **TestFlight**: https://help.apple.com/app-store-connect/#/devf6cf73ba4

---

**Setup Time:** 10-15 minutes
**Complexity:** Beginner-friendly
**Support:** Check links above if stuck
