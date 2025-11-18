# 📱 DAYS 2-3: iOS WIDGET & WATCH IMPLEMENTATION

**Duration:** 6-8 hours (3-4 hours each day)  
**Owner:** iOS Developer with macOS  
**Prerequisite:** Day 1 completed successfully  

---

## 🎯 DAYS 2-3 OBJECTIVES

**Day 2 (Widget Implementation):**
- [ ] Generate iOS project from Expo
- [ ] Create Widget Extension target
- [ ] Integrate Swift widget files
- [ ] Configure App Groups
- [ ] Build and test widgets on simulator
- [ ] Verify widget appears on lock screen

**Day 3 (Watch App Implementation):**
- [ ] Create Watch target
- [ ] Integrate Swift watch files
- [ ] Configure WatchConnectivity
- [ ] Set up App Groups
- [ ] Build and test watch app on simulator
- [ ] Verify watch-to-iPhone sync works

---

## ⚙️ PREREQUISITES CHECK

Before starting Day 2, verify:

```bash
# Check macOS version (should be 12+)
sw_vers

# Check Xcode version
xcode-select --version
# or
xcode-select -p  # Should show Xcode path

# Check Node.js
node --version   # Should be v18+

# Check npm
npm --version    # Should be v9+

# Check in correct directory
pwd  # Should end with: Astro-lab

# Verify you're on correct branch
git branch
# Should show: * feature/claude-haiku-impl
```

---

# 📱 DAY 2: iOS WIDGET IMPLEMENTATION (3-4 hours)

## Phase 1: Generate iOS Project (30 minutes)

### ⚠️ IMPORTANT: Windows Users

If you're on Windows, skip directly to "Alternative: Manual Xcode Setup" section below.  
`expo prebuild` only works on macOS/Linux.

### macOS: Generate with Expo Prebuild

```bash
# Navigate to mobile directory
cd astrology-app/mobile

# Verify you're in right place
ls -la  # Should show package.json, app.json, etc.

# Clean build iOS project
npx expo prebuild --platform ios --clean

# This will:
# - Generate ios/ folder
# - Create Xcode project
# - Install CocoaPods
# - Configure native modules
# Takes 3-5 minutes
```

**Expected Output:**
```
✓ Generated ios/ folder
✓ Installed dependencies
✓ Created project.pbxproj
✓ Ready for Xcode

"✅ iOS project generated successfully"
```

### Windows/Linux: Alternative Manual Setup

If `expo prebuild` doesn't work:

```bash
# Method 1: Use expo build cloud (EAS)
# (Skip for now, handled on Day 5-6)

# Method 2: Manual Xcode steps (advanced)
# Create iOS folder manually and import to Xcode
# See iOS_WIDGET_IMPLEMENTATION.md for manual steps
```

**For this guide, assume macOS prebuild successful** ✅

---

## Phase 2: Understand Project Structure (10 minutes)

```
astrology-app/
├── mobile/
│   ├── ios/                    ← Generated Xcode project
│   │   ├── Astro.xcworkspace
│   │   ├── Astro/              ← Main app target
│   │   ├── Pods/
│   │   └── ...
│   ├── src/                    ← React Native code
│   ├── app.json
│   ├── package.json
│   └── ...
│
├── ios-widgets/                ← Widget Swift files (provided)
│   ├── WidgetDataManager.swift
│   ├── TodayWidget.swift
│   ├── MoonPhaseWidget.swift
│   ├── AstroWidget.swift
│   └── WidgetDataManager-Bridge.m
│
└── ios-watchapp/               ← Watch Swift files (provided)
    ├── Astro_WatchApp.swift
    ├── ContentView.swift
    └── ...
```

---

## Phase 3: Open Xcode Project (5 minutes)

```bash
# Open the Xcode workspace (NOT the .pbxproj)
open astrology-app/mobile/ios/Astro.xcworkspace

# This will open Xcode
# Wait for indexing to complete (5-10 minutes)

# In Xcode:
# 1. Project: Astro
# 2. Main target: Astro (should show in targets)
# 3. Build settings should be green (no errors)
```

**Xcode UI Navigation:**
```
Left Panel:
├── Project Navigator (file browser)
├── Search Navigator
├── Issue Navigator (should be empty)
└── Test Navigator

Top Bar:
├── Scheme selector (should show "Astro" scheme)
├── Device selector (should show "iPhone 15 Pro" simulator)
└── Build/Run buttons
```

---

## Phase 4: Create Widget Extension Target (20 minutes)

### Step 1: Create New Target

