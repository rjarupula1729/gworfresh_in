# 📋 Quick Reference Card

**Keep this handy while developing!**

---

## 🔒 Every Time You Start (Copy & Paste)

```bash
# Terminal 1: Backend
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
source venv/bin/activate
cd backend
npm start

# Terminal 2: Frontend (in new terminal)
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
source venv/bin/activate
npm install
expo start
```

---

## 🎯 Quick Commands

| Command | What It Does |
|---------|--------------|
| `source venv/bin/activate` | ✅ Turn on isolation (MUST DO FIRST!) |
| `deactivate` | ❌ Turn off isolation |
| `npm start` (in backend) | Start Node server on port 5000 |
| `expo start` | Start React Native (press a/i/w for device) |
| `npm install` | Install dependencies (do in both folders) |
| `rm -rf node_modules` | Delete all packages (then npm install again) |

---

## 🔍 How to Know It's Working

### Backend Terminal (Should show):
```
✅ MongoDB Connected
✅ Server running on port 5000
✅ Ready for requests
```

### Frontend Terminal (Should show):
```
✅ Expo started
✅ Press a for Android, i for iOS, w for web
✅ App opens in device/simulator
```

---

## 🧪 Test These Features

```
1. Login with 9876543210 / OTP: 1234
2. Home screen shows welcome
3. Shop works - add to cart
4. Orders - place order
5. Garden - track plant
6. Community - create post
7. Experts - book instructor
```

**All working?** ✅ You're done!

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `command not found: python3` | `brew install python3` |
| `Port 5000 in use` | Close other apps or change PORT in .env |
| `(venv) not showing` | You forgot `source venv/bin/activate` |
| `node_modules error` | Delete and `npm install` again |
| `MongoDB not connecting` | Check .env file has MONGO_URI |
| `Expo won't start` | `npm install -g expo-cli` |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your MongoDB credentials (keep secret!) |
| `backend/server.js` | Node.js server entry point |
| `src/App.js` | React Native app entry point |
| `src/navigation/AppNavigator.js` | Screen navigation setup |
| `src/services/api.js` | API client with JWT |

---

## 📖 Full Guides

- 📘 `VENV_SETUP.md` - Virtual environment details
- 📗 `START_NOW.md` - Complete startup guide
- 📙 `QUICK_START.md` - 30-minute overview
- 📕 `LOCAL_TESTING_GUIDE.md` - Detailed testing
- 📓 `TESTING_CHECKLIST.md` - 100+ test cases

---

## ✅ Before Each Coding Session

- [ ] Run: `source venv/bin/activate` (see (venv)?)
- [ ] Run: `cd backend && npm start` (see MongoDB Connected?)
- [ ] Run: `expo start` in another terminal (see app launch?)
- [ ] Ready to code!

---

## 🔐 Safety Reminders

✅ **Safe**:
- Use `venv` for everything
- Delete `gworfresh_in` folder = all gone
- No system files modified
- Easy to start fresh

❌ **NOT Safe**:
- Using system Python without venv
- Running `npm install -g` packages globally
- Committing `.env` file to git (it's in .gitignore)

---

## 🚀 You're All Set!

Follow the "Every Time You Start" section above and you're good! 🎉

