# Deployment Guide - Astrology App Mobile

Bu rehber, Astrology App mobile uygulamasını production'a deploy etmek için gereken adımları açıklar.

## 📋 İçindekiler

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [iOS Build & Deploy](#ios-build--deploy)
4. [Android Build & Deploy](#android-build--deploy)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Analytics](#monitoring--analytics)
7. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### Code Quality

- [ ] Tüm TypeScript hataları giderildi
- [ ] Linter warnings temizlendi (`npm run lint`)
- [ ] Testler çalışıyor (`npm test`)
- [ ] Test coverage >70%
- [ ] Code review tamamlandı

### Features

- [ ] Tüm MVP features tamamlandı
- [ ] Critical bugs giderildi
- [ ] Performance optimizasyonları yapıldı
- [ ] Memory leaks kontrol edildi
- [ ] Deep linking test edildi

### Security

- [ ] API keys güvende (environment variables)
- [ ] Sensitive data şifreleniyor
- [ ] SSL/TLS certificate validation aktif
- [ ] Input validation yapılıyor
- [ ] Authentication güvenli

### Legal & Compliance

- [ ] Privacy Policy hazır
- [ ] Terms of Service hazır
- [ ] GDPR/KVKK compliance sağlandı
- [ ] App Store guidelines karşılanıyor
- [ ] Copyright/licensing düzgün

---

## Environment Setup

### 1. Production Environment Variables

`.env.production` oluştur:

```env
# API Configuration
API_BASE_URL=https://api.astrology.com/v1
API_TIMEOUT=30000

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here

# App Configuration
APP_ENV=production
APP_VERSION=1.0.0
APP_BUILD_NUMBER=1

# iOS
APP_GROUP_ID=group.com.astrology.shared
URL_SCHEME=astrology

# Analytics (Optional)
SENTRY_DSN=https://your-sentry-dsn
MIXPANEL_TOKEN=your_mixpanel_token
```

### 2. Backend Production URL

Backend API'nin production URL'ini ayarla:
- Staging: `https://staging-api.astrology.com`
- Production: `https://api.astrology.com`

### 3. Stripe Live Keys

1. Stripe Dashboard → Toggle to "Live mode"
2. Live publishable key'i al
3. `.env.production`'a ekle
4. Backend'de de live secret key kullan

---

## iOS Build & Deploy

### 1. Xcode Project Hazırlığı

```bash
# Prebuild iOS project
cd mobile
npx expo prebuild --platform ios --clean
```

### 2. Signing & Capabilities

1. Xcode'da projeyi aç:
   ```bash
   cd ios
   open AstrologyApp.xcworkspace
   ```

2. **Signing & Capabilities** → Automatic Signing

3. **Team** seç (Apple Developer Program membership gerekli)

4. **Bundle Identifier** ayarla:
   - Format: `com.astrology.app`
   - Unique olmalı

5. **App Groups** ekle (iOS Widgets için):
   - `group.com.astrology.shared`

6. **Push Notifications** capability ekle (opsiyonel)

### 3. Version & Build Number

```typescript
// app.json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

### 4. Assets & Icons

```bash
# App Icon (1024x1024 PNG)
mobile/assets/icon.png

# Splash Screen (1242x2688 PNG)
mobile/assets/splash.png

# Adaptive Icon (Android - 432x432 PNG)
mobile/assets/adaptive-icon.png
```

### 5. EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### 6. Manual Build (Alternative)

```bash
# Build in Xcode
# Product → Archive
# Window → Organizer → Distribute App → App Store Connect
```

### 7. App Store Connect

1. [App Store Connect](https://appstoreconnect.apple.com)'e git
2. "My Apps" → "+" → "New App"
3. App bilgilerini doldur:
   - Name: "Astrology App"
   - Primary Language: Turkish
   - Bundle ID: Seç (com.astrology.app)
   - SKU: astrology-app-001

4. **App Information**:
   - Category: Lifestyle
   - Content Rights: Yes, contains third-party content
   - Age Rating: 4+

5. **Pricing**:
   - Free App
   - In-App Purchases: Yes

6. **App Privacy**:
   - Data collection: Email, Name, Birth Date
   - Data usage: App functionality, Analytics

7. **Screenshots** (gerekli):
   - 6.7" Display: 1290 x 2796 (5 screenshot)
   - 6.5" Display: 1242 x 2688 (5 screenshot)
   - 5.5" Display: 1242 x 2208 (opsiyonel)

8. **App Preview Video** (opsiyonel):
   - Max 30 saniye
   - Format: .mov veya .mp4

9. **Description**:
```
Discover your cosmic destiny with Astrology App!

✨ FEATURES:
• Daily horoscopes personalized for you
• Advanced birth chart analysis
• Compatibility reports
• Tarot & coffee reading
• Numerology insights
• Live astrologer consultations
• iOS widgets for quick access

🌙 PREMIUM FEATURES:
• Unlimited premium actions
• Up to 50 profiles
• Advanced forecasts
• Priority support

Download now and unlock the secrets of the stars! 🌟
```

10. **Keywords**:
```
astrology, horoscope, zodiac, birth chart, tarot, numerology, compatibility
```

11. **Support URL**: `https://astrology.com/support`
12. **Marketing URL**: `https://astrology.com`
13. **Privacy Policy URL**: `https://astrology.com/privacy`

14. **Build** upload et (EAS veya Xcode ile)

15. **Submit for Review**

### 8. TestFlight (Beta Testing)

```bash
# TestFlight build
eas build --platform ios --profile preview

# TestFlight'ta test kullanıcıları ekle
# App Store Connect → TestFlight → Internal Testing
```

---

## Android Build & Deploy

### 1. Android Project Hazırlığı

```bash
# Prebuild Android project
npx expo prebuild --platform android --clean
```

### 2. Keystore Oluştur

```bash
# Production keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore astrology-release.keystore \
  -alias astrology-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Keystore'u güvenli bir yere kaydet
# ~/.android/astrology-release.keystore
```

### 3. Gradle Configuration

`android/app/build.gradle`:

```gradle
android {
  signingConfigs {
    release {
      storeFile file(ASTROLOGY_RELEASE_STORE_FILE)
      storePassword ASTROLOGY_RELEASE_STORE_PASSWORD
      keyAlias ASTROLOGY_RELEASE_KEY_ALIAS
      keyPassword ASTROLOGY_RELEASE_KEY_PASSWORD
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
  }
}
```

### 4. Version & Build Number

```json
// app.json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1,
      "package": "com.astrology.app"
    }
  }
}
```

### 5. EAS Build

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

### 6. Google Play Console

1. [Google Play Console](https://play.google.com/console)'a git
2. "Create app"
3. App details:
   - Name: "Astrology App"
   - Default language: Turkish
   - App or game: App
   - Free or paid: Free

4. **Store listing**:
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (gerekli):
     - Phone: 1080 x 1920 (2-8 screenshots)
     - 7" Tablet: 1200 x 1920 (opsiyonel)
     - 10" Tablet: 1600 x 2560 (opsiyonel)
   - App icon: 512 x 512 PNG
   - Feature graphic: 1024 x 500 PNG

5. **Content rating**:
   - Questionnaire doldur
   - Category: PEGI 3 / Everyone

6. **Privacy Policy URL**: `https://astrology.com/privacy`

7. **App content**:
   - Ads: No
   - In-app purchases: Yes
   - Target audience: Everyone

8. **Production** track'e release yükle

9. **Review & Publish**

---

## CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx eas-cli build --platform ios --profile production --non-interactive

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx eas-cli build --platform android --profile production --non-interactive
```

---

## Monitoring & Analytics

### 1. Sentry (Crash Reporting)

```bash
npm install @sentry/react-native
```

```typescript
// App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  enabled: process.env.APP_ENV === 'production',
});
```

### 2. Analytics (Optional)

```bash
# Mixpanel
npm install mixpanel-react-native

# Firebase Analytics
npm install @react-native-firebase/analytics
```

### 3. Performance Monitoring

```bash
# React Native Performance
npm install @shopify/react-native-performance
```

---

## Post-Deployment

### Immediate (Day 1)

- [ ] App Store/Play Store'da görünüyor mu kontrol et
- [ ] Download ve install test et
- [ ] Critical flows test et (login, signup, payment)
- [ ] Crash reports izle (Sentry)
- [ ] Backend logs kontrol et

### First Week

- [ ] User feedback topla
- [ ] Analytics metrikleri izle:
  - DAU/MAU
  - Retention rate
  - Conversion rate
  - Error rate
- [ ] Performance metrikleri:
  - App load time
  - API response time
  - Crash-free rate (>99%)

### Ongoing

- [ ] Haftalık release notes hazırla
- [ ] Bug fixes ve updates yayınla
- [ ] A/B testing yap
- [ ] User reviews'lara cevap ver

---

## Rollback Plan

### iOS

1. App Store Connect → Versions
2. Önceki version'ı "Submit for Review"
3. Expedited Review talep et (kritik bug için)

### Android

1. Google Play Console → Production
2. "Rollback" butonuna tıkla
3. Önceki version seç

---

## Support & Maintenance

### Monitoring Tools

- **Sentry**: Crash/error tracking
- **Analytics**: User behavior
- **App Store Connect**: Reviews, metrics
- **Google Play Console**: Reviews, crashes

### Regular Tasks

- **Weekly**: Bug fixes, minor updates
- **Monthly**: Feature releases
- **Quarterly**: Major version updates
- **Yearly**: iOS/Android SDK updates

---

## Resources

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

**Son Güncelleme**: 2024-11-16
**Versiyon**: MVP 1.0
