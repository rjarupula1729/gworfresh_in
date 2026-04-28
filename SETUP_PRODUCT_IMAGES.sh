#!/bin/bash

# 🖼️ PRODUCT IMAGES QUICK SETUP SCRIPT
# This script helps you integrate product images into your GrowFresh app

echo "🖼️  GrowFresh Product Images Setup"
echo "=================================="
echo ""

# Step 1: Check if backend is running
echo "📍 Step 1: Backend Setup"
echo "------------------------"
echo "1. Open backend/server.js"
echo "2. Add this code to your server (after other routes):"
echo ""
echo 'const { seedProductsWithImages, addSampleProducts } = require("./data/seedProducts");'
echo ""
echo 'app.get("/api/seed/products", async (req, res) => {
  try {
    await addSampleProducts(); // Optional
    await seedProductsWithImages();
    res.json({ message: "Products seeded with images" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});'
echo ""

echo "3. Save the file and restart your backend server"
echo ""

# Step 2: Run seeding
echo "📍 Step 2: Seed Products with Images"
echo "------------------------------------"
echo "Run this command in your terminal:"
echo ""
echo "curl http://localhost:5000/api/seed/products"
echo ""
echo "You should see: { \"message\": \"Products seeded with images\" }"
echo ""

# Step 3: Verify in frontend
echo "📍 Step 3: Verify in Frontend"
echo "----------------------------"
echo "1. Run your frontend app"
echo "2. Navigate to Shop screen"
echo "3. You should see product images in the grid"
echo "4. Click on any product to see the full image"
echo ""

echo "✅ Setup Complete!"
echo ""
echo "📁 Files Modified:"
echo "   - backend/models/Product.js (added image, description, instructions, stock)"
echo "   - src/screens/ShopScreen.js (added Image component, updated rendering)"
echo ""
echo "📁 Files Created:"
echo "   - backend/data/productImages.js (40+ image mappings)"
echo "   - backend/data/seedProducts.js (seeding script)"
echo "   - PRODUCT_IMAGES_GUIDE.md (detailed documentation)"
echo ""
echo "🌐 Image Sources:"
echo "   - All images from Unsplash CDN"
echo "   - Free for personal & commercial use"
echo "   - 40+ product images included"
echo ""
echo "💡 Tips:"
echo "   - Images are already optimized (400x400)"
echo "   - Fallback to emojis if image unavailable"
echo "   - Easy to customize image URLs"
echo "   - Can use your own image URLs"
echo ""