```
In Xcode:
1. Top menu: File → New → Target...
2. iOS platform selected
3. Choose: Widget Extension
4. Click: Next
5. Product Name: AstroWidget
6. Bundle Identifier: com.astrologyapp.superapp.widgets
7. Language: Swift
8. Bundle in App: Yes (must be checked)
9. Click: Finish
```

**In the dialog, Xcode will ask to:**
- Activate new scheme? → Click "Activate"

### Step 2: Verify Widget Target Created

```
In Xcode Left Panel (Project Navigator):
├── Astro (main app)
├── AstroWidget (widget extension)
├── AstroWidgetTests
├── Pods
└── ...

Targets section should show:
✓ Astro
✓ AstroWidget
```

### Step 3: Configure Signing

```
Select: AstroWidget target
Tab: Signing & Capabilities
Check:
☑ Automatically manage signing
Team: Your Apple Developer Team
Provisioning Profile: Should be auto-selected
```

---

## Phase 5: Add Swift Widget Files (15 minutes)

### Step 1: Copy Widget Files to Project

```bash
# In terminal (new window):
cd astrology-app/mobile/ios

# Copy widget files
cp ../../ios-widgets/*.swift AstroWidget/

# Verify copied
ls -la AstroWidget/
# Should show:
# WidgetDataManager.swift
# TodayWidget.swift
# MoonPhaseWidget.swift
# AstroWidget.swift
# WidgetDataManager-Bridge.m
```

### Step 2: Add Files to Xcode

```
In Xcode:
1. Project Navigator (left panel)
2. Right-click: AstroWidget folder
3. Choose: "Add Files to 'Astro'..."
4. Navigate to: astrology-app/mobile/ios/AstroWidget/
5. Select all .swift files:
   ☑ WidgetDataManager.swift
   ☑ TodayWidget.swift
   ☑ MoonPhaseWidget.swift
   ☑ AstroWidget.swift
6. Click: "Add"

File Options:
☑ Copy items if needed
✓ Create groups
✓ Add to targets: AstroWidget (and Astro if needed)
```

### Step 3: Add Objective-C Bridge

```
In Xcode:
1. Right-click: AstroWidget folder
2. Choose: "Add Files..."
3. Select: WidgetDataManager-Bridge.m
4. Add to targets: AstroWidget
```

**After adding:**
```
AstroWidget folder should contain:
├── AstroWidget.swift (auto-generated)
├── WidgetDataManager.swift (added)
├── TodayWidget.swift (added)
├── MoonPhaseWidget.swift (added)
├── AstroWidget.swift (replaced)
└── WidgetDataManager-Bridge.m (added)
```

---

## Phase 6: Configure App Groups (20 minutes)

### What Are App Groups?

App Groups allow data sharing between:
- Main app (React Native)
- Widget Extension
- Watch app (Day 3)

They use: `group.com.astrologyapp.superapp`

### Step 1: Configure Main App (Astro)

```
In Xcode:
1. Select Target: Astro
2. Tab: Signing & Capabilities
3. Click: + Capability (top-left)
4. Search: "App Groups"
5. Double-click: App Groups
6. Click: Add Group
7. Enter: group.com.astrologyapp.superapp
```

**After adding:**
```
Signing & Capabilities tab shows:
✓ App Groups
  └─ group.com.astrologyapp.superapp
```

### Step 2: Configure Widget Extension (AstroWidget)

```
Same steps as above:
1. Select Target: AstroWidget
2. Tab: Signing & Capabilities
3. + Capability → App Groups
4. Add group: group.com.astrologyapp.superapp
```

**Both targets should have the SAME App Group ID:**
✓ group.com.astrologyapp.superapp

### Step 3: Verify in Entitlements Files

```bash
# Check entitlements were created
cd astrology-app/mobile/ios

# Main app entitlements
cat Astro/Astro.entitlements

# Widget entitlements
cat AstroWidget/AstroWidget.entitlements

# Both should contain:
# <key>com.apple.security.application-groups</key>
# <array>
#   <string>group.com.astrologyapp.superapp</string>
# </array>
```

---

## Phase 7: Update Widget Info.plist (10 minutes)

The Widget Extension needs a minimum iOS deployment target.

### Step 1: Set Deployment Target

```
In Xcode:
1. Select Target: AstroWidget
2. Tab: General (top)
3. Find: Minimum Deployment
4. Set to: iOS 17.0 (required for WidgetKit)
```

### Step 2: Check Info.plist

