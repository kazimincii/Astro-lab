# Production Build & EAS Setup Guide

## 📦 EAS Build Configuration

### ADIM 1: EAS Account Setup

```bash
# EAS CLI yükle
npm install -g eas-cli

# EAS'e login ol
eas login

# Email ve şifre gir (https://expo.dev hesabı)
```

### ADIM 2: eas.json Configuration

**File: `mobile/eas.json`**

```json
{
  "build": {
    "preview": {
      "ios": {
        "resourceClass": "default"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "default",
        "autoIncrement": true,
        "provisioning": "automatic"
      }
    },
    "submit": {
      "production": {}
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "123456789",
        "appleTeamId": "TEAM123456"
      }
    }
  }
}
```

### ADIM 3: Build for Production

```bash
cd mobile

# Production build create et
eas build --platform ios --profile production

# Output: Build ID ve IPA file URL
```

**Beklenen sonuç:**
```
✅ Build created successfully
📦 Download IPA: https://...
```

---

## 🧪 TestFlight Beta Distribution

### ADIM 4: Upload to TestFlight

```bash
# Automatically submit to TestFlight
eas submit --platform ios --auto-submit-to-testflight

# Or manually upload
eas submit --platform ios --platform=ios
```

### ADIM 5: TestFlight Configuration

**App Store Connect'te:**

1. **TestFlight → Internal Testing**
   - Add testers (email addresses)
   - Approve builds
   - Send notifications

2. **External Testing (Optional)**
   - Add up to 10,000 beta testers
   - Create public link
   - Share feedback form

---

## 🎯 App Store Submission

### ADIM 6: Prepare App Store Metadata

**App Store Connect'te:**

1. **App Information**
   - Bundle ID: `com.astrologyapp.superapp`
   - Primary Language: English
   - Category: Lifestyle

2. **Localization**
   - English (EN)
   - Turkish (TR)
   - Add display names, descriptions, keywords

3. **Content Rating**
   - Complete IARC questionnaire
   - No violence, adult content, etc.

4. **Privacy Policy**
   - Privacy Policy URL: https://astrology.app/privacy-policy
   - Terms of Service: https://astrology.app/terms-of-service

### ADIM 7: Screenshots & Metadata

**Required for App Store:**

```
Screenshots (5 minimum):
1. Onboarding / Login (1242 x 2688)
2. Daily Horoscope (1242 x 2688)
3. Birth Chart (1242 x 2688)
4. AI Chat (1242 x 2688)
5. Premium Features (1242 x 2688)

Preview Video (Optional):
- 15-30 seconds
- .mov format
- 1242 x 2688 resolution
```

### ADIM 8: App Store Submission

**App Store Connect'te:**

1. **Version Information**
   - Version: 1.0.0
   - Build: Select from TestFlight
   - Release Notes: "Initial release"

2. **Build Selection**
   - Select latest build from TestFlight
   - Click "Add"

3. **Submission**
   - Click "Submit for Review"
   - Answer compliance questions
   - Click "Submit"

**Expected Review Time:** 24-48 hours

---

## 🚀 Auto-Submit with EAS

```bash
# One-command production release
eas build --platform ios --profile production --auto-submit

# This will:
# 1. Create production build
# 2. Upload to App Store
# 3. Submit for review
```

---

## 📋 Submission Checklist

- [ ] App version incremented
- [ ] Build number incremented
- [ ] Privacy policy URL valid
- [ ] Terms of service URL valid
- [ ] Screenshots 1242x2688 format
- [ ] Metadata in English & Turkish
- [ ] No hardcoded secrets
- [ ] No external payment links
- [ ] TestFlight beta testing complete
- [ ] All critical bugs fixed
- [ ] App launches without crashes
- [ ] Performance optimized (< 3s startup)

---

## ⚙️ Environment Setup

### Required Secrets (GitHub Actions)

```bash
# .github/workflows/deploy.yml

APPLE_ID: your-apple-id@example.com
APPLE_APP_SPECIFIC_PASSWORD: xxxx-xxxx-xxxx-xxxx
APPLE_TEAM_ID: TEAM123456
EXPO_TOKEN: expo-token-here
EAS_TOKEN: eas-token-here
```

### Build Script

**File: `mobile/scripts/build-production.sh`**

```bash
#!/bin/bash

set -e

echo "🚀 Building production iOS app..."

# Increment build number
agvtool new-build-version "$(date +%s)"

# Create production build
eas build --platform ios --profile production

echo "✅ Build complete! Check App Store Connect for status."
```

---

## 🔄 Post-Launch Monitoring

### App Store Metrics

- **Crash Rate:** Monitor via App Store Connect
- **Performance:** Average session length, retention
- **Ratings:** Respond to user reviews
- **Updates:** Plan v1.1 features

### Monitoring Services

```bash
# Sentry crash reporting
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxxx

# Firebase Analytics
FIREBASE_PROJECT_ID=astrology-prod

# Datadog performance monitoring
DATADOG_API_KEY=xxx
```

---

## 🐛 Common Issues

### Build Fails
→ Check .env.production variables  
→ Verify Xcode build settings  
→ Run `pod install --repo-update`

### Submission Rejected
→ Check Apple review guidelines  
→ Verify privacy policy compliance  
→ Check for hardcoded URLs or links

### TestFlight Not Signing
→ Verify Apple certificates  
→ Check team ID matches  
→ Ensure Apple ID has correct permissions

---

## 📞 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/setup/)
- [App Store Connect Help](https://help.apple.com/app-store-connect)
- [Apple Review Guidelines](https://developer.apple.com/app-store/review/)
- [Expo Submit Guide](https://docs.expo.dev/submit/ios/)

---

**Estimated Time:** 6-8 hours (including TestFlight testing)
**Status:** Ready for implementation
