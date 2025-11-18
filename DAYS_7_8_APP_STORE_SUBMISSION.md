# 📱 DAYS 7-8: APP STORE SUBMISSION

**Duration:** 8-10 hours (split across 2 days)  
**Owner:** Product Manager / Marketing  
**Prerequisite:** Days 1-6 completed + TestFlight testing done  

---

## 🎯 DAYS 7-8 OBJECTIVES

**Day 7:**
- [ ] Create screenshots (5+ per language)
- [ ] Fill App Store metadata
- [ ] Configure support information
- [ ] Complete rating questionnaire
- [ ] Prepare marketing description

**Day 8:**
- [ ] Final review of all metadata
- [ ] Add privacy policy & terms
- [ ] Configure pricing & availability
- [ ] Submit for App Store review
- [ ] Monitor review status

---

## 📋 PHASE 1: SCREENSHOT PREPARATION (2-3 hours)

### Step 1: Screenshot Specifications

Apple requires specific screenshot sizes:

```
iPhone Screenshots (Required):
- Format: PNG or JPG
- Size: 2796 × 1290 pixels
- Scale: 3:2 aspect ratio
- Count: 2-10 screenshots per language
- Recommended: 5 screenshots

Device Types Required:
☑ 6.7-inch display (iPhone 14 Pro Max)
☑ 5.5-inch display (iPhone 8 Plus) OR
☑ 6.5-inch display (iPhone XS Max)
☑ 12.9-inch display (iPad Pro) - if iPad version exists

Required Screenshots:
1. Login/Home screen
2. Feature highlight #1 (e.g., horoscope)
3. Feature highlight #2 (e.g., birth chart)
4. Feature highlight #3 (e.g., tarot)
5. Premium features / Subscription screen
```

### Step 2: Capture Screenshots

**Option 1: Use Real Device**

```bash
# On iPhone with TestFlight build:

1. Open app on iPhone
2. Navigate to first screen to showcase
3. Press: Volume Down + Side Button (simultaneously)
4. Screenshot saved to Photos
5. Repeat for each screen
6. Export 5-10 screenshots
7. Crop to: 2796 × 1290 if needed
```

**Option 2: Use Simulator**

```bash
# Using Xcode simulator:

1. Run: expo start --ios
2. Open simulator
3. Press: Cmd + S (take screenshot)
4. Save to file
5. Screenshot.png saved in ~/Library/...
6. Crop/resize to specs: 2796 × 1290
```

**Option 3: Use Design Tool**

```bash
# Create mockups in Figma:

1. Create artboard: 2796 × 1290
2. Add app screenshots as background
3. Add text overlays (optional):
   - "Personalized Horoscopes"
   - "Birth Chart Analysis"
   - etc.
4. Export as PNG
5. Multiple artboards = multiple screenshots
```

### Step 3: Edit Screenshots (Optional)

Add text overlays to highlight features:

```
Tool Options:
- Figma (free tier available)
- Canva (user-friendly)
- Adobe Express (online)
- Preview.app (macOS built-in)

Common overlays:
- App name
- Feature description
- Call to action
- Benefits/selling points
```

### Step 4: Organize Screenshots

```bash
# Create folder structure
mkdir -p Screenshots/{en-US,tr-TR}

# English (US) screenshots
cp screenshot1.png Screenshots/en-US/
cp screenshot2.png Screenshots/en-US/
cp screenshot3.png Screenshots/en-US/
# ... 5+ total

# Turkish screenshots (if supporting Turkish)
cp screenshot1_tr.png Screenshots/tr-TR/
cp screenshot2_tr.png Screenshots/tr-TR/
# ... 5+ total

# Each folder should have 5-10 screenshots
```

---

## 📝 PHASE 2: FILL APP STORE METADATA (2-3 hours)

### Login to App Store Connect

```
1. Go to: https://appstoreconnect.apple.com
2. Login with Apple ID
3. Select app: Astrology Super App
4. Go to: App Information
```

### Step 1: App Name & Subtitle

```
Primary Language: English (U.S.)

App Name (Max 30 chars):
"Astrology Super App"

Subtitle (Max 30 chars):
"Your Personal Cosmic Guide"

Keywords (Max 100 chars):
"astrology,horoscope,zodiac,birth chart,tarot,cosmic,wellness,daily forecast"

Category: Lifestyle

Content Ratings: Select rating for your app
```

### Step 2: App Description

```
App Description (Max 4000 chars):

"Discover your cosmic destiny with Astrology Super App, your personalized guide to the universe.

✨ Features:
• Daily personalized horoscopes
• Detailed birth chart analysis
• Tarot card readings
• Moon phase tracking
• Biorhythm charts
• Numerology readings
• Chakra alignment guides
• Cosmic calendar events

🌙 Premium Features:
• Unlimited readings
• Detailed compatibility analysis
• Personal cosmic reports
• Ad-free experience

Your stars are waiting. Download today!"

Marketing URL: (optional)
https://astrologyapp.com

Support URL:
https://astrologyapp.com/support

Privacy Policy URL:
https://astrologyapp.com/privacy

Terms of Service:
https://astrologyapp.com/terms
```

