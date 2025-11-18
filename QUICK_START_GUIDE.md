# 🚀 QUICK START GUIDE

**Duration:** 5 minutes  
**For:** New team members  
**Purpose:** Orient yourself to the project

---

## 📍 WHERE AM I?

You're working on **Astrology Super App** - a mobile app with iOS widgets and Apple Watch integration.

**Repository:** Astro-lab  
**Branch:** feature/claude-haiku-impl  
**Status:** Ready for team implementation (9-day launch plan)  

---

## 📚 DOCUMENTATION STRUCTURE

### Essential Documents (Read First)

1. **README.md** (This folder)
   - Project overview
   - Quick setup
   - Technology stack

2. **PROJECT_OVERVIEW.md** 
   - Full project scope
   - Features breakdown
   - Architecture overview

3. **TEAM_IMPLEMENTATION_GUIDE.md** ⭐ START HERE
   - Your role assignments
   - What you need to do
   - Timeline (Days 1-9)

### Role-Specific Guides

- **DevOps Engineer:** `DAY_1_SETUP_CHECKLIST.md` + `DAYS_5_6_PRODUCTION_BUILD.md`
- **iOS Developer:** `DAYS_2_3_iOS_IMPLEMENTATION.md`
- **QA Engineer:** `DAYS_4_TESTING_SETUP.md`
- **Product Manager:** `DAYS_7_8_APP_STORE_SUBMISSION.md`
- **Team Lead:** `TEAM_IMPLEMENTATION_GUIDE.md` (full guide)

### Detailed Documentation

- `DAYS_2_3_iOS_IMPLEMENTATION.md` - Widget & Watch implementation
- `DAYS_4_TESTING_SETUP.md` - E2E testing procedures
- `DAYS_5_6_PRODUCTION_BUILD.md` - EAS builds & TestFlight
- `DAYS_7_8_APP_STORE_SUBMISSION.md` - App Store submission
- `IMPLEMENTATION_PROGRESS_REPORT.md` - Current status

### Reference Documents

- `IMPLEMENTATION_PLAYBOOK.md` - Architecture decisions
- `DESIGN_SYSTEM.md` - UI/UX guidelines
- `TESTING.md` - Test strategy
- `PRODUCTION.md` - Production checklist

---

## 👥 WHAT'S MY ROLE?

### DevOps Engineer
```
Days 1, 5-6
- Setup GitHub Actions secrets
- Configure EAS Build
- Create production builds
- Submit to TestFlight
Duration: 6-8 hours total
```

### iOS Developer
```
Days 2-3
- Implement iOS widgets
- Setup watch app
- Configure App Groups
- Test on real devices
Duration: 12+ hours
```

### QA Engineer
```
Day 4
- Run E2E tests
- Fix test failures
- Generate test reports
- Verify all tests passing
Duration: 4-6 hours
```

### Product Manager
```
Days 7-8
- Create App Store screenshots
- Fill metadata
- Write descriptions
- Submit for review
Duration: 8-10 hours
```

### Team Lead
```
Days 1-9 (Ongoing)
- Assign tasks
- Monitor progress
- Unblock issues
- Coordinate team
- Prepare launch
```

---

## 🗂️ PROJECT STRUCTURE

```
astrology-app/
├── mobile/               ← React Native app (Expo)
│   ├── src/
│   ├── e2e/             ← Detox E2E tests
│   ├── ios-widgets/     ← iOS widgets
│   └── package.json
│
├── ios-widgets/         ← Swift widget code
│   ├── WidgetDataManager.swift
│   ├── TodayWidget.swift
│   └── MoonPhaseWidget.swift
│
├── ios-watchapp/        ← Apple Watch app
│   ├── Astro_WatchApp.swift
│   └── ContentView.swift
│
└── backend/             ← NestJS API
    ├── src/
    └── docker-compose.yml

Documentation/
├── TEAM_IMPLEMENTATION_GUIDE.md     ⭐ START HERE
├── DAY_1_SETUP_CHECKLIST.md
├── DAYS_2_3_iOS_IMPLEMENTATION.md
├── DAYS_4_TESTING_SETUP.md
├── DAYS_5_6_PRODUCTION_BUILD.md
├── DAYS_7_8_APP_STORE_SUBMISSION.md
├── QUICK_START_GUIDE.md             ← You are here
└── [other docs]
```

---

## 🎯 GET STARTED IN 5 MINUTES

### 1. Clone & Setup (2 min)

```bash
# Clone if you don't have it
git clone https://github.com/kazimincii/Astro-lab.git

# Navigate to project
cd Astro-lab

# Checkout feature branch
git checkout feature/claude-haiku-impl

# Verify you're on right branch
git branch
# Should show: * feature/claude-haiku-impl
```

### 2. Find Your Role (1 min)

Open `TEAM_IMPLEMENTATION_GUIDE.md` and find your role:
- DevOps → Read DAY_1_SETUP_CHECKLIST.md
- iOS Dev → Read DAYS_2_3_iOS_IMPLEMENTATION.md
- QA → Read DAYS_4_TESTING_SETUP.md
- Product → Read DAYS_7_8_APP_STORE_SUBMISSION.md
- Team Lead → Read TEAM_IMPLEMENTATION_GUIDE.md

