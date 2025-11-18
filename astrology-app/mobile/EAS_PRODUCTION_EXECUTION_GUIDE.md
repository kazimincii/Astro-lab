# EAS Production Build & Deployment - Execution Guide

## 🎯 8-Phase Production Pipeline

### ✅ Files Ready
```
✅ eas.json: EAS Build configuration
✅ app.json: Expo app configuration
✅ package.json: Build scripts
```

---

## ADIM 1: EAS Account Setup (15-20 min)

### 1.1 Create EAS Account
```bash
# Login to Expo
expo login

# Or create new account
expo register
```

### 1.2 Link Project
```bash
cd astrology-app/mobile

# Initialize EAS (if not done)
eas init --id <PROJECT_ID>

# Or use existing project
eas init
```

**Beklenen sonuç:**
```
✅ project.id saved to app.json
✅ eas.json created
✅ Ready for builds
```

### 1.3 Configure Apple Account
```bash
# Set up Apple credentials
eas credentials

# Choose iOS
# Authenticate with Apple ID
# Select team
# Create signing certificates
```

---

## ADIM 2: App Configuration (10-15 min)

### 2.1 Update app.json for Production

```json
{
  "expo": {
    "name": "Astrology Super App",
    "slug": "astrology-super-app",
    "version": "1.0.0",
    "runtimeVersion": "1.0.0",
    "newArchEnabled": false,
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1b2e"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.astrologyapp.superapp",
      "buildNumber": "1",
      "requireFullScreen": true,
      "infoPlist": {
        "NSCameraUsageDescription": "We need camera access for AR features",
        "NSLocationWhenInUseUsageDescription": "We use your location to determine your birth location",
        "NSHealthShareUsageDescription": "We access your health data for biorhythm features"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1b2e"
      },
      "package": "com.astrologyapp.superapp",
      "versionCode": 1,
      "permissions": ["INTERNET", "LOCATION", "CAMERA"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-font",
      "expo-image-picker"
    ]
  }
}
```

### 2.2 Create App Store Connect Record
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "Apps"
3. Click "+"
4. Fill in:
   - App Name: "Astrology Super App"
   - Platform: iOS
   - Primary Language: English
   - Bundle ID: com.astrologyapp.superapp
   - SKU: astrology-super-app
   - Access Level: Full Access

---

## ADIM 3: Build for Production (30-45 min)

### 3.1 Increment Version & Build Number

```json
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

### 3.2 Create Production Build

```bash
# Option 1: Command line
eas build --platform ios --profile production

# Option 2: Interactive
eas build --platform ios

# Then select "production" profile
```

**Build process outputs:**
```
✅ Building with EAS...
✅ Provisioning certificates...
✅ Building app archive...
✅ Signing with team certificate...
✅ Build complete: astrology-superapp-1.0.0.ipa
```

### 3.3 Wait for Build Completion
- Check status: `eas build:list`
- Builds take 10-15 minutes
- Get notified via email when complete

### 3.4 Download Build Artifact

```bash
# Download IPA
eas build:download <BUILD_ID>

# Or from EAS dashboard
# - Open build in browser
# - Click "Download"
```

---

## ADIM 4: TestFlight Distribution (5-10 min)

### 4.1 Internal Testing (Team)

```bash
# Submit to TestFlight (internal)
eas submit --platform ios --profile production

# Or manual submit:
# 1. App Store Connect → Your App → TestFlight → Internal Testing
# 2. Upload IPA
# 3. Fill in test info
# 4. Submit for review
```

**Test info template:**
```
App Name: Astrology Super App
Version: 1.0.0
Build: 1

Description:
Complete astrology app with horoscopes, birth charts, tarot readings, and biorhythm tracking. 
Features include daily horoscopes, advanced charts, tarot divination, numerology, chakra 
alignment, moon phase tracking, educational content, and premium subscription features.

Test Instructions:
1. Register with email and create profile
2. Select birth date/time and location
3. Navigate through all main features
4. Test daily horoscope, birth chart, tarot
5. Try premium features with trial access
6. Verify subscription purchase (use sandbox payment)
7. Test settings and language switching

