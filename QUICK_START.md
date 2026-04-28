# 🚀 GrowFresh - Quick Start Checklist

## ⚡ 5-Minute Quick Start

### Prerequisites Check
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB account (Atlas) OR local MongoDB running
- [ ] Terminal/Command Prompt open

---

## 🔧 Setup (15 minutes)

### Backend Setup
```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in

npm install
```

- [ ] Dependencies installed

### Environment Setup
1. Open `backend/.env`
2. Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/growfresh
   ```
3. Save file
- [ ] `.env` configured

### Start Backend
```bash
npm start
```

Expected output:
```
Server running on port 5000
```

- [ ] Backend running on port 5000

---

## 📱 Frontend Setup (10 minutes)

### Install Expo (First time only)
```bash
npm install -g expo-cli
```
- [ ] Expo CLI installed

### Update API URL
1. Open `src/services/api.js`
2. Update `baseURL` based on your setup:
   ```javascript
   // For Android Emulator
   baseURL: "http://10.0.2.2:5000/api"
   
   // For iOS Simulator
   // baseURL: "http://localhost:5000/api"
   
   // For Physical Device (replace with your PC's IP)
   // baseURL: "http://192.168.x.x:5000/api"
   ```
3. Save file
- [ ] API URL updated

### Start Frontend
Open **new terminal** and run:
```bash
expo start
```

Expected output:
```
Expo DevTools is running at http://localhost:19002
Press 'a' to open Android emulator
Press 'i' to open iOS simulator
Press 'w' to open web
```

- [ ] Frontend running

---

## 🧪 Testing (10 minutes)

### Test Login
- [ ] Run app (press 'a' or 'i' or 'w')
- [ ] Enter mobile: `9876543210`
- [ ] Click "Request OTP"
- [ ] Enter OTP: `1234`
- [ ] Click "Verify & Login"
- [ ] ✅ Should see Home Screen

### Test Shopping
- [ ] Click "Shop" card
- [ ] See products displayed ✅
- [ ] Search for product ✅
- [ ] Filter by category ✅
- [ ] Click product → see details ✅
- [ ] Select quantity and add to cart ✅

### Test Cart
- [ ] Click "Cart" card
- [ ] See added items ✅
- [ ] Increase/decrease quantity ✅
- [ ] Click "Proceed to Checkout"
- [ ] Fill address form ✅
- [ ] Select payment method ✅
- [ ] Click "Place Order"
- [ ] See order confirmation ✅

---

## 📊 Verification Checklist

### Backend Working?
```bash
# In Postman or browser:
GET http://localhost:5000/api/products
```
- [ ] Returns products (200 OK)

### Database Connected?
```bash
# In MongoDB Atlas Dashboard:
# Collections tab shows: users, products, orders
```
- [ ] Database has collections

### Frontend Connected?
- [ ] No "Cannot reach backend" errors
- [ ] Products load on Shop screen
- [ ] Orders placed successfully saved

---

## 🎯 Full User Journey Test

Complete this flow end-to-end:

1. [ ] **Login**
   - Mobile: 9876543210
   - OTP: 1234
   - See home screen with rewards points

2. [ ] **Browse**
   - Click "Shop"
   - See 6+ products
   - Try search: "seed"
   - Filter by: "Seeds"

3. [ ] **Product Details**
   - Click any product
   - See name, price, description, instructions
   - Change quantity to 2
   - Click "Add to Cart"

4. [ ] **Cart Management**
   - Click "Cart"
   - See item with qty 2
   - Change qty to 3
   - Remove and re-add
   - See updated total

5. [ ] **Checkout**
   - Click "Proceed to Checkout"
   - Fill address:
     - Line 1: 123 Green Lane
     - City: Mumbai
     - State: Maharashtra
     - Pincode: 400001
   - Select: Online Payment (or COD)
   - Click "Place Order"

6. [ ] **Order Confirmation**
   - See success message with Order ID
   - Reward points increased to 10
   - Cart cleared

---

## 🐛 Troubleshooting Quick Ref

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `.env`, MongoDB URI, port 5000 |
| "Cannot reach backend" | Update API URL, check firewall |
| Blank screen | Clear cache: `expo start --clear` |
| Products not showing | Check MongoDB connection |
| Order fails | Fill all address fields |
| AsyncStorage error | Run `npm install @react-native-async-storage/async-storage` |

---

## 📸 Screenshots to Capture

Document your testing with screenshots:

- [ ] Login screen
- [ ] Home screen with products
- [ ] Shop screen with search/filter
- [ ] Product details modal
- [ ] Cart with items
- [ ] Checkout form
- [ ] Order confirmation

---

## 📋 Final Validation

Run through this checklist to confirm everything works:

```
🔄 Full App Test Cycle
├─ ✅ Backend running
├─ ✅ Frontend running
├─ ✅ Login successful
├─ ✅ Products load
├─ ✅ Add to cart works
├─ ✅ Place order works
├─ ✅ Rewards earned
└─ ✅ No errors in console
```

---

## 🎉 You're Ready!

If all checks pass ✅, your GrowFresh app is working perfectly!

### Next Steps:
1. **Test with Friends** - Share Expo QR code
2. **Test Edge Cases** - Large orders, network issues
3. **Collect Feedback** - User experience
4. **Build APK** - For production distribution
5. **Deploy Backend** - To cloud (Heroku/AWS)

---

## 📞 Quick Help

### Can't find files?
```bash
# List all important files
find . -name "api.js" -o -name ".env" -o -name "server.js"
```

### Check all services
```bash
# MongoDB status
mongo --version

# Node status
npm start

# Expo status
expo start
```

### Force fresh install
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

---

**Remember**: Keep both terminals running (Backend + Frontend) while testing!

Good luck! 🌱