```bash
# Verify in AstroWidget/Info.plist
cat astrology-app/mobile/ios/AstroWidget/Info.plist

# Should show:
# - Minimum OS version: 17.0
# - NSWidgetWantsEdgeToEdgeRendering: true
```

---

## Phase 8: Fix Swift Syntax & Imports (10 minutes)

Widget files may need import adjustments.

### Check for Compilation Errors

```
In Xcode:
1. Product menu → Build For → iOS Simulator
2. Or press: Cmd + B
3. Watch Issue Navigator (left panel)
4. Address any errors shown
```

**Common Issues:**

```swift
// ❌ Wrong import (won't work in widgets)
import React

// ✅ Use instead
import WidgetKit
import SwiftUI

// ❌ Using RN Bridge incorrectly
// Just include the .m file, it bridges automatically

// ✅ Use provided methods:
WidgetDataManager.saveHoroscope(data)
WidgetDataManager.getMoonPhase()
```

### Fix Compilation Errors

```bash
# Common fixes:
1. Remove any React Native imports
2. Ensure WidgetKit is imported
3. Verify SwiftUI usage
4. Check for typos in class names
```

---

## Phase 9: Build Widget for Simulator (15 minutes)

### Step 1: Build the Widget

```
In Xcode:
1. Top-left: Select scheme dropdown
2. Choose: AstroWidget scheme (not Astro)
3. Device: iPhone 15 Pro simulator
4. Product menu → Build (Cmd + B)
5. Wait for build to complete

Expected output:
✅ Build successful
❌ If errors, fix them (check Issue Navigator)
```

### Step 2: Run Main App

```
1. Back to Astro scheme (dropdown)
2. Device: iPhone 15 Pro simulator
3. Product → Run (Cmd + R)
4. Simulator launches with app
5. Wait for app to appear
```

---

## Phase 10: Test Widgets on Lock Screen (20 minutes)

### Step 1: Lock Screen Access

```
On iPhone Simulator:
1. Swipe right (or click lock button in simulator toolbar)
2. Tap "+" to customize lock screen
3. Search for: Astro App
4. Add one of these widgets:
   - Today Horoscope (shows daily forecast)
   - Moon Phase (shows current moon)
```

### Step 2: Widget Data Flow

```
When widget loads:
1. Read from App Groups UserDefaults
2. Display shared data from main app
3. Refresh on 24-hour schedule
4. Show moon emoji and horoscope text
```

### Step 3: Verify Widget Works

```
Test checklist:
☑ Widget appears on lock screen
☑ Shows horoscope text (even placeholder)
☑ Shows moon phase emoji
☑ Updates when app updates UserDefaults
☑ No console errors in Xcode
```

**If widget not appearing:**
```
Troubleshooting:
1. Verify bundle ID is correct
2. Check App Groups configured in both targets
3. Rebuild: Cmd + B, then Cmd + R
4. Restart simulator: Hardware → Erase All
5. Rebuild and retry
```

---

## ✅ Day 2 Complete Checklist

```
Phase 1: iOS Project Generated
☑ expo prebuild --platform ios --clean successful
☑ ios/ folder created with Xcode project
☑ No build errors

Phase 2: Understood Project Structure
☑ Located ios/ and ios-widgets/ folders
☑ Understand App Groups concept

Phase 3: Opened Xcode
☑ Opened .xcworkspace (not .pbxproj)
☑ Xcode indexing complete
☑ No red errors in Issue Navigator

Phase 4: Created Widget Target
☑ AstroWidget target created
☑ Signed with correct team
☑ Bundle ID: com.astrologyapp.superapp.widgets

Phase 5: Added Swift Files
☑ All 5 Swift files added to AstroWidget
☑ Files appear in Xcode project
☑ No compilation errors

Phase 6: Configured App Groups
☑ Main app (Astro) has App Groups
☑ Widget (AstroWidget) has App Groups
☑ Both use: group.com.astrologyapp.superapp

Phase 7: Updated Deployment Target
☑ Widget deployment target: iOS 17.0

Phase 8: Fixed Swift Issues
☑ No compilation errors
☑ All imports correct
☑ Classes properly defined

Phase 9: Built Widget
☑ AstroWidget scheme builds successfully
☑ Astro app builds successfully
☑ Simulator launches

Phase 10: Tested on Lock Screen
☑ Widget appears on lock screen
☑ Shows horoscope data
☑ Shows moon phase
☑ No errors in console
```

**Time Spent:** 3-4 hours ✅

---

# ⌚ DAY 3: APPLE WATCH IMPLEMENTATION (3-4 hours)

## Phase 1: Create Watch Target (15 minutes)