Feedback Email: support@astrologyapp.com
```

### 4.2 Add Internal Testers

```bash
# In App Store Connect:
1. TestFlight → Internal Testing
2. Click "+"
3. Add team members by email
4. Send invitations
```

### 4.3 Monitor TestFlight Builds

```
Status indicators:
⏳ "Processing..." - App under review
✅ "Ready for testing" - Available for download
❌ "Expired" - Build expired (90 days)
```

### 4.4 External Testing (Optional)

For wider testing (up to 10,000 testers):

```
1. TestFlight → External Testing
2. Create testing group
3. Add external testers by email
4. Fill in test details
5. Apple reviews (usually 24-48 hours)
6. Once approved, testers can download
```

---

## ADIM 5: App Store Metadata (20-30 min)

### 5.1 Fill Basic Information

```
App Store Connect → Your App → App Information
- App Name: Astrology Super App
- Subtitle: Horoscope & Cosmic Guidance
- Category: Lifestyle
- Sub-category: Health & Fitness
```

### 5.2 Content Rating

```
1. Go to Age Rating Questionnaire
2. Answer questions about app content
3. Get rating (4+, 12+, 17+)

Example answers for astrology app:
- Violence: No
- Sexual content: No
- Profanity: No
- Gambling: No (unless using in-app purchases)
```

### 5.3 App Privacy

```
App Privacy Policy

Your app needs to declare what data it collects:

REQUIRED FIELDS:
- Data collected: Email (registration), Birth date/time (astrology)
- Location data: Yes (if using location)
- Health data: Yes (if using HealthKit)
- Tracking: No (unless analytics)
- Third-party sharing: Stripe (payments), Firebase (analytics)

Privacy Policy URL: https://astrologyapp.com/privacy
```

### 5.4 App Review Information

```
Contact Information:
- First Name: [Your name]
- Last Name: [Your name]
- Email: support@astrologyapp.com
- Phone: +[phone number]

Demo Account:
- Username: testuser@example.com
- Password: TestPass123

