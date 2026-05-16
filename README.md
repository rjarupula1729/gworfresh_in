# 🌱 GrowFresh# 🌱 GrowFresh - Agricultural E-Commerce Mobile App# 🌱 GrowFresh - Agriculture E-Commerce App# 🌱 GrowFresh - Complete Application



Mobile-first home gardening + ecommerce app.

**Stack:** React Native (Expo SDK 51) · Node/Express · PostgreSQL (Knex).

**Build & Run on Your Android Phone in Minutes!**

---



## Quick links

---Simple app to buy and sell agriculture products online.**A mobile application that empowers users to grow their own vegetables at home with quality products, expert guidance, and community support.**

| I want to… | Read this |

| --- | --- |

| Run the project locally (one command) | `scripts/dev-up.sh` |

| Understand the backend / database | [`backend/MIGRATION_TO_POSTGRES.md`](backend/MIGRATION_TO_POSTGRES.md) |## 🚀 QUICK START (Choose One)

| Ship the app to Play Store testers | [`PLAY_STORE_RELEASE.md`](PLAY_STORE_RELEASE.md) |

| See the privacy policy | [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) |

| Preview the marketing landing page | open `growfresh-app.html` |

### ✅ **BEST: Cloud Build (Recommended)**## 🚀 Quick Start (Android)---

---



## Repo layout

```bash

```

gworfresh_in/npm install -g eas-cli

├── App.js                  Expo entry point

├── app.json                Expo config (icon, package, version)eas login### **Option 1: Use Expo Go (Easiest)**## 📖 Quick Links

├── eas.json                Build / submit profiles

├── babel.config.jscd ~/Documents/gworfresh_in

├── package.json            App deps

├── assets/                 Icon + splash PNGs (drop your art here)eas build --platform android

├── src/

│   ├── components/         Reusable UI (BrandCard, ScreenHeader, …)```

│   ├── context/            AppContext (auth, cart, user state)

│   ├── navigation/         AppNavigator (bottom tabs + stacks)```bash- 🚀 **[Quick Start Guide](./QUICK_START.md)** - Get running in 30 minutes

│   ├── screens/            Home, Shop, Cart, Garden, Community, Profile, …

│   ├── services/api.js     Axios client (reads extra.apiUrl)⏱️ **15-30 min** → Real APK sent to your email → Install on phone ✅

│   └── utils/              colors, theme, storage helpers

├── backend/                Node/Express + Postgres API# Install Expo CLI- 📱 **[Local Testing Guide](./LOCAL_TESTING_GUIDE.md)** - Detailed setup instructions

│   ├── server.js

│   ├── routes/             auth, products, orders, garden, community,---

│   │                        analytics, instructors, cart

│   ├── db/migrations/      Knex SQL migrationsnpm install -g expo-cli- 🎬 **[Visual Walkthrough](./VISUAL_WALKTHROUGH.md)** - See what to expect

│   ├── db/seeds/           Demo data

│   ├── Dockerfile          Production container### ⚡ **FAST: Expo Go (Instant Testing)**

│   └── MIGRATION_TO_POSTGRES.md

├── render.yaml             One-click Render.com deploy (DB + API)- 📊 **[Project Summary](./PROJECT_SUMMARY.md)** - Features & architecture

├── scripts/dev-up.sh       Spin up local Postgres + API + Expo

└── growfresh-app.html      Static marketing/landing page```bash

```

npm install -g expo-cli# Go to app directory

---

cd src

## Local dev (TL;DR)

expo startcd src---

```bash

# Prereqs: Node 18+, Docker, Xcode/Android Studio (or Expo Go on phone)# Scan QR code with Expo Go app (free from Play Store)



# 1. clone + bootstrap everything```

git clone <repo> gworfresh_in && cd gworfresh_in

./scripts/dev-up.sh



# Expo dev server opens automatically. Scan QR with Expo Go.⏱️ **2 min** → Test features instantly (no APK needed)# Start the app## ✨ What's Included

