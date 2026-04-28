# 🎬 VISUAL STEP-BY-STEP: BUILD YOUR APK

## 📋 Before You Start

**Checklist:**
- [ ] Node.js installed (`node --version`)
- [ ] Internet connection active
- [ ] Free Expo account created (https://expo.dev)
- [ ] Android phone with internet
- [ ] 30 minutes available

---

## 🎯 STEP-BY-STEP WALKTHROUGH

### **STEP 1: Install EAS CLI (2 minutes)**

```bash
npm install -g eas-cli
```

**Expected Output:**
```
npm warn ...
added 123 packages in 45s
```

✅ **Check:** Type `eas --version` (should show version number)

---

### **STEP 2: Login to Expo (1 minute)**

```bash
eas login
```

**What happens:**
```
✔ Email: your-email@gmail.com
✔ Password: ••••••••••
✔ One-time code: 123456 (if 2FA enabled)

✅ Logged in as: your-email@gmail.com
```

✅ **Check:** Type `eas whoami` (should show your email)

---

### **STEP 3: Navigate to Project (30 seconds)**

```bash
cd ~/Documents/gworfresh_in
```

**Expected:** Terminal shows current path ending with `gworfresh_in`

✅ **Check:** Type `ls -la app.json` (should find the file)

---

### **STEP 4: Start the Build (1-2 minutes)**

```bash
eas build --platform android
```

**What you'll see:**
```
✔ Select a build profile
  production
  preview
  preview2
  preview3

Choose "preview" or "production"
```

**Select:** `preview` (for testing)

---

### **STEP 5: Build Configuration**

```
✔ Android build type:
  ✓ APK
    AAB (for Google Play Store)

Choose APK ✓
```

**What it shows:**
```
📦 Building for Android...
⏳ This will take 15-30 minutes

You can close this terminal and check status later with:
  eas build --status
```

✅ **Save this URL** (you'll need it later)

---

### **STEP 6: Wait for Build (15-30 minutes)**

During this time:
- Expo servers compile your code
- Creates native Android app
- Generates APK file
- Uploads it to their servers

**You'll receive:**
- 📧 Email with download link
- 📱 You can also check status anytime with: `eas build --status`

---

### **STEP 7: Download APK (2 minutes)**

**When email arrives:**

```
Subject: Build 1.0.0 for growfresh completed!
Download: https://expo.dev/artifacts/...
```

✅ **Click link** → Download APK file (usually ~50-100 MB)

**File location:** 
- On Mac: `~/Downloads/growfresh-*.apk`

---

### **STEP 8: Transfer to Phone (1 minute)**

**Option A: Via Email**
1. Send APK to your phone via email
2. Open email on phone
3. Tap download

**Option B: Via Cloud**
1. Upload APK to Google Drive
2. Share link to phone
3. Download on phone

**Option C: Via USB Cable**
1. Connect phone to computer with USB
2. Copy APK file to phone
3. Eject phone

---

### **STEP 9: Install on Phone (2 minutes)**

**On your Android phone:**

1. **Open File Manager**
   - Find the APK file
   - Usually in "Downloads" folder

2. **Tap the APK file**
   - Name: `growfresh-*.apk`

3. **Grant Permission**
   ```
   "Allow installation from unknown sources?"
   ✓ INSTALL
   ```

4. **Wait for Installation**
   ```
   ⏳ Installing...
   ✅ App installed!
   ```

5. **Tap "Open"** (or find on home screen)

---

### **STEP 10: Test Your App (5 minutes)**

**Inside the app, test:**

1. ✅ Home screen loads
2. ✅ Shop page displays products
3. ✅ Can scroll through products
4. ✅ Can tap product to view details
5. ✅ Can add to cart
6. ✅ Cart shows items
7. ✅ Can proceed to checkout
8. ✅ Can view orders

---

## 🎉 YOU DID IT!

Your app is now **running on your Android phone!** 🚀

---

## 🆘 SOMETHING WENT WRONG?

### Problem: "Installation blocked"
**Solution:**
1. Go to: Settings → Apps & notifications → Special app access
2. Turn on: "Install unknown apps"
3. Select: File Manager or Email app
4. Enable "Allow from this source"
5. Try installing again

---

### Problem: "Build failed"
**Solution:**
1. Check Node.js: `node --version` (need v14+)
2. Try again: `eas build --platform android`
3. Check status: `eas build --status`

---

### Problem: "Can't find email with download"
**Solution:**
1. Check spam folder
2. Check your email on Expo dashboard: https://expo.dev
3. Or view builds: `eas build --status`

---

### Problem: "App crashes after install"
**Solution:**
1. Uninstall the app
2. Restart phone
3. Install again
4. Open app

---

## 📊 TIMELINE

```
0-2 min  : Install EAS & login
2-5 min  : Navigate & start build
5-30 min : Build in cloud ☁️
30-35 min: Download APK
35-40 min: Transfer to phone
40-42 min: Install on phone
42-47 min: Test features
---
47+ min  : Done! App is live on your phone! 🎉
```

---

## 💡 TIPS

✅ **Keep terminal open** during build (or use `eas build --status`)

✅ **Check email often** for download link

✅ **Free up space** on phone if download fails

✅ **Use WiFi** for faster download

✅ **Keep APK file** if you want to share with others

---

## 🚀 NEXT STEPS

- Share app with friends
- Test all features
- Provide feedback
- Make improvements
- Rebuild and redeploy

---

**Congratulations!** 🎊

You successfully built and deployed a production Android app!

**Questions?** Check the full guide: `ANDROID_BUILD_GUIDE.md`
