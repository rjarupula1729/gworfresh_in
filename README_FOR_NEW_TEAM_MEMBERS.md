# 📖 GrowFresh - Quick Reference for New Team Members

**Start reading here if you're new to the project!**

---

## 🎯 READ THIS FIRST (5 minutes)

**GrowFresh** is a **React Native mobile app** for buying agricultural products and tracking home gardens.

**Key Points:**
- ✅ Mobile app for Android phones
- ✅ Product shopping with geolocation filtering
- ✅ Home garden tracking
- ✅ Book agricultural experts
- ✅ Community forum
- ✅ Production-ready on GitHub

---

## 📁 WHERE'S EVERYTHING?

### Main Documentation Files (Read in Order)

1. **README.md** (START HERE)
   - Quick 3-step deployment
   - Best for: Anyone new

2. **COMPLETE_PROJECT_DOCUMENTATION.md** (COMPREHENSIVE)
   - Full architecture, API, database
   - Best for: Developers & maintainers
   - Time: 45-60 minutes to read
   - Contains: Everything you need to know

3. **ANDROID_BUILD_GUIDE.md**
   - Detailed APK build steps
   - Troubleshooting guide
   - Best for: Deploying to Android

4. **VISUAL_ANDROID_BUILD.md**
   - Step-by-step walkthrough
   - Best for: First-time builders

---

## 🏗️ PROJECT STRUCTURE AT A GLANCE

```
gworfresh_in/
├── src/                    ← Frontend (React Native + Expo)
│   ├── screens/           ← 8 screens (Home, Shop, Cart, etc.)
│   ├── services/api.js    ← Connects to backend
│   ├── context/           ← State management
│   └── app.json           ← Expo config
│
├── backend/               ← Backend (Node.js + Express)
│   ├── routes/            ← 7 route groups, 48 endpoints
│   ├── models/            ← 8 database schemas
│   ├── server.js          ← Express server
│   └── package.json       ← Dependencies
│
└── Documentation files... (README, guides, etc.)
```

---

## 📱 FRONTEND: 8 Screens

| Screen | Purpose |
|--------|---------|
| 🏠 Home | Featured products, announcements |
| 🛍️ Shop | Browse all products, search, filter |
| 🛒 Cart | Manage shopping cart |
| 👤 Login | User authentication (OTP-based) |
| 🌿 Garden | Track home garden & plants |
| 👨‍🏫 Instructors | Book agricultural experts |
| 💬 Community | Community forum & discussions |
| 📦 Orders | Track your orders |

---

## 🔧 BACKEND: 48 API Endpoints

| Category | Count | Purpose |
|----------|-------|---------|
| Auth | 5 | Login, register, OTP |
| Products | 8 | Browse, search, filter |
| Cart | 4 | Add, remove, update items |
| Orders | 6 | Create, track orders |
| Garden | 5 | Track plants |
| Instructors | 4 | Book experts |
| Community | 5 | Forum posts |
| **Geolocation** | **11** | Regional recommendations |

**Total: 48 endpoints across 22 route files**

---

## 🗄️ DATABASE: 8 Collections

- **Users** - User accounts
- **Products** - Catalog (40+ items)
- **Orders** - Purchase orders
- **PlantTrackings** - User plant data
- **Plants** - Plant types (65+)
- **CommunityPosts** - Forum posts
- **InstructorBookings** - Expert bookings
- **ProductUpdated** - Product variants

---

## ✨ KEY FEATURES

✅ **Product Catalog** - 40+ agricultural products with Unsplash images  
✅ **Geolocation** - 5 regions, 22 states, 65+ vegetables  
✅ **Shopping Cart** - Full e-commerce flow  
✅ **Orders** - Track purchases  
✅ **Plant Tracking** - Monitor home gardens  
✅ **Instructor Booking** - Book agricultural experts  
✅ **Community Forum** - Connect with other farmers  
✅ **Authentication** - OTP-based login  

---

## 🚀 QUICK START (3 Steps)

### Option 1: Test on Phone (2 min)
```bash
npm install -g expo-cli
cd ~/Documents/gworfresh_in/src
expo start
# Scan QR with Expo Go app (free from Play Store)
```

### Option 2: Build Real APK (30 min)
```bash
npm install -g eas-cli
eas login
cd ~/Documents/gworfresh_in
eas build --platform android
# Download APK from email, install on phone
```