### Step 3: Upload Screenshots

```
In App Store Connect:

1. Go to: Screenshots section
2. Select size: "iPhone 6.7""
3. Drag and drop 5+ screenshots:
   ✓ screenshot1.png (Login/Home)
   ✓ screenshot2.png (Horoscope)
   ✓ screenshot3.png (Birth Chart)
   ✓ screenshot4.png (Tarot)
   ✓ screenshot5.png (Subscription)

4. Add optional text for each:
   - "Personalized Daily Horoscopes"
   - "Complete Birth Chart Analysis"
   - etc.

5. Save and move to next size category
```

### Step 4: Release Notes

```
What's New in This Version:

"🌟 Astrology Super App v1.0 - Initial Launch

Welcome to your cosmic journey!

✨ Features:
- Daily personalized horoscopes based on your zodiac
- Complete birth chart analysis
- Interactive tarot card readings
- Real-time moon phase tracking
- Personal biorhythm charts
- Numerology readings
- Chakra balance guides
- Important cosmic events calendar

🔐 Premium membership available for unlimited access to all features.

Thank you for downloading!"

(Max 4000 chars)
```

---

## 👤 PHASE 3: RATING & CONTENT (1 hour)

### Step 1: Age Rating Questionnaire

```
In App Store Connect:
Go to: Age Ratings

Answer questions about app content:

Cartoon or Fantasy Violence: None
Realistic Violence: None
Prolonged Graphic or Sadistic Violence: None
Pornographic or Erotic Material: None
Frequent/Intense Obscene/Profane Language: None
Graphic or Realistic Sexual Content and Nudity: None
Frequent or Intense Profanity or Crude Humor: None
Sexual Content, Nudity, Sexual Conduct or References: None
Alcohol, Tobacco, or Drug Use or Addiction: None
Gambling: None
Simulated Gambling: None
Horror/Fear Themes: None
Mature/Suggestive Themes: None
Unrestricted Web Access: None
Personal Information Collection: None
Genetic/Biometric Data: None
Sensitive Personal Information: None
Health Information: None
Kids Features: None

Result: 4+ age rating (Most apps get this)
```

### Step 2: Content Rights

```
Content Rights Checklist:
☑ Does not contain third-party materials
☑ Ownership/license to use all content
☑ Content appropriate for App Store
☑ No illegal activity in app
☑ Not misleading in description
```

### Step 3: Add Privacy Details

```
Under: Privacy
- Privacy Policy: [Enter HTTPS URL]
- Data Types Collected:
  ☑ User ID
  ☑ Email Address
  ☑ Birth Date
  ☑ Health & Fitness (optional)

- Purpose: Analytics and user experience

- Terms of Use: [Enter HTTPS URL]
```

---

## 💰 PHASE 4: PRICING & AVAILABILITY (30 minutes)

### Step 1: Set Pricing

```
Pricing Tier Options:
☑ Free (with subscription IAP)
☑ Free (1.99)
☑ Free (4.99)
☑ Free (9.99)
☑ Free (99.99)

For this app: Free (with In-App Purchase)

In-App Purchase Pricing:
- Free Trial: 7 days
- Standard: $9.99/month
- Yearly: $79.99/year
```

### Step 2: Availability

```
Release Type:
☑ Automatic release on approval
  (Releases immediately when approved)

OR

☐ Manual release
  (You decide when to release)

Recommended: Automatic release

Availability:
☑ Available worldwide
☑ Specific countries: [Select if needed]
```

### Step 3: Rights & Certifications

```
☑ Uses Sign in with Apple (if applicable)
☑ Uses local network (if applicable)
☑ Export Compliance: Select No (unless cryptography)
☑ Encryption: Not applicable
```

---

## ✅ PHASE 5: PRE-SUBMISSION REVIEW (1 hour)

### Review Checklist

```
BEFORE SUBMITTING:

Metadata:
☑ App name filled
☑ Subtitle filled
☑ Description complete and accurate
☑ Keywords relevant
☑ Category selected

Screenshots:
☑ 5+ screenshots uploaded
☑ Correct size (2796 × 1290)
☑ Relevant to app features
☑ No placeholder images
☑ Clear and professional

Content:
☑ Age rating completed
☑ Content rights verified
☑ Privacy policy URL valid (test it)
☑ Terms of service URL valid
☑ Support URL valid

Technical:
☑ Latest build version uploaded
☑ Code signing valid
☑ Provisioning profiles current
☑ TestFlight testing positive
☑ No known bugs

App Store Review:
☑ Doesn't contain personal info
☑ Doesn't require external account
☑ Follows Apple guidelines
☑ Uses approved APIs
☑ Not misleading in description
```

