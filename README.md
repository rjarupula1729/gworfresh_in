# 🌱 GrowFresh - Agriculture E-Commerce App# 🌱 GrowFresh - Complete Application



Simple app to buy and sell agriculture products online.**A mobile application that empowers users to grow their own vegetables at home with quality products, expert guidance, and community support.**



## 🚀 Quick Start (Android)---



### **Option 1: Use Expo Go (Easiest)**## 📖 Quick Links



```bash- 🚀 **[Quick Start Guide](./QUICK_START.md)** - Get running in 30 minutes

# Install Expo CLI- 📱 **[Local Testing Guide](./LOCAL_TESTING_GUIDE.md)** - Detailed setup instructions

npm install -g expo-cli- 🎬 **[Visual Walkthrough](./VISUAL_WALKTHROUGH.md)** - See what to expect

- 📊 **[Project Summary](./PROJECT_SUMMARY.md)** - Features & architecture

# Go to app directory

cd src---



# Start the app## ✨ What's Included

expo start

### Backend (Node.js + Express + MongoDB)

# On your phone:- ✅ 7 RESTful API routes with 25+ endpoints

# 1. Install "Expo Go" app from Play Store- ✅ User authentication (WhatsApp-style OTP)

# 2. Scan the QR code shown in terminal- ✅ Product catalog with categories

# 3. App opens instantly!- ✅ Shopping cart & order management

```- ✅ Plant tracking system

- ✅ Instructor booking

### **Option 2: Build APK for Android**- ✅ Community forum

- ✅ Reward points system

```bash- ✅ Stock management

# Install EAS CLI

npm install -g eas-cli### Frontend (React Native + Expo)

- ✅ 4 Complete screens built and tested

# Log in to Expo- ✅ Professional UI design

eas login- ✅ OTP-based authentication

- ✅ Product browsing with search/filter

# Build APK- ✅ Shopping cart management

eas build --platform android --local- ✅ Checkout with address form

- ✅ Order placement & confirmation

# Follow the prompts

# APK will be generated---

```

## 🚀 Quick Start

---

### For Testing Locally

## 📋 What's Inside```bash

# 1. Install dependencies

**Frontend:** React Native + Exponpm install

- Product Shop

- Shopping Cart# 2. Configure MongoDB (Edit backend/.env)

- User LoginMONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/growfresh

- Clean UI

# 3. Start backend

**Backend:** Node.js + Expressnpm start

- Product API

- User Authentication# 4. Start frontend (new terminal)

- Cart Managementexpo start



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