# Demo OTP is 1234 for any mobile number.

```



Manual steps if you don't want Docker:---expo start



```bash

# Postgres

brew install postgresql@16 && brew services start postgresql@16### 💻 **LOCAL: Build on Your Computer**### Backend (Node.js + Express + MongoDB)

createdb growfresh



# Backend

cd backend```bash# On your phone:- ✅ 7 RESTful API routes with 25+ endpoints

cp .env.example .env

npm installnpm install -g eas-cli

npm run db:migrate && npm run db:seed

npm run deveas build --platform android --local# 1. Install "Expo Go" app from Play Store- ✅ User authentication (WhatsApp-style OTP)



# Mobile (in a second tab)```

cd ..

npm install# 2. Scan the QR code shown in terminal- ✅ Product catalog with categories

npx expo start

```⏱️ **30-60 min** → APK file created locally



---# 3. App opens instantly!- ✅ Shopping cart & order management



## What's where in the API---



| Path | File |```- ✅ Plant tracking system

| --- | --- |

| `POST /api/auth/verify-otp` | `backend/routes/auth.js` |## 📱 FEATURES

| `GET  /api/products` | `backend/routes/products.js` |

| `POST /api/orders` | `backend/routes/orders.js` (TX-wrapped) |- ✅ Instructor booking

| `GET  /api/garden` | `backend/routes/garden.js` |

| `GET  /api/community` | `backend/routes/community.js` |✅ Product listing with images  

| `GET  /api/analytics/me/insights` | `backend/routes/analytics.js` |

✅ Shopping cart  ### **Option 2: Build APK for Android**- ✅ Community forum

Full schema (12 tables + 2 analytical views) lives in

`backend/db/migrations/20260516000001_init.js`.✅ User login  



---✅ Order placement  - ✅ Reward points system



## Status✅ Beautiful UI  



- ✅ React Native UI (9 screens) refactored onto shared design system```bash- ✅ Stock management

- ✅ Backend migrated MongoDB → PostgreSQL (relational + analytics)

- ✅ Production-hardened server (helmet, rate-limit, CORS allowlist)---

- ✅ EAS build profiles for internal + production tracks

- ✅ Render.com one-click deploy for backend# Install EAS CLI

- 🔜 Drop real `assets/icon.png` + `assets/splash.png`

- 🔜 First Play Store internal-testing build (`npm run build:internal`)## 📖 DETAILED GUIDES



See [`PLAY_STORE_RELEASE.md`](PLAY_STORE_RELEASE.md) for the fullnpm install -g eas-cli### Frontend (React Native + Expo)

ship-it checklist.

👉 **[Android Build Complete Guide](./ANDROID_BUILD_GUIDE.md)**

- ✅ 4 Complete screens built and tested

---

# Log in to Expo- ✅ Professional UI design

## 🎯 RECOMMENDED STEPS

eas login- ✅ OTP-based authentication

1. **Install EAS CLI:** `npm install -g eas-cli`

2. **Create Free Expo Account:** `eas login`- ✅ Product browsing with search/filter

3. **Build APK:** `cd ~/Documents/gworfresh_in && eas build --platform android`

4. **Download:** Check email for download link# Build APK- ✅ Shopping cart management

5. **Install:** Download APK and tap to install on phone

6. **Test:** Open app and explore! 🎉eas build --platform android --local- ✅ Checkout with address form



---- ✅ Order placement & confirmation



## ✨ WHAT YOU GET# Follow the prompts



- Real Android app (APK file)# APK will be generated---

- No Expo Go needed

- Works offline```

- Installable on any Android phone

- Updates can be delivered over-the-air## 🚀 Quick Start



------



## 🛠️ REQUIREMENTS### For Testing Locally



- Node.js v14+## 📋 What's Inside```bash

- Android 8.0+ on phone

- Free Expo account (for cloud builds)# 1. Install dependencies