### Common Rejections to Avoid

```
❌ Misleading description
   → Be honest about features
   → Don't oversell

❌ Broken links
   → Test all URLs: privacy, support, etc.
   → Use HTTPS, not HTTP

❌ Requires external account
   → Email signup is OK
   → Third-party OAuth OK

❌ Poor performance/crashes
   → Should be fixed by TestFlight
   → QA should have tested

❌ Violation of guidelines
   → Review Apple App Store Review Guidelines
   → Avoid unreviewed content
   → No unlicensed music/art
```

---

## 📤 PHASE 6: SUBMIT FOR REVIEW (Day 8)

### Step 1: Final Review

```
1. Go to: App Store Connect
2. Select: Your app
3. Go to: App Information
4. Scroll to bottom: "Submission"
5. Review: Everything looks good? ✅
```

### Step 2: Build Selection

```
1. Click: Select a Build
2. Choose: Latest production build
3. Verify: v1.0.0, Build #X
4. Submit: Confirm build selected
```

### Step 3: Review Information

```
Add review notes (optional):

"This is the initial launch of Astrology Super App. 
The app provides personalized horoscopes, birth chart 
analysis, and tarot readings. TestFlight testing 
completed successfully on multiple devices."

Max 4000 chars
```

### Step 4: SUBMIT!

```
Click: SUBMIT FOR REVIEW

You'll see:
"✓ Submitted successfully"
"Status: Waiting for Review"

Expected review time:
- Average: 24-48 hours
- Typical: 1-2 days

You can monitor status in:
App Store Connect → Your App → Version
```

---

## 📊 PHASE 7: MONITOR REVIEW STATUS (Day 8 onwards)

### Check Status Daily

```
In App Store Connect:
1. Select Your App
2. Check Version Status:
   - Waiting for Review (1-2 days)
   - In Review (current review)
   - Ready for Sale (approved!)
   - Rejected (need to fix)
```

### If Approved

```
Status: Ready for Sale
Options:
☑ Release automatically (recommended)
☑ Release manually (you choose date)

After approval:
- Users see in App Store
- Downloads begin immediately
- Analytics start tracking
```

### If Rejected

```
Read rejection reason carefully:
Common reasons:
1. Guideline violation
2. Performance issue
3. Feature not working
4. Privacy concern
5. Metadata issue

Actions:
1. Fix the issue
2. Update build if needed
3. Update metadata if needed
4. Resubmit for review
5. Wait another 24-48 hours
```

---

## ✅ Days 7-8 Complete Checklist

```
PHASE 1: Screenshot Prep
☑ 5+ screenshots captured
☑ Correct size (2796 × 1290)
☑ High quality and clear
☑ Show key features
☑ Organized by language

PHASE 2: Metadata Filled
☑ App name & subtitle
☑ Description complete
☑ Keywords relevant
☑ Support & privacy URLs
☑ Release notes added

PHASE 3: Rating & Content
☑ Age rating completed
☑ Content rights verified
☑ Privacy policy configured
☑ Terms of service linked
☑ Content rights confirmed

PHASE 4: Pricing Set
☑ Pricing tier selected
☑ Free with IAP configured
☑ Subscription pricing set
☑ Availability set worldwide
☑ Release type selected

PHASE 5: Pre-Review Done
☑ Full checklist completed
☑ All links verified
☑ TestFlight positive
☑ No known issues
☑ Ready for submission

PHASE 6: Submitted
☑ Build selected
☑ Review notes added
☑ Submitted successfully
☑ Confirmation received
☑ Status monitoring started

PHASE 7: Monitoring
☑ Check status daily
☑ Respond to any rejections
☑ Prepare for approval
☑ Plan launch announcement
```

**Time Spent:** 8-10 hours across 2 days ✅

---

## 📞 SUPPORT & GUIDANCE

### Apple App Review Guidelines
- https://developer.apple.com/app-store/review/guidelines/

### Common Issues & Solutions
- https://help.apple.com/app-store-connect/

### Contact Apple
- Report Issue: app-review@apple.com
- Support: https://developer.apple.com/support

---

## 🎉 READY FOR LAUNCH!

Once Days 7-8 complete:

```
✅ Submitted to App Store
✅ In review (24-48 hours wait)
✅ Ready for approval
✅ Marketing team prepared
✅ Ready for Day 9: LAUNCH!

Next Phase: Day 9 (Launch)
Duration: 1-2 hours
Owner: Team Lead / Marketing
```

---

**Expected Completion:** Days 7-8 complete after 8-10 hours  
**Status When Done:** Submitted to App Store, Awaiting Review ⏳
