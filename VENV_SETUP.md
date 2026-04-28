# 🔒 Virtual Environment Setup (IMPORTANT!)

**Keep GrowFresh isolated from your system. Use this guide BEFORE running npm install!**

---

## ✅ Why Virtual Environment?

- ✅ Keeps all project packages isolated
- ✅ Doesn't affect other projects or system
- ✅ Easy to delete project without messing up computer
- ✅ Team members can have same exact setup

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Navigate to Project Root
```bash
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
```

**What this does**: Creates a `venv` folder with isolated Python

### Step 3: Activate Virtual Environment
```bash
source venv/bin/activate
```

**You'll see** `(venv)` at start of terminal line ✅

### Step 4: Upgrade pip
```bash
pip install --upgrade pip
```

---

## 📦 Now Safe to Install Everything

### Backend Dependencies (Inside activated venv)
```bash
cd backend
npm install
npm start
```

### Frontend Dependencies (In separate terminal, also in venv)
```bash
# First activate venv in new terminal
source venv/bin/activate

# Then install frontend
npm install
expo start
```

---

## 🔍 Verify Virtual Environment is Active

**Look for this at terminal start:**
```
(venv) username@computer gworfresh_in %
```

If you see `(venv)` = ✅ You're in virtual environment

---

## 📋 Step-by-Step Complete Setup

### Terminal 1: Backend Setup
```bash
# Go to project
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in

# Create venv (only once)
python3 -m venv venv

# Activate venv
source venv/bin/activate

# You should see (venv) now ✅

# Go to backend
cd backend

# Install Node dependencies
npm install

# Start server
npm start
```

### Terminal 2: Frontend Setup (NEW terminal)
```bash
# Go to project
cd /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in

# Activate venv
source venv/bin/activate

# You should see (venv) now ✅

# Install frontend dependencies
npm install

# Start expo
expo start
```

---

## ⚠️ Important Reminders

### Every Time You Start Working:
```bash
# FIRST: Activate venv
source venv/bin/activate

# Then: Do your work
npm start
```

### To Deactivate (When Done)
```bash
deactivate
```

---

## 🗑️ Complete Cleanup (If Needed)

**To delete entire project without affecting system:**
```bash
# Deactivate first
deactivate

# Delete project folder - everything goes with it!
rm -rf /Users/81244824/Library/CloudStorage/OneDrive-Pepsico/Documents/gworfresh_in
```

No system files affected! ✅

---

## 📊 Project Structure with Venv

```
gworfresh_in/
├── venv/                    ← 🔒 ISOLATED ENVIRONMENT (created by python3 -m venv)
│   ├── bin/
│   │   ├── activate         ← Activate script (run: source venv/bin/activate)
│   │   └── python
│   ├── lib/
│   └── pyvenv.cfg
├── backend/                 ← Node.js backend
│   ├── node_modules/        ← All npm packages (created by npm install)
│   ├── package.json
│   └── ...
├── src/                     ← React Native frontend
│   ├── node_modules/        ← All npm packages (created by npm install)
│   ├── package.json
│   └── ...
└── .env                     ← Your MongoDB credentials
```

---

## 🎯 Isolation Breakdown

| What | Where | Isolated? |
|-----|-------|-----------|
| Python environment | `venv/bin/python` | ✅ Yes |
| Node packages (backend) | `backend/node_modules/` | ✅ Yes |
| Node packages (frontend) | `src/node_modules/` | ✅ Yes |
| System Python | `/usr/bin/python3` | ✅ NOT TOUCHED |
| System Node | `/usr/local/bin/node` | ✅ NOT TOUCHED |

---

## ✅ Checklist Before Starting

- [ ] Created venv folder: `python3 -m venv venv`
- [ ] See `(venv)` in terminal
- [ ] Backend Node dependencies installed: `cd backend && npm install`
- [ ] Frontend dependencies installed: `npm install`
- [ ] `.env` file exists with MongoDB credentials
- [ ] Ready to run `npm start` (backend) and `expo start` (frontend)

---

## 🆘 Troubleshooting

### "Python 3 not found"
```bash
# Install Python 3
brew install python3
```

### "venv already exists"
```bash
# Delete old one first
rm -rf venv

# Then create new
python3 -m venv venv
```

### "Not in virtual environment"
```bash
# You forgot to activate!
source venv/bin/activate

# You should see (venv) now
```

### "Can't delete venv"
```bash
# Make sure it's deactivated first
deactivate

# Then delete
rm -rf venv
```

---

## 📝 Summary

1. **Create**: `python3 -m venv venv` (once only)
2. **Activate**: `source venv/bin/activate` (every time you start)
3. **Install**: `npm install` (in backend and root)
4. **Run**: `npm start` and `expo start`
5. **Deactivate**: `deactivate` (when done)

---

## 🔐 Safety Check

**Your system is completely safe because:**
- ✅ venv keeps Python packages isolated
- ✅ node_modules folders are in project, not system
- ✅ .env keeps credentials local only
- ✅ Delete `gworfresh_in` folder = everything gone
- ✅ No files scattered in /usr/local/ or ~/.config/

**You can work freely without worrying!** 🎉

---

## 🚀 Ready? Follow START_NOW.md After Venv Setup!

After this setup works, go to START_NOW.md for the next steps.

**Command order:**
1. `source venv/bin/activate` ← FIRST! You must see (venv)
2. `cd backend && npm install && npm start` ← Terminal 1
3. `npm install && expo start` ← Terminal 2 (new, also activate venv first!)