---**Frontend:** React Native + Exponpm install



## 📊 PROJECT STATUS- Product Shop



✅ Ready for Android  - Shopping Cart# 2. Configure MongoDB (Edit backend/.env)

✅ Production-ready  

✅ All features working  - User LoginMONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/growfresh



---- Clean UI



## 🔗 LINKS# 3. Start backend



- [Expo Documentation](https://docs.expo.dev)**Backend:** Node.js + Expressnpm start

- [EAS Build Docs](https://docs.expo.dev/build/setup/)

- [GitHub Repository](https://github.com/rjarupula1729/gworfresh_in)- Product API



---- User Authentication# 4. Start frontend (new terminal)



**Version:** 1.0.0  - Cart Managementexpo start

**Status:** ✅ Ready to Build & Deploy to Android



Start building now! 🚀

**Database:** MongoDB# 5. Choose your platform

- Product data# - Press 'a' for Android emulator

- User data# - Press 'i' for iOS simulator

- Orders# - Press 'w' for web

```

---

### Test Login

## 🔧 Backend Setup- Mobile: Any 10-digit number (e.g., 9876543210)

- OTP: 1234 (demo)

```bash

# Go to backend---

cd backend

## 📁 Project Structure

# Install dependencies

npm install```

gworfresh_in/

# Create .env file├── backend/          (Node.js + Express + MongoDB)

NODE_ENV=development│   ├── models/       (6 Database collections)

PORT=5000│   ├── routes/       (7 API routes)

MONGODB_URI=mongodb://localhost:27017/growfresh│   └── server.js

JWT_SECRET=your_secret_key├── src/              (React Native)

│   ├── screens/      (4 Complete screens)

# Start server│   ├── context/      (State management)

npm start│   └── services/     (API integration)

├── QUICK_START.md    (30-minute setup)

# API runs on: http://localhost:5000├── LOCAL_TESTING_GUIDE.md

```└── VISUAL_WALKTHROUGH.md

```

---

---

## 📁 Project Structure

## 🎯 Features

```

gworfresh_in/### Completed ✅

├── src/                    # React Native frontend- WhatsApp-style OTP login

│   ├── App.js- Home with categories & featured products

│   ├── screens/           # Home, Shop, Cart, etc- Shop with search & category filter

│   ├── services/api.js    # API calls- Product details view

│   └── app.json          # Expo config- Shopping cart management

├── backend/               # Node.js backend- Checkout with address form

│   ├── server.js- Order placement & confirmation

│   ├── models/           # Database schemas- Reward points system

│   ├── routes/           # API endpoints- Persistent session storage

│   └── config/db.js      # Database connection

└── package.json### In Development 🏗️

```- Plant tracking screen

- Community forum

---- Instructor booking



## 🛒 Features---



✅ Product listing## 🧪 How to Test

✅ Shopping cart

✅ User loginSee **[QUICK_START.md](./QUICK_START.md)** for step-by-step testing guide.

✅ Order management

✅ Simple and clean UIQuick checklist:

- [ ] Backend running

---- [ ] MongoDB connected

- [ ] Frontend running

## 📱 Test on Android- [ ] Login works

- [ ] Products display

### **Easiest Way (Expo Go)**- [ ] Add to cart works

1. Install Expo Go from Play Store- [ ] Order placement succeeds

2. Scan QR code

3. Done! ✨---



### **Standalone APK**## 📱 API Endpoints

1. Run `eas build --platform android --local`

2. Download APKAll backend APIs ready:

3. Install on phone- `POST /auth/verify-otp` - Login

4. Open app- `GET /products` - List products

- `GET /products/:id` - Product details

---- `POST /orders` - Place order

- `GET /orders` - View orders

## 🌐 API Endpoints- `POST /garden` - Track plants

- And more...

```

GET    /api/products          - Get all productsSee [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) for complete API list.

POST   /api/auth/login        - User login

POST   /api/cart              - Add to cart---

GET    /api/cart              - View cart

POST   /api/orders            - Create order## 🔐 Security

```

- JWT authentication (30-day expiry)

---- Protected API routes

- Input validation

## ⚙️ Configuration- Secure token storage



Edit `src/services/api.js`:---

```javascript

const API_URL = 'http://YOUR_BACKEND_URL:5000/api';## 💻 Tech Stack

```

| Layer | Technology |

---|-------|------------|

| Backend | Node.js, Express, MongoDB |

## 🤝 Contributing| Frontend | React Native, Expo |

| State | Context API |

Feel free to add features, fix bugs, or improve UI!| HTTP | Axios |

| Auth | JWT |

---

---

## 📝 License

## 📊 Project Status

Open source - use freely!

| Component | Status |

---|-----------|--------|

| Database | ✅ Complete |

**Ready to test? Start with Expo Go!** 🚀| Backend APIs | ✅ Complete |

| Login Screen | ✅ Complete |
| Home Screen | ✅ Complete |
| Shop Screen | ✅ Complete |
| Cart & Checkout | ✅ Complete |
| Plant Tracking | ⏳ In Progress |
| Community | ⏳ In Progress |
| Instructors | ⏳ In Progress |

---

## 🚀 Getting Started

### Step 1: Setup Backend
```bash
npm install
# Edit backend/.env with MongoDB URI
npm start
```

### Step 2: Setup Frontend
```bash
# In new terminal
expo start
# Press 'a' for Android or 'i' for iOS
```

### Step 3: Test
- Login with any mobile number
- Browse products
- Add to cart
- Place order

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check if MongoDB URI is correct in `.env`
- Verify port 5000 is free
- Run `npm install` again

**Frontend shows blank screen?**
- Run `expo start --clear`
- Check API URL in `src/services/api.js`

**Cannot reach backend?**
- Android Emulator: Use `http://10.0.2.2:5000/api`
- Device: Use your PC's IP address

See [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) for more help.

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 30-minute setup
- **[LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)** - Detailed testing
- **[VISUAL_WALKTHROUGH.md](./VISUAL_WALKTHROUGH.md)** - See what to expect
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Full feature list

---

## MongoDB Setup

Backend database is MongoDB. You can use:

**Option 1: MongoDB Atlas (Cloud - Recommended)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Add to `.env`

**Option 2: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Start service
- Use `mongodb://localhost:27017/growfresh`

---

## 🎯 Next Steps

1. **Follow QUICK_START.md** for local setup
2. **Test all features** using the app
3. **Document findings** in test report
4. **Deploy backend** to cloud (Heroku/AWS)
5. **Build & publish** frontend to Play Store

---

## 📝 Test Report

Document your testing in a `TEST_REPORT.md` file:

```markdown
# Test Results - [Date]

## Environment
- Backend: Running
- Frontend: Expo on Android/iOS
- Database: MongoDB Atlas

## Test Results
- [ ] Login works
- [ ] Products load
- [ ] Search works
- [ ] Add to cart works
- [ ] Order places
- [ ] No errors

## Issues
- None / List any issues found
```

---

## ✨ Key Features

🌱 **For Users**
- Easy shopping interface
- Order tracking
- Plant progress tracking
- Community support
- Expert consultations

💼 **For Business**
- Inventory management
- Customer engagement
- Loyalty rewards
- Growth analytics

---

## 🚢 Deployment Ready

Backend can be deployed to:
- Heroku
- AWS
- Google Cloud
- Azure

Frontend can be distributed as:
- Android APK
- iOS App
- Web version

---

## 📞 Support

For help:
1. Check documentation files
2. Review console logs
3. Test with Postman
4. Verify database connections

---

## 📄 License

MIT License - Open for learning and development

---

**GrowFresh** - Helping people grow vegetables at home! 🌱

**Version**: 1.0.0 MVP  
**Status**: Ready for Local Testing ✅  
**Last Updated**: 28 April 2026