### 3. Read Your Day's Guide (2 min)

Each role has a day-by-day guide with:
- ✅ Checklist of what to do
- 📋 Step-by-step instructions
- 🚨 Troubleshooting section
- ⏱️ Time estimates

---

## 💬 SLACK CHANNELS

Team communication:
- `#astrology-main` - General updates
- `#astrology-devops` - Infrastructure issues
- `#astrology-ios` - iOS development
- `#astrology-qa` - Testing & QA
- `#astrology-product` - Product & marketing
- `#astrology-blockers` - Critical issues

---

## 🚨 HELP! I'M STUCK

### Quick Support

1. **Check the troubleshooting section** in your day's guide
2. **Search existing docs** for your error message
3. **Post in #astrology-blockers** with:
   - What you tried
   - Error message
   - Your role/day
4. **Tag:** @team-lead or @devops-lead

### Common Issues

**"git branch shows wrong branch"**
```bash
git checkout feature/claude-haiku-impl
git pull origin feature/claude-haiku-impl
```

**"npm dependencies failing"**
```bash
rm -rf node_modules package-lock.json
npm install --force
```

**"Can't find a file/folder"**
- Use `find . -name "filename"` to locate it
- Or check `ls astrology-app/mobile/`

**"EAS/Expo credentials failing"**
- Check with team lead first
- They'll provide credentials
- Don't commit credentials to git!

---

## 📅 TIMELINE AT A GLANCE

```
Day 1 (DevOps)      | Setup CI/CD, GitHub Secrets, EAS
Days 2-3 (iOS Dev)  | Implement widgets and watch app
Day 4 (QA)          | Run all E2E tests (40+ scenarios)
Days 5-6 (DevOps)   | Production build → TestFlight
Days 7-8 (Product)  | App Store submission
Day 9 (All)         | LAUNCH! 🚀

Total: ~9 days
Effort: 50-60 person-hours
Status: Code 100% complete, Docs 70% complete
```

---

## 🔑 KEY CREDENTIALS & LINKS

### Team Leads: Share These With Team

```
Expo Dashboard:
https://expo.dev

App Store Connect:
https://appstoreconnect.apple.com

GitHub Repository:
https://github.com/kazimincii/Astro-lab

EAS Documentation:
https://docs.expo.dev/eas

Apple Developer Docs:
https://developer.apple.com
```

### Credentials Location (Ask Team Lead)

```
GitHub Actions Secrets:
- EXPO_TOKEN
- EAS_TOKEN
- STRIPE_SECRET_KEY
- [Others in GitHub]

Apple Certificates:
- Stored in Xcode Keychain
- or Available in EAS

Environment Variables:
- Check .env.example
- Ask team lead for real values
```

---

## ✅ BEFORE YOU START

Make sure you have:

```
Tools Installed:
☑ Node.js v18+ (node --version)
☑ npm v9+ (npm --version)
☑ Git (git --version)
☑ Xcode (if iOS dev) (xcode-select --install)

For iOS Dev:
☑ macOS with Xcode
☑ Apple Developer account
☑ iPhone simulator (Xcode)

For DevOps:
☑ EAS account (expo.dev)
☑ App Store Connect access
☑ Apple certificates

For QA:
☑ Node.js & npm
☑ iOS simulator or real device
☑ Test device registered
```

---

## 🎓 LEARNING RESOURCES

### By Technology

**React Native / Expo**
- Official: https://docs.expo.dev
- Tutorials: https://reactnative.dev/docs/getting-started

**Swift / iOS**
- Official: https://developer.apple.com/swift
- WidgetKit: https://developer.apple.com/widgets

**Detox / E2E Testing**
- Official: https://wix.github.io/Detox
- Docs: https://wix.github.io/Detox/docs/introduction/welcome

**EAS / App Distribution**
- Official: https://docs.expo.dev/eas
- Builds: https://docs.expo.dev/eas-update

**App Store & TestFlight**
- Official: https://help.apple.com/app-store-connect
- Review Guidelines: https://developer.apple.com/app-store/review/guidelines

---

## 📞 CONTACT & ESCALATION

### By Situation

**Can't get something working:**
→ Post in #astrology-blockers with error

**Need credentials or access:**
→ Ask @team-lead or @devops-lead

**Design/UX question:**
→ Check DESIGN_SYSTEM.md or ask product team

**Technical architecture question:**
→ Check IMPLEMENTATION_PLAYBOOK.md

**Urgent issue (blocking team):**
→ Slack direct message to @team-lead

---

## 🎉 YOU'RE READY!

1. ✅ Read this guide (you just did!)
2. ✅ Open your role's guide
3. ✅ Follow the step-by-step instructions
4. ✅ Use the checklist to track progress
5. ✅ Post blockers in #astrology-blockers
6. ✅ Celebrate when your day is complete!

**Next Step:** Open `TEAM_IMPLEMENTATION_GUIDE.md` for full context.

---

**Last Updated:** Today  
**Maintained By:** Team Lead  
**Questions?** Post in Slack or check documentation index
