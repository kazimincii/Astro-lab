# Production Deployment Guide

## 📦 App Store Release Checklist

### Phase 1: Environment Configuration

#### 1.1 Environment Variables

File: `astrology-app/mobile/.env.production`

```bash
# API Configuration
REACT_APP_API_BASE_URL=https://api.astrology.app/v1
REACT_APP_API_TIMEOUT=30000

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51234567890abcdef
REACT_APP_STRIPE_MERCHANT_ID=com.astrologyapp.superapp

# App Configuration
REACT_APP_APP_GROUP_ID=group.com.astrologyapp.superapp
REACT_APP_VERSION=1.0.0
REACT_APP_BUILD_NUMBER=1

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CRASH_REPORTING=true
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true

# Anthropic AI
REACT_APP_ANTHROPIC_ENABLED=true
REACT_APP_ANTHROPIC_MODEL=claude-haiku-4.5
```

#### 1.2 Backend Configuration

File: `.env.production` (Backend)

```bash
# Node Environment
NODE_ENV=production
PORT=3000

# Database
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_USERNAME=prod_user
DB_PASSWORD=<secure-password>
DB_DATABASE=astrology_prod
DB_SSL=true

# JWT
JWT_SECRET=<very-long-secure-secret>
JWT_EXPIRATION=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_51234567890abcdef
STRIPE_PUBLISHABLE_KEY=pk_live_51234567890abcdef
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef

# Anthropic AI
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-<key>
ANTHROPIC_MODEL=claude-haiku-4.5

# Redis
REDIS_HOST=prod-redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=<secure-password>

# AWS (for ECR, S3, etc)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_S3_BUCKET=astrology-prod

# Email/Notifications
SENDGRID_API_KEY=<key>
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>

# Monitoring
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxxx
DATADOG_API_KEY=<key>
```

### Phase 2: App Store Metadata

#### 2.1 App Information

**Display Name:** Astrology Super App
**Bundle ID:** com.astrologyapp.superapp
**Version:** 1.0.0
**Build Number:** 1
**SKU:** ASTRO-APP-001

#### 2.2 Primary Category

- Category: Lifestyle
- Secondary Category: Health & Fitness

#### 2.3 Content Rating

Complete IARC questionnaire:
- Violence: None
- Sexual Content: None
- Profanity: None
- Alcohol/Tobacco: None

#### 2.4 Localization

**Languages:**
- English (Primary)
- Turkish

**Localized Metadata:**

English:
```
Title: Astrology Super App
Subtitle: Your Daily Cosmic Guide
Description: Discover your destiny through ancient astrological wisdom...
Keywords: astrology, horoscope, birth chart, moon phase
Promotional Text: Start your journey to cosmic enlightenment!
```

Turkish:
```
Başlık: Astroloji Süper Uygulaması
Altyazı: Günlük Kozmik Rehberiniz
Açıklama: Antik astroloji bilgeliği aracılığıyla kaderi keşfet...
Anahtar Kelimeler: astroloji, horoskop, doğum haritası, ay fazı
```

#### 2.5 Privacy Policy & Terms

**Privacy Policy URL:**
```
https://astrology.app/privacy-policy
```

**Content:**
- Data collection practices
- Third-party service providers (Stripe, Anthropic AI)
- User rights and data protection
- GDPR/CCPA compliance

**Terms of Service URL:**
```
https://astrology.app/terms-of-service
```

**Content:**
- User responsibilities
- Subscription terms
- Refund policy
- Liability limitations
- Account termination

---

### Phase 3: App Store Screenshots

#### 3.1 Screenshot Requirements

