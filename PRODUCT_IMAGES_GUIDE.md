# 🖼️ Product Images Setup Guide

## Overview

Product images have been integrated into your GrowFresh app using open-source cloud images from **Unsplash CDN**. All images are free for personal and commercial use.

## What Was Added

### 1. **Product Images Mapping** (`backend/data/productImages.js`)
- 40+ product-to-image URL mappings
- Open-source Unsplash images
- Helper functions for image retrieval
- Fallback to default garden image

### 2. **Product Seeding Script** (`backend/data/seedProducts.js`)
- Populates products with images
- Adds product descriptions
- Adds care instructions
- Sets stock quantities
- Can add sample products if none exist

### 3. **Updated Product Model** (`backend/models/Product.js`)
- New `image` field (String) - Product image URL
- New `description` field (String) - Product description
- New `instructions` field (String) - Care instructions
- New `stock` field (Number) - Available quantity

### 4. **Enhanced Shop Screen** (`src/screens/ShopScreen.js`)
- Displays product images in grid
- Shows larger image in product details
- Fallback to emojis if image unavailable
- Responsive image handling

## Usage

### Step 1: Run the Seeding Script

Add this to your backend `server.js` or create a separate script:

```javascript
const { seedProductsWithImages, addSampleProducts } = require('./data/seedProducts');

// Run once on startup or via API route
app.get('/api/seed/products', async (req, res) => {
  try {
    await addSampleProducts(); // Optional: adds sample products if empty
    await seedProductsWithImages();
    res.json({ message: "Products seeded with images" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Step 2: Access the Endpoint

```bash
# Run the seeding once
curl http://localhost:5000/api/seed/products
```

### Step 3: Verify in App

1. Open the Shop screen
2. You'll see product images displayed in the grid
3. Click on any product to see the full image

## Image Sources

### Image URLs Used

All images are from **Unsplash CDN** (free stock photos):

**Vegetables & Products:**
- Tomatoes: `https://images.unsplash.com/photo-1592841494869-46531ee08ae0?w=400&h=400&fit=crop`
- Carrots: `https://images.unsplash.com/photo-1584622614875-e8d9c8a1c0b8?w=400&h=400&fit=crop`
- Cucumbers: `https://images.unsplash.com/photo-1591928571974-910b57ae9914?w=400&h=400&fit=crop`
- Herbs & Greens: Various Unsplash URLs
- Tools & Supplies: Garden/tool themed images

### Adding Your Own Images

To use different images:

1. **Option A: Upload to Cloud**
   - Upload images to Imgur, AWS S3, or Cloudinary
   - Get the public URL
   - Update `backend/data/productImages.js`

2. **Option B: Use Different Stock Photo Service**
   - Pixabay: `https://pixabay.com`
   - Pexels: `https://www.pexels.com`
   - Unsplash: `https://unsplash.com`

3. **Option C: Custom Product Images**
   ```javascript
   // In productImages.js
   "Your Product Name": "https://your-image-url.com/image.jpg"
   ```

## Code Examples

### Get Image for a Product

```javascript
const { getProductImage } = require('./data/productImages');

const imageUrl = getProductImage("Tomato Seeds");
// Returns: https://images.unsplash.com/photo-1592841494869-46531ee08ae0?w=400&h=400&fit=crop
```

### Display Image in Frontend

```javascript
import { Image } from 'react-native';

<Image
  source={{ uri: product.image }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/>
```

### Fallback to Emoji

```javascript
{product.image ? (
  <Image source={{ uri: product.image }} style={styles.image} />
) : (
  <Text>{product.emoji}</Text>
)}
```

## Database Field Examples

```json
{
  "_id": "60d5ec49c1234567890abcde",
  "name": "Tomato Seeds",
  "price": 150,
  "category": "Seeds",
  "emoji": "🍅",
  "image": "https://images.unsplash.com/photo-1592841494869-46531ee08ae0?w=400&h=400&fit=crop",
  "description": "High-quality tomato seeds for summer gardening. Perfect for beginners. Yields juicy, flavorful tomatoes.",
  "instructions": "• Sow seeds 6-8 weeks before last frost\n• Keep soil moist until germination\n• Transplant when 2 inches tall\n• Place in full sunlight\n• Water regularly, especially during flowering",
  "stock": 150
}
```

## Customization

### Change Image Resolution

Update the image URLs to desired dimensions:

```javascript
// Current: ?w=400&h=400&fit=crop
// Change to:
"Product Name": "https://images.unsplash.com/photo-xxx?w=600&h=600&fit=crop"
```

### Add Image to Existing Product

```javascript
const product = await Product.findByIdAndUpdate(productId, {
  image: "https://images.unsplash.com/photo-xxx"
});
```

### Batch Update Images

```javascript
// In seedProducts.js
const products = await Product.find();
for (const product of products) {
  const image = getProductImage(product.name);
  await product.updateOne({ image });
}
```

## Troubleshooting

### Images Not Loading

**Issue:** Images show as placeholder or emoji

**Solutions:**
1. Check internet connection
2. Verify image URL is accessible
3. Check `product.image` is not null
4. Fallback to emoji is working as intended

### Slow Image Loading

**Solutions:**
1. Images are already optimized (400x400)
2. Consider implementing image caching
3. Use React Native's Image caching:

```javascript
<Image
  source={{ uri: product.image, cache: 'force-cache' }}
  style={styles.image}
/>
```

### Wrong Image for Product

**Solution:** Update the mapping in `productImages.js`:

```javascript
// Before
"Product Name": "old-url"

// After
"Product Name": "new-url"
```

## Performance Tips

### 1. Image Caching
```javascript
// In ShopScreen.js
<Image
  source={{ uri: product.image }}
  cache="force-cache"
  style={styles.productImage}
/>
```

### 2. Lazy Loading
Use `react-native-lazy-index` for efficient list rendering

### 3. Image Optimization
- Current size: 400x400 (already optimized)
- Format: JPEG (efficient)
- All images from CDN (fast delivery)

## File Locations

```
backend/
├── data/
│   ├── productImages.js      ← Image mappings
│   └── seedProducts.js       ← Seeding script
└── models/
    └── Product.js            ← Updated schema

src/
└── screens/
    └── ShopScreen.js         ← Updated UI
```

## Next Steps

1. ✅ Run seeding script: `/api/seed/products`
2. ✅ View Shop screen - should show images
3. ✅ Click products to see details with full images
4. ✅ Add to cart as usual

## API Endpoints (Optional)

Add these routes to enable image management:

```javascript
// Get all product images
app.get('/api/products/images', (req, res) => {
  const { getAllProductImages } = require('./data/productImages');
  res.json(getAllProductImages());
});

// Update product image
app.put('/api/products/:id/image', async (req, res) => {
  const { image } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, { image }, { new: true });
  res.json(product);
});
```

## Questions?

- Check product images in database: `db.products.find().pretty()`
- Verify URLs are accessible in browser
- Check ShopScreen console for image loading errors
- Ensure `Image` is imported from 'react-native'

---

**Status:** ✅ Ready to Use

All product images are configured and ready to display in your GrowFresh app!
