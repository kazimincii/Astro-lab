#!/bin/bash

# Detox E2E Testing Installation & Setup Script

echo "🚀 Detox Installation Script"
echo "================================"

cd "$(dirname "$0")/mobile" || exit 1

# Step 1: Install Detox packages
echo "📦 Installing Detox packages..."
npm install --save-dev detox detox-cli detox-test-utils @testing-library/react-native

# Step 2: Initialize Detox configuration
echo "🔧 Initializing Detox configuration..."
detox init -r ios

# Step 3: Update package.json with Detox scripts
echo "📝 Detox installation complete!"
echo ""
echo "✅ Next steps:"
echo "1. Configure eas.json for Detox builds"
echo "2. Run: npm run detox:build:ios"
echo "3. Run: npm run detox:test:ios"
echo ""
echo "For more info: https://wix.github.io/Detox/"