**Device:** iPhone 14 Pro Max (6.7")
**Format:** JPEG or PNG
**Size:** 1242 x 2688 pixels
**Safe Area:** Leave 20px margin on all sides

#### 3.2 Screenshot Set (5 screens minimum)

1. **Onboarding/Login**
   ```
   Title: "Your Personal Cosmic Guide"
   Subtitle: "Discover your birth chart and daily horoscope"
   ```

2. **Daily Horoscope**
   ```
   Shows: Today's horoscope card
   Title: "Daily Insights"
   ```

3. **Birth Chart**
   ```
   Shows: Birth chart visualization
   Title: "Your Unique Blueprint"
   ```

4. **AI Assistant**
   ```
   Shows: Chat interface with AI
   Title: "Cosmic Intelligence"
   ```

5. **Premium Features**
   ```
   Shows: Features overview
   Title: "Unlock Your Potential"
   ```

#### 3.3 App Preview Video (Optional)

- Duration: 15-30 seconds
- Format: .mov (H.264 codec)
- Resolution: 1242 x 2688 pixels
- Sequence:
  1. App launch (2s)
  2. Navigate features (10s)
  3. Show main functionality (10s)
  4. End screen (3s)

---

### Phase 4: Build Configuration

#### 4.1 Xcode Build Settings

```bash
# Set version
agvtool new-marketing-version 1.0.0
agvtool new-build-version 1

# Build for production
xcodebuild -project ios/AstrologyApp.xcodeproj \
  -scheme "Astrology Super App" \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/AstrologyApp.xcarchive \
  -allowProvisioningUpdates \
  archive
```

#### 4.2 Code Signing

```bash
# Export archive for App Store
xcodebuild -exportArchive \
  -archivePath build/AstrologyApp.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath build/ipa
```

**exportOptions.plist:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>thinning</key>
    <string><none></string>
</dict>
</plist>
```

---

### Phase 5: TestFlight Beta Testing

#### 5.1 Internal Testing

**Testers:** Team members (max 100)

```bash
# Upload to TestFlight
eas submit --platform ios --auto-submit-to-testflight
```

**Duration:** 2 weeks
**Focus:**
- Feature validation
- Bug hunting
- Performance testing
- Crash reporting

#### 5.2 External Testing

**Testers:** Limited beta users (max 10,000)

**Recruitment:**
- Email mailing list
- Social media
- In-app notification

**Review Form:**
```markdown
# TestFlight Feedback Form

1. Did the app crash? (Yes/No)
2. What's your primary use case? (Select one)
   - Daily horoscope
   - Birth chart analysis
   - AI chat
   - Premium features
3. What features need improvement?
4. Overall rating? (1-5 stars)
5. Additional comments?
```

#### 5.3 Feedback Review

- Address critical crashes within 24 hours
- Implement high-impact feature requests
- Minor bug fixes as patches
- Performance optimizations

---

### Phase 6: App Store Submission

#### 6.1 Pre-Submission Checklist

- [ ] All crashes resolved
- [ ] Performance optimized (< 3s launch time)
- [ ] Screenshots uploaded
- [ ] Metadata complete and reviewed
- [ ] Privacy policy and terms published
- [ ] Localization verified
- [ ] Version number incremented
- [ ] Build number incremented
- [ ] All required permissions justified
- [ ] No hardcoded secrets in code
- [ ] No external links to bypass App Store
- [ ] Rating age appropriate
- [ ] Keyboard dismissal works

#### 6.2 Submit for Review

```bash
# In App Store Connect
1. Go to "My Apps" > "Astrology Super App"
2. Select version "1.0"
3. Click "Submit for Review"
4. Fill out review notes
5. Select "Automatic release"
```

**Review Notes:**
```
This app provides astrological insights and daily horoscopes.
Features include:
- Birth chart analysis
- Daily horoscope readings
- AI-powered cosmic insights
- Premium subscription for advanced features

Testing Account (optional):
Email: testuser@example.com
Password: TestPassword123

The app uses Stripe for payments and Anthropic Claude AI for insights.
All user data is encrypted and privacy-compliant.
```

#### 6.3 Apple Review Process

- **Duration:** 24-48 hours typically
- **Outcomes:**
  - ✅ Approved → Ready to release
  - ⚠️ Needs Adjustment → Fix and resubmit
  - ❌ Rejected → Address issues and resubmit

**Common Rejection Reasons:**
1. Incomplete metadata
2. Crashes on startup
3. Unclear privacy practices
4. Misleading screenshots
5. Terms not visible
6. Crashing during review
7. Performance issues

#### 6.4 Release Strategy

**Option A: Automatic Release**
- Released immediately after approval

**Option B: Phased Release**
- Day 1: 10% of users
- Day 3: 50% of users
- Day 7: 100% of users
- Monitor crashes and rollback if needed

---

### Phase 7: Post-Launch Monitoring

#### 7.1 Crash Monitoring

```bash
# Via Sentry/Crashlytics
Monitor:
- Crash rate < 0.1%
- ANR (App Not Responding) < 0.05%
- Exceptions < 0.5%
- OOM (Out of Memory) incidents
```

#### 7.2 Performance Monitoring

```bash
# Datadog/Firebase Performance
Track:
- Cold launch time: < 3s
- Warm launch time: < 1s
- Screen load time: < 2s
- API response time: < 5s
- Memory usage: < 500MB
- Battery impact: < 5%
```

#### 7.3 Analytics

```bash
# Firebase Analytics
Monitor:
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session length
- Feature usage
- Conversion rate (trial→paid)
- Retention rate (Day 1, 7, 30)
```

#### 7.4 Support

- Response time: < 24 hours
- Email: support@astrology.app
- In-app chat: Available during business hours
- Common issues: FAQ in help center

---

### Phase 8: Updates & Maintenance

#### 8.1 Version Roadmap

**v1.1 (Week 4)**
- Performance optimizations
- UI polish
- Bug fixes

**v1.2 (Week 8)**
- Apple Watch app
- Siri shortcuts
- Enhanced notifications

**v2.0 (Quarter 2)**
- Multi-user profiles
- Social sharing
- Community features

#### 8.2 Update Submission

```bash
# For each update
1. Increment build number
2. Update CHANGELOG
3. Test on device
4. Create git tag: v1.0.1
5. Submit to App Store
```

#### 8.3 Bug Fix Priority

| Severity | Fix Time | Example |
|----------|----------|---------|
| Critical | < 4h | App crashes on launch |
| High | < 24h | Feature broken, payment issue |
| Medium | < 72h | UI glitch, performance |
| Low | Next release | Minor text, rare crash |

---

### Phase 9: Production Secrets Management

#### 9.1 GitHub Actions Secrets

```bash
# Set in GitHub repo settings
STRIPE_SECRET_KEY=sk_live_xxx
ANTHROPIC_API_KEY=sk-ant-xxx
DB_PASSWORD=xxx
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
SENTRY_AUTH_TOKEN=xxx
APP_STORE_CONNECT_KEY=xxx
```

#### 9.2 App Center Secrets

```bash
# For CI/CD deployments
appcenter secrets set \
  STRIPE_KEY=sk_live_xxx \
  ANTHROPIC_KEY=sk-ant-xxx \
  API_ENDPOINT=https://api.astrology.app
```

---

## Checklist

- [ ] Environment variables configured
- [ ] App Store metadata complete
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Screenshots created (5+)
- [ ] Promotional artwork (1024x768)
- [ ] Build archive created
- [ ] Code signing configured
- [ ] Secrets not exposed
- [ ] Performance optimized
- [ ] Crashes resolved
- [ ] TestFlight beta complete
- [ ] Submitted to App Store
- [ ] Monitoring configured
- [ ] Support email active
- [ ] Documentation ready

---

**Status:** ✅ Ready for App Store submission

**Deploy Date:** [To be determined]

**Approval Expected:** 24-48 hours

**Release Date:** [Subject to approval]
