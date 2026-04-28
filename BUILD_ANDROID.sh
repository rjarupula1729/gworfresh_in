#!/bin/bash

# 🚀 GROWFRESH ANDROID BUILD - QUICK START SCRIPT
# This script automates the entire Android APK build process

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🌱 GrowFresh - Android APK Build Setup 🌱            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "   Install from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm: $NPM_VERSION"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Offer build options
echo "🎯 Select your build option:"
echo ""
echo "1) Cloud Build (Recommended - 15-30 min, sends APK to email)"
echo "2) Local Build (Advanced - 30-60 min, creates APK locally)"
echo "3) Expo Go (Instant - 2 min, test with Expo Go app)"
echo ""
read -p "Enter your choice (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "☁️  CLOUD BUILD SETUP"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        
        # Install EAS CLI
        echo "📦 Installing EAS CLI (if not already installed)..."
        npm install -g eas-cli
        echo "✅ EAS CLI installed!"
        echo ""
        
        # Login to Expo
        echo "🔐 Logging in to Expo..."
        eas login
        echo "✅ Logged in!"
        echo ""
        
        # Build APK
        echo "🏗️  Starting APK build in cloud..."
        echo "   This will take 15-30 minutes"
        echo "   You'll receive an email when done"
        echo ""
        eas build --platform android
        echo ""
        echo "✅ Build started!"
        echo "   Check your email for download link"
        echo "   Or run: eas build --status"
        ;;
        
    2)
        echo ""
        echo "💻 LOCAL BUILD SETUP"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        
        # Install EAS CLI
        echo "📦 Installing EAS CLI..."
        npm install -g eas-cli
        echo "✅ EAS CLI installed!"
        echo ""
        
        # Build APK locally
        echo "🏗️  Building APK locally..."
        echo "   This requires Android SDK (will be downloaded)"
        echo "   This will take 30-60 minutes"
        echo ""
        eas build --platform android --local
        echo ""
        echo "✅ Build complete!"
        echo "   APK file is in current directory"
        echo "   Install: adb install growfresh.apk"
        ;;
        
    3)
        echo ""
        echo "⚡ EXPO GO SETUP"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        
        # Install Expo CLI
        echo "📦 Installing Expo CLI..."
        npm install -g expo-cli
        echo "✅ Expo CLI installed!"
        echo ""
        
        # Start Expo
        echo "🚀 Starting Expo..."
        cd src
        expo start
        ;;
        
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✨ Setup complete! Follow the on-screen instructions."
echo "═══════════════════════════════════════════════════════════════"
