#!/bin/bash

# Production Build Script for Astrology Super App
# This script handles the complete production workflow

set -e

echo "🚀 Astrology Super App - Production Build Script"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check EAS installation
echo -e "${BLUE}1. Checking EAS CLI installation...${NC}"
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
else
    echo -e "${GREEN}✓ EAS CLI is installed${NC}"
fi

# Step 2: Check Expo installation
echo -e "${BLUE}2. Checking Expo installation...${NC}"
if ! command -v expo &> /dev/null; then
    echo -e "${YELLOW}Expo not found. Installing...${NC}"
    npm install -g expo-cli
else
    echo -e "${GREEN}✓ Expo CLI is installed${NC}"
fi

# Step 3: Login to EAS
echo -e "${BLUE}3. Authenticating with EAS...${NC}"
eas login

# Step 4: Setup credentials
echo -e "${BLUE}4. Setting up Apple credentials...${NC}"
echo "Choose 'iOS' and follow the prompts to setup Apple Developer credentials"
eas credentials

# Step 5: Update version
echo -e "${BLUE}5. Preparing version information...${NC}"
read -p "Enter version number (e.g., 1.0.0): " VERSION
read -p "Enter build number (e.g., 1): " BUILD_NUMBER

# Update app.json
# Note: This is a simplified version - in practice you'd use jq or similar
echo "Update app.json manually with version: $VERSION and build: $BUILD_NUMBER"
echo "Press Enter when done..."
read

# Step 6: Clean and install dependencies
echo -e "${BLUE}6. Installing dependencies...${NC}"
npm install

# Step 7: Build for production
echo -e "${BLUE}7. Building for production (this may take 10-15 minutes)...${NC}"
eas build --platform ios --profile production

echo -e "${GREEN}✓ Build complete!${NC}"

# Step 8: TestFlight submission
read -p "Submit to TestFlight? (y/n): " SUBMIT
if [ "$SUBMIT" == "y" ]; then
    echo -e "${BLUE}8. Submitting to TestFlight...${NC}"
    eas submit --platform ios --profile production
    echo -e "${GREEN}✓ Submitted to TestFlight!${NC}"
fi

# Step 9: Monitor build
echo -e "${BLUE}9. Monitoring build status...${NC}"
eas build:list --limit 1

echo ""
echo -e "${GREEN}✅ Production build workflow complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Wait for TestFlight processing (usually 10-15 minutes)"
echo "2. Add testers and test on real devices"
echo "3. Fill in App Store metadata (screenshots, description, etc.)"
echo "4. Submit to App Store for review"
echo "5. Monitor analytics and user feedback"
echo ""
echo "For more info: https://docs.expo.dev/build/setup/"
