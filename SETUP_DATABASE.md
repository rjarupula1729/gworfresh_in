# ⚡ SETUP YOUR DATABASE - QUICK GUIDE

Your MongoDB is now configured! Here's how to complete the setup and start testing.

---

## ✅ Database Configured

Your `.env` file is ready with:
```
MONGO_URI=mongodb+srv://growfresh:12345@growfresh.ou4hijq.mongodb.net/growfresh
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production_12345
```

---

## 🚀 Quick Start (10 minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

Expected output:
```
added 50+ packages
```

### Step 2: Test MongoDB Connection
```bash
npm start
```

Expected output:
```
Server running on port 5000
MongoDB Connected ✅
```

✅ **If you see "MongoDB Connected" - you're ready to test!**

---

## 🔍 If Connection Fails

### Issue: "Cannot connect to MongoDB"

**Cause**: Network access not enabled

**Fix**:
1. Go to: https://cloud.mongodb.com
2. Navigate to: Network Access
3. Click: "Add IP Address"
4. Select: "Allow access from anywhere" (0.0.0.0/0)
5. Click: "Confirm"
6. Try again: `npm start`

---

### Issue: "Authentication failed"

**Cause**: Wrong password

**Current setup**:
- Username: `growfresh`
- Password: `12345`
- Database: `growfresh`

**Check**: Verify credentials match your MongoDB Atlas account

---

## 📱 Frontend Setup

While backend is running, open another terminal:

```bash
# Go to project root
cd ..

# Install frontend dependencies
npm install

# Start Expo
expo start

# Choose platform:
# Press 'a' for Android Emulator
# Press 'i' for iOS Simulator
# Press 'w' for Web Browser
```

---

## 🧪 Test Complete Flow

### 1. Backend Terminal (Keep Running)
```bash
cd backend
npm start
# Output: Server running on port 5000
# Output: MongoDB Connected
```

### 2. Frontend Terminal
```bash
expo start
# Press 'a' or 'i' or 'w'
# App should open
```

### 3. Login in App
- **Mobile**: 9876543210 (any 10 digits)
- **OTP**: 1234 (demo code)
- **Result**: Should log in and show Home screen ✅

### 4. Test All 8 Screens
- Home (dashboard)
- Shop (products)
- Cart (shopping cart)
- Orders (track orders)
- Garden (plant tracking)
- Community (forum)
- Experts (instructor booking)

---

## 📊 Verify MongoDB Data

### Check if data is being stored:

```bash
# In MongoDB Atlas:
1. Go to: https://cloud.mongodb.com
2. Click your cluster: "growfresh"
3. Click: "Collections"
4. Expand: "growfresh" database
5. See collections: Users, Products, Orders, etc.

# After login:
- New User document should appear in Users collection ✅

# After placing order:
- New Order document should appear in Orders collection ✅
```

---

## ✅ Setup Verification Checklist

- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created with MongoDB URI
- [ ] Backend starts: `npm start`
- [ ] See "MongoDB Connected" message
- [ ] Frontend dependencies installed
- [ ] Frontend starts: `expo start`
- [ ] App opens in emulator/device
- [ ] Can login with mobile + OTP
- [ ] Can see Home screen with categories
- [ ] Can browse Shop and add to cart
- [ ] Can place order (creates MongoDB entry)

---

## 🎯 Your Database Info

| Item | Value |
|------|-------|
| **Provider** | MongoDB Atlas |
| **Cluster** | growfresh |
| **Connection** | SRV |
| **Database** | growfresh |
| **Username** | growfresh |
| **Password** | 12345 |
| **Region** | ou4hijq |

---

## 🔐 Production Security Note

⚠️ **Change JWT_SECRET in production!**

Before deploying:
1. Generate a strong random string
2. Update `.env`:
   ```
   JWT_SECRET=your_very_long_random_string_here
   ```
3. Also restrict MongoDB IP access (not 0.0.0.0/0)

---

## 📞 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Add your IP to Network Access in MongoDB Atlas |
| "Authentication failed" | Verify username (growfresh) and password (12345) |
| "Server starts but no connection message" | Check MONGO_URI in .env file |
| "Expo won't start" | Run `npm install -g expo-cli` first |
| "Port 5000 already in use" | Kill the process or use different port |

---

## 🎉 Next Steps

1. ✅ **Verify Setup**: Follow the 10-minute quick start above
2. ✅ **Test All Screens**: Use the app for 5 minutes
3. ✅ **Run Tests**: Follow TESTING_CHECKLIST.md
4. ✅ **Document Findings**: Note any issues

---

## 📝 Testing Workflow

```
Terminal 1 (Backend):
npm install → npm start → "MongoDB Connected" ✅

Terminal 2 (Frontend):
npm install → expo start → Choose platform → App Opens ✅

App Testing:
Login → Home → Shop → Cart → Order → ✅ Complete!
```

---

**Your application is ready to test!** 🚀

**Start with Terminal 1**: `cd backend && npm install && npm start`

