#!/bin/bash

# 📋 QUICK REFERENCE - COPY & PASTE COMMANDS

echo "
═══════════════════════════════════════════════════════════════════════════
                    GROWFRESH ANDROID BUILD - QUICK COMMANDS
═══════════════════════════════════════════════════════════════════════════
"

echo "
⚡ FASTEST: Expo Go (2 minutes - Test Now!)
─────────────────────────────────────────────────────────────────────────
"
echo "npm install -g expo-cli && cd ~/Documents/gworfresh_in/src && expo start"
echo "
Then scan QR code with Expo Go app (free from Play Store)
"

echo "
☁️  CLOUD BUILD (15-30 minutes - Recommended!)
─────────────────────────────────────────────────────────────────────────
"
echo "npm install -g eas-cli"
echo "eas login"
echo "cd ~/Documents/gworfresh_in"
echo "eas build --platform android"
echo "
Build runs in cloud, download link sent to your email
"

echo "
🤖 AUTOMATED (2 minutes - Interactive Menu)
─────────────────────────────────────────────────────────────────────────
"
echo "cd ~/Documents/gworfresh_in && ./BUILD_ANDROID.sh"
echo "
Choose option 1 (cloud) or 3 (Expo Go) from menu
"

echo "
💻 LOCAL BUILD (30-60 minutes - Advanced)
─────────────────────────────────────────────────────────────────────────
"
echo "npm install -g eas-cli"
echo "eas login"
echo "cd ~/Documents/gworfresh_in"
echo "eas build --platform android --local"
echo "
APK created locally, check current directory
"

echo "
📚 DOCUMENTATION
─────────────────────────────────────────────────────────────────────────
"
echo "README.md                - Quick overview"
echo "ANDROID_BUILD_GUIDE.md   - Comprehensive guide"
echo "VISUAL_ANDROID_BUILD.md  - Step-by-step walkthrough"
echo "ANDROID_BUILD_READY.md   - Quick reference & checklist"
echo "BUILD_ANDROID.sh         - Automated script"

echo "
🔗 LINKS
─────────────────────────────────────────────────────────────────────────
"
echo "Expo Account:    https://expo.dev"
echo "Expo Go App:     Play Store → 'Expo Go'"
echo "GitHub Repo:     https://github.com/rjarupula1729/gworfresh_in"

echo "
═══════════════════════════════════════════════════════════════════════════
"
