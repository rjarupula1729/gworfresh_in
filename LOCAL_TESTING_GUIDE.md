# 🚀 GrowFresh - Local Setup & Testing Guide

## Prerequisites
Before starting, ensure you have:
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- npm or yarn package manager
- MongoDB (local or Atlas account) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Postman (for API testing) - [Download](https://www.postman.com/downloads/)
- React Native CLI or Expo CLI
- Android Studio (for emulator) or Xcode (for iOS)

---

## 📋 Step 1: Setup MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended for Testing)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create a **new project** and **cluster**
4. Click "Connect" and select "Connect your application"
5. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/growfresh`
6. Keep this for later

### Option B: Local MongoDB
1. Install MongoDB Community - [Download](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # Windows (run in PowerShell as Admin)
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```
3. Connection string: `mongodb://localhost:27017/growfresh`

---

## 🔧 Step 2: Setup Backend

### 1. Navigate to backend folder
```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file in backend root
Create a file named `.env` in the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/growfresh
JWT_SECRET=your_super_secret_key_12345
NODE_ENV=development
```

Replace:
- `username` and `password` with your MongoDB Atlas credentials
- OR use `mongodb://localhost:27017/growfresh` for local MongoDB

### 4. Start backend server
```bash
npm start
```

Expected output:
```
Server running on port 5000
```

### 5. Test backend with Postman

Open Postman and test these endpoints:

**Test 1: Login with OTP**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/verify-otp`
- Body (JSON):
```json
{
  "mobile": "9876543210",
  "otp": "1234"
}
```
- Response: Should return `token` and `user` object

**Test 2: Get Products**
- Method: `GET`
- URL: `http://localhost:5000/api/products`
- Headers: `Authorization: Bearer <token_from_login>`
- Response: Should return array of products

**Test 3: Get Product Categories**
- Method: `GET`
- URL: `http://localhost:5000/api/products/categories/list`

✅ If all tests pass, your backend is working!

---

## 📱 Step 3: Setup Frontend (React Native)

### 1. Install React Native Dependencies

Navigate to the project root:
```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
```

Install all npm packages:
```bash
npm install
```

Make sure you have these installed:
```bash
npm install react-native
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install axios
npm install @react-native-async-storage/async-storage
```

### 2. Update API Base URL

Edit `src/services/api.js` and set the correct backend URL:

```javascript
const API = axios.create({
  baseURL: "http://10.0.2.2:5000/api" // For Android Emulator
  // OR
  // baseURL: "http://localhost:5000/api" // For Web/Expo
  // OR
  // baseURL: "http://192.168.x.x:5000/api" // For Physical Device (use your PC's IP)
});
```

---

## 🎮 Step 4: Run Frontend

### Option A: Using Expo (Easiest for Testing)

1. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

2. Start Expo:
```bash
expo start
```

3. You'll see a QR code. Choose one:
   - **iOS**: Press `i` (requires iOS simulator)
   - **Android**: Press `a` (requires Android emulator or physical device)
   - **Web**: Press `w`

### Option B: Using Android Studio Emulator

1. Open Android Studio
2. Click "AVD Manager" → Create/Start a virtual device
3. In terminal, run:
```bash
npm run android
```

### Option C: Using Physical Device

1. Enable USB Debugging on your Android phone
2. Connect phone to computer via USB
3. Run:
```bash
npm run android
```

---

## 🧪 Step 5: Test the Application

### Login Flow
1. Open the app
2. Enter any 10-digit mobile number (e.g., `9876543210`)
3. Click "Request OTP"
4. Enter OTP: `1234` (demo OTP)
5. Click "Verify & Login"
6. ✅ Should redirect to Home Screen

### Home Screen
1. See your rewards points and mobile number
2. View 4 quick action cards
3. Browse categories and featured products
4. Try pull-to-refresh

### Shop Screen
1. Click "Shop" from home or action card
2. See all products in grid
3. Try search functionality
4. Filter by category
5. Click product to view details
6. Adjust quantity and add to cart

### Cart Screen
1. Click cart icon or "Cart" action card
2. See all items added
3. Increase/decrease quantities
4. Remove items
5. Click "Proceed to Checkout"

### Checkout
1. Fill in delivery address:
   - Address Line 1: "123 Green Lane"
   - City: "Mumbai"
   - State: "Maharashtra"
   - Pincode: "400001"
2. Select payment method (Online/COD)
3. Review order summary
4. Click "Place Order"
5. ✅ Should show success with order ID

---

## 🔍 Debugging Tips

### Backend Errors?

Check MongoDB connection:
```bash
# In MongoDB Atlas dashboard
# Go to: Cluster → Connect → Check IP Whitelist (should be 0.0.0.0/0 for testing)
```

Check logs:
```bash
# Terminal should show:
# - POST /api/auth/verify-otp
# - GET /api/products
# - etc.
```

### Frontend Errors?

1. **"Cannot find module"** - Run `npm install` again
2. **"API is not reachable"** - Check backend URL in `src/services/api.js`
3. **"Blank screen"** - Check metro bundler is running
4. **"AsyncStorage not found"** - Install `@react-native-async-storage/async-storage`

### Check console logs:
```bash
# In Expo terminal press 'i' to open inspector
# Or use: adb logcat (for Android)
```

---

## 📊 API Testing Checklist

Create a test sequence in Postman:

```
✅ 1. POST /auth/verify-otp → Get Token
✅ 2. GET /products → List Products
✅ 3. GET /products/categories/list → Get Categories
✅ 4. POST /cart/add → Add to Cart
✅ 5. POST /orders → Place Order
✅ 6. GET /orders → View Orders
✅ 7. POST /garden → Start Plant Tracking
✅ 8. GET /garden → View Plants
```

---

## 🐛 Common Issues & Solutions

### Issue: "ECONNREFUSED"
**Problem**: Backend is not running
**Solution**: 
```bash
npm start
```

### Issue: "MongoDB connection failed"
**Problem**: MongoDB URI is incorrect
**Solution**: 
- Check `.env` file has correct `MONGODB_URI`
- Verify IP whitelist in MongoDB Atlas (0.0.0.0/0)

### Issue: "Cannot load AsyncStorage"
**Problem**: Package not installed
**Solution**:
```bash
npm install @react-native-async-storage/async-storage
```

### Issue: "Blank white screen"
**Problem**: Navigation or rendering error
**Solution**:
```bash
# Clear cache and rebuild
npm start -- --clear-cache
# Or
expo start --clear
```

### Issue: "Cannot find server at http://10.0.2.2:5000"
**Problem**: Wrong API URL for device type
**Solution**:
- Android Emulator: `http://10.0.2.2:5000/api`
- iOS Simulator: `http://localhost:5000/api`
- Physical Device: `http://192.168.x.x:5000/api` (your PC's IP)

To find your PC's IP:
```bash
# macOS/Linux
ifconfig | grep "inet"

# Windows (PowerShell)
ipconfig
```

---

## 📸 Testing Workflow

### Complete User Journey Test:

1. **Authentication**
   - [ ] Login with OTP
   - [ ] Session persists after app close

2. **Browsing**
   - [ ] View home screen
   - [ ] Browse categories
   - [ ] Search products
   - [ ] View product details

3. **Shopping**
   - [ ] Add product to cart
   - [ ] Update quantities
   - [ ] Remove from cart
   - [ ] View cart total

4. **Checkout**
   - [ ] Fill delivery address
   - [ ] Select payment method
   - [ ] Place order
   - [ ] See order confirmation

5. **Post-Order**
   - [ ] Check reward points increased
   - [ ] View order in order list
   - [ ] Start plant tracking

---

## 🚀 Performance Testing

### Load Test
- Add 50+ items to cart
- Check app performance

### Network Test
- Test on slow network (Throttle in DevTools)
- Check error handling

### Storage Test
- Logout and login again
- Verify persistent session

---

## 📱 Device-Specific Notes

### Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd <name>

# Run app on emulator
npm run android
```

### iOS Simulator (macOS only)
```bash
# List available simulators
xcrun simctl list

# Start simulator
xcrun simctl boot <udid>

# Run app on simulator
npm run ios
```

### Physical Device (USB)
```bash
# List connected devices
adb devices

# Run on device
npm run android
```

---

## 📝 Test Report Template

Create a file `TEST_REPORT.md` to document your findings:

```markdown
# GrowFresh Test Report - [Date]

## Environment
- Backend: localhost:5000
- Frontend: Expo / Emulator
- Database: MongoDB Atlas

## Test Results

### Authentication
- [ ] OTP Request - ✅ PASS / ❌ FAIL
- [ ] OTP Verification - ✅ PASS / ❌ FAIL
- [ ] Persistent Login - ✅ PASS / ❌ FAIL

### Products
- [ ] Load Products - ✅ PASS / ❌ FAIL
- [ ] Filter by Category - ✅ PASS / ❌ FAIL
- [ ] Search Products - ✅ PASS / ❌ FAIL

### Cart
- [ ] Add to Cart - ✅ PASS / ❌ FAIL
- [ ] Update Quantity - ✅ PASS / ❌ FAIL
- [ ] Remove Item - ✅ PASS / ❌ FAIL

### Orders
- [ ] Place Order - ✅ PASS / ❌ FAIL
- [ ] Order Confirmation - ✅ PASS / ❌ FAIL
- [ ] View Orders - ✅ PASS / ❌ FAIL

## Issues Found
- [ ] None

## Notes
- App performance: Good
- No crashes observed
```

---

## 🎯 Next Steps After Testing

Once everything works locally:

1. **Create Test Products** (via Postman)
   ```json
   POST /products
   {
     "name": "Tomato Seeds",
     "category": "Seeds",
     "price": 59,
     "stock": 100,
     "description": "High-quality tomato seeds",
     "instructions": "Water daily, place in sunlight"
   }
   ```

2. **Test Full User Journey**
   - Login → Browse → Add to Cart → Checkout → Order

3. **Check Database**
   ```bash
   # In MongoDB Atlas
   # Collections: users, products, orders, plants
   ```

4. **Build APK for Sharing**
   ```bash
   eas build --platform android
   # Or
   npx react-native run-android --variant=release
   ```

---

## 📞 Support Commands

### Terminal Commands for Backend
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process on port 5000
kill -9 <PID>

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Terminal Commands for Frontend
```bash
# Clear Expo cache
expo start --clear

# Clear npm cache
npm cache clean --force

# Clear watchman cache (macOS)
watchman watch-del-all
```

---

## ✨ You're All Set!

Your GrowFresh application is ready to test locally. Follow these steps in order:

1. ✅ Start MongoDB
2. ✅ Start Backend (`npm start`)
3. ✅ Test with Postman
4. ✅ Update API URL in frontend
5. ✅ Start Frontend (`expo start`)
6. ✅ Test complete user journey
7. ✅ Document findings

**Happy Testing! 🎉**

For issues, check the debugging section or review the console logs.