### Option 3: Run Locally (10 min)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd src
npm install
expo start
```

---

## 🛠️ YOUR ROLE-SPECIFIC READING LIST

### If you're a **Frontend Developer**
1. README.md (5 min)
2. COMPLETE_PROJECT_DOCUMENTATION.md → Frontend Architecture (15 min)
3. Look at `src/screens/` folder

### If you're a **Backend Developer**
1. README.md (5 min)
2. COMPLETE_PROJECT_DOCUMENTATION.md → Backend Architecture + API Endpoints (20 min)
3. Look at `backend/routes/` folder

### If you're **New to the Project**
1. README.md (5 min)
2. COMPLETE_PROJECT_DOCUMENTATION.md (45 min)
3. Run the app locally (15 min)
4. Explore the code

### If you're **Deploying to Android**
1. README.md (5 min)
2. ANDROID_BUILD_GUIDE.md (15 min)
3. Run the build commands

---

## 📋 TECH STACK SUMMARY

**Frontend:**
- React Native (mobile framework)
- Expo (development platform)
- React Navigation (screen navigation)
- Context API (state management)
- Axios (API calls)
- AsyncStorage (local data)

**Backend:**
- Node.js (runtime)
- Express.js (server)
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- bcryptjs (password hashing)

**Deployment:**
- EAS Build (Android APK builder)
- GitHub (code repository)
- Expo Go (instant testing on phone)

---

## 🎯 Common Questions Answered

### "How do I add a new screen?"
1. Create file in `src/screens/NewScreen.js`
2. Add to `src/navigation/AppNavigator.js`
3. Create API calls in `src/services/api.js`
4. Update state in `src/context/AppContext.js`

### "How do I add a new API endpoint?"
1. Create/update route in `backend/routes/feature.js`
2. Add to `backend/server.js`
3. Create model in `backend/models/Feature.js` if needed
4. Call from frontend using `api.get()` or `api.post()`

### "How do I add a new product?"
1. Add to MongoDB directly, OR
2. Call `POST /api/products` with product data, OR
3. Edit `backend/data/seedProducts.js` and re-run

### "Where are the product images?"
- All images are from **Unsplash CDN** (free, open-source)
- URLs stored in `backend/data/productImages.js`

### "How do I add a new region/state?"
- Edit `backend/data/geolocationData.json`
- Add state details and seasonal vegetables
- Call geolocation APIs to fetch recommendations

### "How do I deploy to Google Play Store?"
- Build AAB instead of APK in `eas.json`
- See "Future Enhancements" section in main documentation

---

## 🔗 Essential Links

| Resource | Link |
|----------|------|
| GitHub Repo | https://github.com/rjarupula1729/gworfresh_in |
| Expo Account | https://expo.dev |
| Expo Go App | Play Store → Search "Expo Go" |
| EAS Build | https://docs.expo.dev/build/setup/ |
| MongoDB | https://cloud.mongodb.com |
| React Native | https://reactnative.dev |
| Node.js | https://nodejs.org |

---

## ✅ ONBOARDING CHECKLIST

- [ ] Read README.md (5 min)
- [ ] Read COMPLETE_PROJECT_DOCUMENTATION.md (45 min)
- [ ] Clone the repository
- [ ] Install Node.js and npm
- [ ] Follow Setup & Installation in main docs
- [ ] Get frontend running locally (`expo start`)
- [ ] Get backend running (`npm start`)
- [ ] Deploy to phone (Expo Go or APK)
- [ ] Explore the code in `src/` and `backend/`
- [ ] Read Development Guidelines
- [ ] Make your first change!

---

## 🚨 Quick Troubleshooting

**API not responding?**
- Check backend is running: `npm start` in `backend/` folder
- Check API URL in `src/services/api.js`

**Login not working?**
- Default OTP: `1234`
- Check MongoDB connection in `.env`

**App won't install?**
- Enable "Unknown sources" in phone Settings
- Check Android version is 8.0+

**Build failed?**
- Check Node.js version: `node --version` (need 14+)
- Try: `npm cache clean --force`

See **COMPLETE_PROJECT_DOCUMENTATION.md** → Troubleshooting section for more!

---

## 📚 Documentation Files Explained

| File | Purpose | Time | For Whom |
|------|---------|------|----------|
| README.md | Quick start | 5 min | Everyone |
| COMPLETE_PROJECT_DOCUMENTATION.md | Full guide | 45 min | Developers |
| ANDROID_BUILD_GUIDE.md | Build details | 15 min | DevOps/Testers |
| VISUAL_ANDROID_BUILD.md | Step-by-step | 20 min | Visual learners |
| QUICK_COMMANDS.sh | Copy-paste | 2 min | Quick reference |
| THIS FILE | Team intro | 10 min | New members |

---

## 🎯 NEXT STEPS

### Right Now (Next 5 minutes)
1. ✅ You're reading this! Well done!
2. Open `README.md` and read it
3. Understand what GrowFresh does

### Next 1 Hour
1. Open `COMPLETE_PROJECT_DOCUMENTATION.md`
2. Read sections relevant to your role
3. Understand the architecture

### Next 2 Hours
1. Install Node.js if needed
2. Follow Setup & Installation guide
3. Get the app running locally
4. Deploy to phone

### Next Few Days
1. Explore the source code
2. Read Development Guidelines
3. Make a small change to test
4. Attend team onboarding meeting

---

## 💡 Pro Tips

1. **Bookmark the Documentation** - You'll reference it often!
2. **Use GitHub to Browse Code** - Easy way to explore
3. **Test Locally First** - Before deploying to phone
4. **Read the Comments** - Code has helpful comments
5. **Ask Questions** - Team is here to help!

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Understand the project
- ✅ Set up locally
- ✅ Deploy to Android
- ✅ Make changes
- ✅ Add features

**Start by reading COMPLETE_PROJECT_DOCUMENTATION.md next!**

---

**Questions?** Check the Troubleshooting section or ask the team!

**Happy coding!** 🚀