Notes:
"Premium features can be tested with free trial. 
Use sandbox payment method: 4242 4242 4242 4242"
```

---

## ADIM 6: Screenshots & Promotional Media (30-45 min)

### 6.1 Screenshot Requirements

```
iPhone 15 Pro Max (6.7"):
- 2796 x 1290 pixels (Retina)
- PNG or JPEG format
- 5 minimum, 10 recommended

Device requirements:
- Home screen with horoscope
- Birth chart visualization
- Tarot reading
- Premium subscription screen
- Settings/profile screen
```

### 6.2 Create Screenshots Using Tools

```bash
# Option 1: Figma template (recommended)
# Create mock-ups in Figma matching device dimensions

# Option 2: App-based screenshot
# Record actual app screenshots on device
# Resize to required dimensions

# Option 3: Tools
# - Screenshot.rocks (add device frames)
# - Previewed (device mockups)
# - Figma device mockup plugin
```

### 6.3 Upload Screenshots

```
App Store Connect → Version → Screenshots
1. Select device: iPhone 15 Pro Max
2. Upload 5-10 screenshots
3. Add captions for each screenshot
4. Example captions:
   - "Daily horoscope and cosmic updates"
   - "Detailed birth chart analysis"
   - "Tarot reading and interpretation"
   - "Biorhythm tracking"
   - "Premium features with subscription"
```

### 6.4 App Preview (Optional)

```
Max 30 seconds, shows app in action
Requirements:
- 1080 x 1920 (portrait) or 1920 x 1080 (landscape)
- MP4 or MOV format
- No audio required

Example preview flow:
1. App launch animation (2s)
2. Daily horoscope (5s)
3. Birth chart interaction (5s)
4. Tarot card flip (5s)
5. Premium offer (3s)
6. Feature highlights (5s)
```

---

## ADIM 7: Version Submission (5-10 min)

### 7.1 Prepare Build for Submission

```bash
# Increment version if needed
eas build --platform ios \
  --auto-submit \
  --auto-submit-to-testflight
```

### 7.2 Submit for App Store Review

```
App Store Connect → Version

1. Choose build: Select latest build
2. Version compliance:
   - Encryption: "No encryption"
   - IDFA: "Yes, we use IDFA"
   - Advertising: Select applicable
3. Notes:
   "Complete astrology app with subscription model.
   Premium features unlock after trial or purchase.
   No adult content or sensitive features."
4. Submit for Review
```

### 7.3 Fill Release Notes

```
Version 1.0.0 Release Notes:

🌟 Features:
- Daily personalized horoscope for all zodiac signs
- Detailed birth chart analysis with planetary positions
- Interactive tarot card readings
- Biorhythm tracking and predictions
- Moon phase tracker with predictions
- Numerology readings
- Chakra alignment guides
- Educational astrology content
- 7-day free trial of all premium features

🔐 Privacy & Security:
- Secure authentication with encrypted passwords
- Private profile data with GDPR compliance
- Secure payment processing via Stripe

🎨 Improvements:
- Optimized UI for iPhone 15/Pro
- Dark mode support
- Multi-language support (EN, TR)
- Smooth animations and transitions

🐛 Bug Fixes:
- Fixed biorhythm calculation accuracy
- Improved chart rendering performance
- Enhanced error messages

Enjoy your personalized cosmic guidance! 🌙✨
```

### 7.4 Review Status

```
Typical timeline:
⏳ "Waiting for Review" (1-3 days)
⏳ "In Review" (1-2 days)
✅ "Ready for Sale" - App approved!
❌ "Rejected" - Address feedback and resubmit
```

---

## ADIM 8: Post-Launch Monitoring (Ongoing)

### 8.1 Monitor Crashes

```
App Store Connect → Analytics → Crashes

Watch for:
- Exception rate > 1%
- Specific crash patterns
- Device-specific issues

Actions:
- Fix high-crash scenarios
- Submit bug fix builds
```

### 8.2 Track Metrics

```
Key metrics to monitor:
- Downloads
- Active users
- Retention (Day 1, Day 7, Day 30)
- Crash rate
- Average session length
- Revenue (if applicable)
```

### 8.3 Manage Ratings & Reviews

```
App Store Connect → Ratings & Reviews

Respond to:
- 1-star reviews (negative feedback)
- Feature requests in reviews
- Bug reports

Template response:
"Thank you for your review! We appreciate your feedback.
If you're experiencing issues, please contact 
support@astrologyapp.com with details.
We're constantly improving the app."
```

### 8.4 Version Management

```
For bug fixes:
1. Increment build number: "1.0.1"
2. Fix issues
3. Rebuild and test
4. Resubmit for review
5. Usually faster approval (1-2 days)

For major updates:
1. Increment minor version: "1.1.0"
2. Add new features
3. Test thoroughly
4. Submit with release notes
5. Normal review timeline (2-3 days)
```

---

## 📊 Production Checklist

### Pre-submission
- [ ] All features tested and working
- [ ] No console errors or warnings
- [ ] Performance optimized (<3s launch time)
- [ ] Crash rate < 0.5%
- [ ] All test IDs for analytics in place
- [ ] Privacy policy created and hosted
- [ ] Terms of service created and hosted
- [ ] Support email configured
- [ ] App icons and splash screens ready
- [ ] Screenshots created (5+)
- [ ] Build signed with correct certificate
- [ ] Version numbers correct (1.0.0, build 1)

### Content
- [ ] App description written
- [ ] Keywords optimized for discovery
- [ ] Screenshots have captions
- [ ] Release notes prepared
- [ ] Privacy policy uploaded
- [ ] Terms of service uploaded
- [ ] Support URL configured
- [ ] Contact information provided

### Technical
- [ ] TestFlight build tested on real device
- [ ] All permissions justified in app
- [ ] No hardcoded API keys or secrets
- [ ] Network requests have timeouts
- [ ] Offline handling implemented
- [ ] Dark mode tested
- [ ] Orientation handling correct
- [ ] Notch/safe area handling

### Metadata
- [ ] Rating set (4+, 12+, etc.)
- [ ] Category correct
- [ ] Content rating completed
- [ ] Age-appropriate content verified
- [ ] No copyright or trademark issues
- [ ] No claims that violate App Store guidelines

---

## 📞 Important Contacts

```
Apple Support:
- Technical issues: https://developer.apple.com/contact/
- App Review questions: developer.apple.com/contact/app-review
- Account issues: https://support.apple.com/en-us/HT204481

Your Support:
- Email: support@astrologyapp.com
- Website: https://astrologyapp.com
```

---

## 🚀 Example: Full Production Workflow

```bash
# 1. Setup
eas init
eas credentials

# 2. Prepare
# Update app.json with version 1.0.0, build 1
# Create screenshots and metadata
# Write release notes

# 3. Build
eas build --platform ios --profile production

# 4. TestFlight
eas submit --platform ios --profile production

# 5. Internal Testing
# Invite team members
# Collect feedback
# Fix any issues

# 6. App Store
# Fill metadata in App Store Connect
# Upload screenshots
# Submit for review

# 7. Monitor
# Watch analytics
# Respond to reviews
# Plan next version
```

---

**Status:** ✅ Ready for production deployment
**Estimated Total Time:** 2-3 days (including review)
**Next Version:** Plan v1.0.1 bug fixes if needed

