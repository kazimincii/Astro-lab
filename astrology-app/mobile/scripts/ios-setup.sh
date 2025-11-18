#!/bin/bash

# iOS Native Setup Script
# This script automates iOS project setup for widgets and App Groups

set -e

echo "🚀 Starting iOS Native Setup..."

cd "$(dirname "$0")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Prebuild iOS project
echo -e "${BLUE}Step 1: Generating iOS project with Expo prebuild...${NC}"
if [ ! -d "ios" ]; then
    npx expo prebuild --platform ios --clean
    echo -e "${GREEN}✅ iOS project generated${NC}"
else
    echo -e "${YELLOW}⚠️  iOS project already exists. Skipping prebuild.${NC}"
    echo "   To regenerate: rm -rf ios && npx expo prebuild --platform ios --clean"
fi

# 2. Check Pods
echo -e "${BLUE}Step 2: Checking CocoaPods...${NC}"
cd ios
if [ ! -d "Pods" ]; then
    pod install
    echo -e "${GREEN}✅ Pods installed${NC}"
else
    echo -e "${YELLOW}⚠️  Pods already installed${NC}"
fi
cd ..

# 3. Copy Widget files
echo -e "${BLUE}Step 3: Copying Widget files...${NC}"
if [ -d "../ios-widgets" ]; then
    mkdir -p ios/AstroWidgets
    cp ../ios-widgets/*.swift ios/AstroWidgets/ 2>/dev/null || true
    cp ../ios-widgets/*.m ios/AstroWidgets/ 2>/dev/null || true
    echo -e "${GREEN}✅ Widget files copied${NC}"
else
    echo -e "${YELLOW}⚠️  ios-widgets directory not found${NC}"
fi

# 4. Create Entitlements file
echo -e "${BLUE}Step 4: Creating Entitlements file...${NC}"
ENTITLEMENTS_FILE="ios/Astrology Super App/Astrology Super App.entitlements"
mkdir -p "$(dirname "$ENTITLEMENTS_FILE")"

cat > "$ENTITLEMENTS_FILE" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.astrologyapp.superapp</string>
    </array>
    <key>com.apple.developer.aps-environment</key>
    <string>production</string>
</dict>
</plist>
EOF

echo -e "${GREEN}✅ Entitlements file created${NC}"

# 5. Verify setup
echo -e "${BLUE}Step 5: Verifying setup...${NC}"

CHECKS_PASSED=0
CHECKS_TOTAL=4

# Check iOS project
if [ -f "ios/AstrologyApp.xcodeproj/project.pbxproj" ] || [ -f "ios/Astrology\ Super\ App.xcodeproj/project.pbxproj" ]; then
    echo -e "${GREEN}✅ iOS project structure verified${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️  iOS project not found${NC}"
fi

# Check Podfile
if [ -f "ios/Podfile" ]; then
    echo -e "${GREEN}✅ Podfile found${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Podfile not found${NC}"
fi

# Check Widget files
if [ -d "ios/AstroWidgets" ] && [ "$(ls -A ios/AstroWidgets)" ]; then
    echo -e "${GREEN}✅ Widget files present${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Widget files missing${NC}"
fi

# Check Entitlements
if [ -f "$ENTITLEMENTS_FILE" ]; then
    echo -e "${GREEN}✅ Entitlements file created${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Entitlements file not created${NC}"
fi

echo ""
echo -e "${BLUE}Setup Summary: $CHECKS_PASSED/$CHECKS_TOTAL checks passed${NC}"

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
    echo -e "${GREEN}✅ iOS setup complete!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Open Xcode: open ios/AstrologyApp.xcworkspace"
    echo "2. Enable App Groups in Signing & Capabilities"
    echo "3. Add WidgetKit Extension target"
    echo "4. Build & test: xcodebuild -workspace ios/AstrologyApp.xcworkspace -scheme 'Astrology Super App'"
else
    echo -e "${YELLOW}⚠️  Some checks failed. Review errors above.${NC}"
    exit 1
fi