```
In Xcode:
1. File → New → Target...
2. iOS platform → Watch App
3. Product Name: AstroWatch
4. Bundle Identifier: com.astrologyapp.superapp.watch
5. Interface: SwiftUI
6. Complication: Yes (optional, advanced feature)
7. Finish
```

**Targets after creation:**
```
Xcode shows:
✓ Astro (main app)
✓ AstroWidget (widget)
✓ AstroWatch (watch app)
✓ AstroWatchKit (watch extension)
```

---

## Phase 2: Add Watch Swift Files (15 minutes)

```bash
# Copy watch files
cp ../../ios-watchapp/*.swift AstroWatchKit/

# Add to Xcode:
1. Right-click: AstroWatchKit folder
2. Add Files → Select .swift files
3. Add to target: AstroWatchKit
```

**Files to add:**
```
AstroWatchKit/
├── Astro_WatchApp.swift
└── ContentView.swift
```

---

## Phase 3: Configure App Groups for Watch (15 minutes)

```
Same as widget:
1. Select Target: AstroWatch
2. Signing & Capabilities → + Capability
3. Add: App Groups
4. Group: group.com.astrologyapp.superapp

All 3 targets should have same group:
✓ Astro: group.com.astrologyapp.superapp
✓ AstroWidget: group.com.astrologyapp.superapp
✓ AstroWatch: group.com.astrologyapp.superapp
```

---

## Phase 4: Build Watch App (20 minutes)

```
In Xcode:
1. Scheme: AstroWatch
2. Device: Apple Watch Series 9 (42mm) simulator
3. Build: Cmd + B
4. Run: Cmd + R
```

**Expected:** Watch app launches in simulator

---

## Phase 5: Test Watch Connectivity (30 minutes)

### Configure WatchConnectivity

The watch app needs to receive data from main app via WatchConnectivity.

```swift
// In Astro_WatchApp.swift:
import WatchConnectivity
import SwiftUI

@main
struct AstroWatchApp: App {
  @StateObject var wcManager = WatchConnectivityManager()
  
  var body: some Scene {
    WindowGroup {
      ContentView()
        .environmentObject(wcManager)
    }
  }
}

// In ContentView.swift:
// Access wcManager.horoscope, wcManager.moonPhase, etc.
```

### Verify Data Sync

```
Test on simulators:
1. Run main app on iPhone simulator
2. Run watch app on Watch simulator
3. In main app: Update horoscope data
4. Check watch app: Data should appear within 2 seconds
5. Both apps in Xcode show no errors
```

---

## ✅ Day 3 Complete Checklist

```
Phase 1: Created Watch Target
☑ AstroWatch target created
☑ AstroWatchKit extension created
☑ Signed with correct team

Phase 2: Added Watch Files
☑ Astro_WatchApp.swift added
☑ ContentView.swift added
☑ No compilation errors

Phase 3: Configured App Groups
☑ Watch target has App Groups
☑ Group ID: group.com.astrologyapp.superapp
☑ Matches main app and widget

Phase 4: Built Watch App
☑ Build successful
☑ Watch simulator launches
☑ App appears with correct icon

Phase 5: Tested WatchConnectivity
☑ Main app updates data
☑ Watch app receives data
☑ Data appears on watch within 2 sec
☑ No console errors in either app
```

**Time Spent:** 3-4 hours ✅

---

## 🎉 DAYS 2-3 COMPLETE!

**Deliverables:**
✅ iOS widgets on lock screen
✅ Apple Watch app synced with main app
✅ All data sharing via App Groups working
✅ No compilation errors
✅ Ready for Day 4: E2E Testing

**Next:** Tell team ready for QA testing phase!

---

## 📞 TROUBLESHOOTING

**Widget not appearing?**
→ Check App Groups in both Astro and AstroWidget targets  
→ Verify bundle ID: com.astrologyapp.superapp.widgets  
→ Rebuild from clean: Cmd + Shift + K, then Cmd + B

**Watch app crashes?**
→ Check WatchConnectivity initialization  
→ Verify App Groups configured  
→ Check ContentView() SwiftUI syntax  
→ Review Astro_WatchApp.swift imports

**Build errors?**
→ Check Issue Navigator (left panel)  
→ Fix each error one by one  
→ Verify Swift syntax matches provided files  
→ Delete DerivedData if stuck:  
   `rm -rf ~/Library/Developer/Xcode/DerivedData/`

---

**Expected Completion:** By end of Day 3  
**Status When Done:** Ready for QA/Testing (Day 4) ✅
