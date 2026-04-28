# 🗄️ HOW TO GET YOUR MONGODB CONNECTION STRING

## Quick Steps to Get MongoDB URI

### **Step 1: Go to MongoDB Atlas**
```
https://cloud.mongodb.com
Log in with your account
```

### **Step 2: Find Your Cluster**
```
1. Left menu → "Clusters"
2. Find your cluster (usually "Cluster0")
3. Click "Connect" button
```

### **Step 3: Get Connection String**
```
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Drivers"
4. Choose "Node.js" version
5. Copy the connection string
```

### **Step 4: Replace Password**
```
Your connection string looks like:
mongodb+srv://admin:<PASSWORD>@cluster0.xxxxx.mongodb.net/growfresh?retryWrites=true&w=majority

Replace <PASSWORD> with your actual MongoDB password
```

### **Final Connection String Format:**
```
mongodb+srv://admin:your_actual_password@cluster0.xxxxx.mongodb.net/growfresh?retryWrites=true&w=majority
```

---

## Example (Replace with Your Values)

**Before (Template):**
```
mongodb+srv://admin:<PASSWORD>@cluster0.xxxxx.mongodb.net/growfresh?retryWrites=true&w=majority
```

**After (Your Real Values):**
```
mongodb+srv://admin:MyStrongPassword123@cluster0.a1b2c3d4.mongodb.net/growfresh?retryWrites=true&w=majority
```

---

## Common Issues

### **Can't Find Connection String?**
```
1. Make sure you're logged into MongoDB Atlas
2. Go to Clusters page
3. Click "Connect" on your cluster
4. Select "Connect your application"
5. Copy the string shown
```

### **Password Contains Special Characters?**
```
Example: password is My@Pass#word

MongoDB connection string needs URL encoding:
@ becomes %40
# becomes %23
: becomes %3A

So My@Pass#word becomes: My%40Pass%23word

Full string:
mongodb+srv://admin:My%40Pass%23word@cluster0.xxxxx.mongodb.net/growfresh?retryWrites=true&w=majority
```

### **Getting "Authentication Failed"?**
```
Check:
1. Username is correct (usually "admin")
2. Password is correct (exactly as you set it)
3. IP whitelist includes 0.0.0.0/0 (Allow from anywhere)
4. Database exists
```

---

## Adding to Render

Once you have your connection string:

```
1. Go to: https://render.com
2. Select your service
3. Click "Environment" tab
4. Add new variable:
   
   Key: MONGODB_URI
   Value: mongodb+srv://admin:your_password@cluster0.xxxxx.mongodb.net/growfresh?retryWrites=true&w=majority
   
5. Save
6. Service auto-restarts
```

---

## Alternative: Create New MongoDB User

If you don't have your password:

```
1. Go to MongoDB Atlas
2. Click "Database Access" (left menu)
3. Click "Add New Database User"
4. Username: admin
5. Password: Create NEW strong password (save it!)
6. User Privileges: Atlas admin
7. Click "Add User"
8. Wait 30 seconds
9. Use this NEW password in connection string
```

---

## Quick Checklist

Before adding to Render, verify:

- [ ] You have MongoDB Atlas account
- [ ] You created a cluster
- [ ] Cluster is in "READY" state (green)
- [ ] Database user created (with password)
- [ ] IP whitelist includes 0.0.0.0/0
- [ ] You copied the connection string
- [ ] You replaced <PASSWORD> with actual password
- [ ] Special characters are URL encoded (if any)

---

**Once you have the connection string, go back to Render and add it!** 🎉
