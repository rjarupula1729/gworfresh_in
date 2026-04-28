#!/bin/bash

# GrowFresh - Automated Setup Script
# This script will install all dependencies and set up the environment

echo "🌱 GrowFresh Setup Script"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Navigate to project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Create .env file in backend
echo "🔧 Setting up environment variables..."
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# Backend Environment Variables
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/growfresh
JWT_SECRET=your_super_secret_key_12345
NODE_ENV=development

# Replace MONGODB_URI with your actual MongoDB connection string
# For local MongoDB: mongodb://localhost:27017/growfresh
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/growfresh
EOF
    echo "✅ Created .env file at backend/.env"
    echo "⚠️  IMPORTANT: Edit backend/.env with your MongoDB credentials"
else
    echo "✅ .env file already exists"
fi

echo ""

# Check backend
echo "🔍 Checking backend setup..."
if [ -d "backend/models" ] && [ -d "backend/routes" ]; then
    echo "✅ Backend structure looks good"
else
    echo "⚠️  Backend structure might be incomplete"
fi

echo ""

# Check frontend
echo "🔍 Checking frontend setup..."
if [ -d "src/screens" ] && [ -d "src/services" ]; then
    echo "✅ Frontend structure looks good"
else
    echo "⚠️  Frontend structure might be incomplete"
fi

echo ""

# Provide next steps
echo "════════════════════════════════════════"
echo "✨ Setup Complete!"
echo "════════════════════════════════════════"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1️⃣  Edit backend/.env with your MongoDB credentials"
echo "   - For MongoDB Atlas: Replace MONGODB_URI with your connection string"
echo "   - For Local MongoDB: Use 'mongodb://localhost:27017/growfresh'"
echo ""
echo "2️⃣  Start MongoDB:"
echo "   - macOS: brew services start mongodb-community"
echo "   - Linux: sudo systemctl start mongod"
echo "   - Windows: net start MongoDB"
echo ""
echo "3️⃣  Start Backend:"
echo "   npm start"
echo ""
echo "4️⃣  In another terminal, Start Frontend:"
echo "   expo start"
echo ""
echo "5️⃣  Test the app:"
echo "   - Press 'a' for Android Emulator"
echo "   - Press 'i' for iOS Simulator"
echo "   - Press 'w' for Web"
echo ""
echo "📖 For detailed testing guide, see: LOCAL_TESTING_GUIDE.md"
echo ""
