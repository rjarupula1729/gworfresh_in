# 📱 Step-by-Step: Run GrowFresh (Copy & Paste)

**Follow these EXACT steps. Copy commands below one at a time.**

---

## 🔒 STEP 0: Setup Virtual Environment (First Time Only)

**Open Terminal 1. Copy each line below, one at a time:**

```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
```
Press Enter. Then copy next line:

```bash
python3 -m venv venv
```
Press Enter. Wait 5 seconds. Then:

```bash
source venv/bin/activate
```
Press Enter. **You should see `(venv)` at the start of your terminal line!** ✅

Then:
```bash
pip install --upgrade pip
```
Press Enter. Done! ✅

---

## ▶️ STEP 1: Start Backend Server

**Keep Terminal 1 open. Copy these lines:**

```bash
cd backend
```
Press Enter. Then:

```bash
npm install
```
Press Enter. Wait 2-3 minutes... Then:

```bash
npm start
```
Press Enter. **Wait until you see this:**
```
✅ MongoDB Connected
✅ Server running on port 5000
```

If you see `MongoDB Connected` = ✅ **Backend is ready!**

---

## 🎮 STEP 2: Start Frontend

**Open a NEW terminal (Terminal 2). Copy these lines:**

```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
```
Press Enter. Then:

```bash
source venv/bin/activate
```
Press Enter. **You should see `(venv)` again!** ✅ Then:

```bash
npm install
```
Press Enter. Wait 2-3 minutes... Then:

```bash
expo start
```
Press Enter. Wait 30 seconds. You'll see:
```
▄‾‾‾‾‾▄
│ › Metro waiting on <URL>
```

---

## 📲 STEP 3: Open App

**You have 2 choices:**

### Option A: Android Emulator
In Terminal 2, press: `a`

Wait 30 seconds. Android emulator opens with app. ✅

### Option B: iOS Simulator (Mac only)
In Terminal 2, press: `i`

Wait 30 seconds. iOS simulator opens with app. ✅

### Option C: Web Browser
In Terminal 2, press: `w`

Your browser opens to: `http://localhost:19006`

App loads in browser! ✅

---

## 🧪 STEP 4: Test Login

**In the app that opened:**

1. Type mobile: `9876543210` (any 10 digits)
2. Tap "Send OTP"
3. See timer counting down (60 seconds)
4. Type OTP: `1234`
5. Tap "Verify"
6. **You see Home screen = ✅ LOGIN WORKS!**

---

## 🛍️ STEP 5: Test All Features

**Go through each tab at bottom:**

### Home Tab ✅
- See welcome message
- See your reward points
- See featured products

### Shop Tab ✅
- Browse products in grid
- Search for "tomato"
- Tap product to see details
- Tap "Add to Cart"

### Orders Tab ✅
- Tap "Place Order"
- Fill address
- Choose payment (COD)
- Tap "Place Order"
- See order appear with timeline

### Garden Tab ✅
- Tap "Add Plant"
- Pick a product
- Tap "Start Tracking"
- See plant appears with health

### Community Tab ✅
- Tap "Create Post"
- Type message
- Tap "Share"
- See your post in feed

### Experts Tab ✅
- See list of instructors
- Tap instructor
- Select date and time
- Tap "Book Now"

---

## ✅ Complete! All Features Work

If all 6 tabs work and you can do all steps above = **Your app is 100% working!** 🎉

---

## 🛑 If Something Breaks

### "MongoDB not connecting"
**In Terminal 1 (backend), do this:**
```bash
deactivate
source venv/bin/activate
cd backend
npm start
```

### "Port 5000 in use"
**Find what's using it:**
```bash
lsof -i :5000
```

**Kill it:**
```bash
kill -9 <PID>
```
(Replace PID with number shown)

### "Expo won't start"
**In Terminal 2:**
```bash
npm install -g expo-cli
npm start
```

### "(venv) not showing"
**You didn't activate! Do this:**
```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
source venv/bin/activate
```
**Now you should see (venv)** ✅

---

## 🔄 Next Time You Work

**EVERY time you start coding:**

**Terminal 1:**
```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
source venv/bin/activate
cd backend
npm start
```

**Terminal 2 (new terminal):**
```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
source venv/bin/activate
expo start
```

---

## 📝 Summary

| Step | Command | What You'll See |
|------|---------|-----------------|
| 1 | `python3 -m venv venv` | Creates venv folder |
| 2 | `source venv/bin/activate` | `(venv)` appears |
| 3 | `cd backend && npm install && npm start` | "MongoDB Connected" |
| 4 | `expo start` | Metro ready |
| 5 | Press `a` or `i` or `w` | App opens |
| 6 | Login: 9876543210 / 1234 | Home screen shows |
| 7 | Test all 6 tabs | Everything works! |

---

## 🎯 That's it!

You're now running a complete mobile app with backend and database! 

**Questions? Check:**
- `QUICK_REFERENCE.md` - Quick commands
- `VENV_SETUP.md` - Virtual environment help
- `START_NOW.md` - Startup guide
- `LOCAL_TESTING_GUIDE.md` - Detailed help

---

**Start with Step 0 now!** 🚀

