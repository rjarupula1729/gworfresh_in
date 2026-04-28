# 🌱 GrowFresh - Complete Application

**A mobile application that empowers users to grow their own vegetables at home with quality products, expert guidance, and community support.**

---

## 📖 Quick Links

- 🚀 **[Quick Start Guide](./QUICK_START.md)** - Get running in 30 minutes
- 📱 **[Local Testing Guide](./LOCAL_TESTING_GUIDE.md)** - Detailed setup instructions
- 🎬 **[Visual Walkthrough](./VISUAL_WALKTHROUGH.md)** - See what to expect
- 📊 **[Project Summary](./PROJECT_SUMMARY.md)** - Features & architecture

---

## ✨ What's Included

### Backend (Node.js + Express + MongoDB)
- ✅ 7 RESTful API routes with 25+ endpoints
- ✅ User authentication (WhatsApp-style OTP)
- ✅ Product catalog with categories
- ✅ Shopping cart & order management
- ✅ Plant tracking system
- ✅ Instructor booking
- ✅ Community forum
- ✅ Reward points system
- ✅ Stock management

### Frontend (React Native + Expo)
- ✅ 4 Complete screens built and tested
- ✅ Professional UI design
- ✅ OTP-based authentication
- ✅ Product browsing with search/filter
- ✅ Shopping cart management
- ✅ Checkout with address form
- ✅ Order placement & confirmation

---

## 🚀 Quick Start

### For Testing Locally
```bash
# 1. Install dependencies
npm install

# 2. Configure MongoDB (Edit backend/.env)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/growfresh

# 3. Start backend
npm start

# 4. Start frontend (new terminal)
expo start

# 5. Choose your platform
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Press 'w' for web
```

### Test Login
- Mobile: Any 10-digit number (e.g., 9876543210)
- OTP: 1234 (demo)

---

## 📁 Project Structure

```
gworfresh_in/
├── backend/          (Node.js + Express + MongoDB)
│   ├── models/       (6 Database collections)
│   ├── routes/       (7 API routes)
│   └── server.js
├── src/              (React Native)
│   ├── screens/      (4 Complete screens)
│   ├── context/      (State management)
│   └── services/     (API integration)
├── QUICK_START.md    (30-minute setup)
├── LOCAL_TESTING_GUIDE.md
└── VISUAL_WALKTHROUGH.md
```

---

## 🎯 Features

### Completed ✅
- WhatsApp-style OTP login
- Home with categories & featured products
- Shop with search & category filter
- Product details view
- Shopping cart management
- Checkout with address form
- Order placement & confirmation
- Reward points system
- Persistent session storage

### In Development 🏗️
- Plant tracking screen
- Community forum
- Instructor booking

---

## 🧪 How to Test

See **[QUICK_START.md](./QUICK_START.md)** for step-by-step testing guide.

Quick checklist:
- [ ] Backend running
- [ ] MongoDB connected
- [ ] Frontend running
- [ ] Login works
- [ ] Products display
- [ ] Add to cart works
- [ ] Order placement succeeds

---

## 📱 API Endpoints

All backend APIs ready:
- `POST /auth/verify-otp` - Login
- `GET /products` - List products
- `GET /products/:id` - Product details
- `POST /orders` - Place order
- `GET /orders` - View orders
- `POST /garden` - Track plants
- And more...

See [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) for complete API list.

---

## 🔐 Security

- JWT authentication (30-day expiry)
- Protected API routes
- Input validation
- Secure token storage

---

## 💻 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, MongoDB |
| Frontend | React Native, Expo |
| State | Context API |
| HTTP | Axios |
| Auth | JWT |

---

## 📊 Project Status

| Component | Status |
|-----------|--------|
| Database | ✅ Complete |
| Backend APIs | ✅ Complete |
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
