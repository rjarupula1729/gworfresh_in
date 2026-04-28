/**
 * Product Seeding Script
 * Updates existing products with images and additional details
 * Run this once to populate product images
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const { getProductImage } = require('./productImages');

// Sample products with descriptions
const productDescriptions = {
  "Tomato Seeds": {
    description: "High-quality tomato seeds for summer gardening. Perfect for beginners. Yields juicy, flavorful tomatoes.",
    instructions: "• Sow seeds 6-8 weeks before last frost\n• Keep soil moist until germination\n• Transplant when 2 inches tall\n• Place in full sunlight\n• Water regularly, especially during flowering",
    stock: 150
  },
  "Carrot Seeds": {
    description: "Sweet orange carrot seeds. Great for salads and cooking. Direct sow in garden.",
    instructions: "• Direct sow seeds in garden\n• Keep soil loose and well-drained\n• Sow ¼ inch deep\n• Water gently to avoid seed displacement\n• Thin seedlings when 2 inches tall",
    stock: 200
  },
  "Cucumber Seeds": {
    description: "Crisp and refreshing cucumber seeds. Perfect for hot weather gardening.",
    instructions: "• Sow seeds after last frost\n• Plant in warm soil (60°F+)\n• Support with trellis for vertical growth\n• Water consistently\n• Harvest when 6-8 inches long",
    stock: 120
  },
  "Tomato Sapling": {
    description: "Pre-grown tomato saplings ready to transplant. 4-6 weeks old.",
    instructions: "• Transplant after last frost date\n• Space 24-36 inches apart\n• Provide sturdy support or cage\n• Water at base of plant\n• Prune lower leaves for better air circulation",
    stock: 80
  },
  "Mint Sapling": {
    description: "Fresh mint saplings for tea and cooking. Perennial herb.",
    instructions: "• Plant in partial shade or full sun\n• Keep soil consistently moist\n• Pinch off flower buds to encourage leaf growth\n• Harvest leaves regularly\n• Container or garden growing",
    stock: 100
  },
  "NPK Fertilizer": {
    description: "Balanced NPK (10-10-10) fertilizer. Essential nutrients for all plants.",
    instructions: "• Apply according to plant type\n• Follow package directions\n• Water after application\n• Use every 2-4 weeks during growing season\n• Store in cool, dry place",
    stock: 300
  },
  "Potting Soil": {
    description: "Premium potting mix with drainage and nutrients. Ready to use.",
    instructions: "• Use for containers and pots\n• Mix with garden soil if needed\n• Provide drainage holes\n• Water thoroughly after potting\n• Replace yearly for optimal results",
    stock: 250
  },
  "Compost": {
    description: "Rich organic compost. Improves soil quality and plant health.",
    instructions: "• Mix with garden soil 1:1 ratio\n• Apply 2-4 inches to garden bed\n• Work into top 6-8 inches of soil\n• Water well after application\n• Great for all plants",
    stock: 200
  },
  "Garden Spade": {
    description: "Durable stainless steel garden spade. Essential gardening tool.",
    instructions: "• Perfect for digging and edging\n• Comfortable wooden handle\n• Rust-resistant blade\n• Clean after each use\n• Store in dry location",
    stock: 50
  },
  "Watering Can": {
    description: "2-liter plastic watering can with spray nozzle.",
    instructions: "• Fill with water and spray gently\n• Use for seedlings and delicate plants\n• Adjustable nozzle for mist or stream\n• Lightweight and durable\n• Easy to store",
    stock: 150
  },
};

/**
 * Seed products with images and descriptions
 */
const seedProductsWithImages = async () => {
  try {
    console.log("🌱 Starting product image seeding...");

    // Get all products
    const products = await Product.find();
    
    if (products.length === 0) {
      console.log("⚠️  No products found in database. Please add products first.");
      return;
    }

    console.log(`Found ${products.length} products. Updating with images...`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // Get image URL for product
        const imageUrl = getProductImage(product.name);
        
        // Get description if available
        const productDesc = productDescriptions[product.name] || {};

        // Update product with image and details
        await Product.findByIdAndUpdate(product._id, {
          image: imageUrl,
          description: productDesc.description || product.description || "Premium quality product for your garden",
          instructions: productDesc.instructions || product.instructions || "• Water regularly\n• Place in sunlight\n• Maintain soil moisture\n• Check for pests weekly",
          stock: productDesc.stock || product.stock || 100
        });

        updated++;
        console.log(`✅ Updated: ${product.name}`);
      } catch (err) {
        skipped++;
        console.log(`⚠️  Skipped: ${product.name} - ${err.message}`);
      }
    }

    console.log(`\n📊 Seeding Complete!`);
    console.log(`✅ Updated: ${updated} products`);
    console.log(`⚠️  Skipped: ${skipped} products`);

  } catch (err) {
    console.error("❌ Error seeding products:", err.message);
  }
};

/**
 * Add sample products if none exist
 */
const addSampleProducts = async () => {
  try {
    const existingCount = await Product.countDocuments();
    
    if (existingCount > 0) {
      console.log(`✅ ${existingCount} products already exist. Skipping sample data.`);
      return;
    }

    console.log("📦 Adding sample products...");

    const sampleProducts = [
      // Seeds
      { name: "Tomato Seeds", price: 150, category: "Seeds", emoji: "🍅" },
      { name: "Carrot Seeds", price: 120, category: "Seeds", emoji: "🥕" },
      { name: "Cucumber Seeds", price: 100, category: "Seeds", emoji: "🥒" },
      { name: "Pepper Seeds", price: 180, category: "Seeds", emoji: "🌶️" },
      { name: "Lettuce Seeds", price: 80, category: "Seeds", emoji: "🥬" },

      // Saplings
      { name: "Tomato Sapling", price: 350, category: "Saplings", emoji: "🍅" },
      { name: "Chili Sapling", price: 280, category: "Saplings", emoji: "🌶️" },
      { name: "Mint Sapling", price: 200, category: "Saplings", emoji: "🌿" },
      { name: "Basil Sapling", price: 250, category: "Saplings", emoji: "🌿" },
      { name: "Coriander Sapling", price: 220, category: "Saplings", emoji: "🌿" },

      // Minerals
      { name: "NPK Fertilizer", price: 250, category: "Minerals", emoji: "💪" },
      { name: "Compost", price: 400, category: "Minerals", emoji: "💪" },
      { name: "Potting Soil", price: 350, category: "Minerals", emoji: "💪" },
      { name: "Neem Oil", price: 300, category: "Minerals", emoji: "💪" },
      { name: "Organic Pesticide", price: 280, category: "Minerals", emoji: "💪" },

      // Tools
      { name: "Garden Spade", price: 500, category: "Tools", emoji: "🛠️" },
      { name: "Hand Trowel", price: 200, category: "Tools", emoji: "🛠️" },
      { name: "Pruning Shears", price: 450, category: "Tools", emoji: "✂️" },
      { name: "Watering Can", price: 300, category: "Tools", emoji: "💧" },
      { name: "Garden Gloves", price: 150, category: "Tools", emoji: "🧤" },
    ];

    const created = await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${created.length} sample products`);

  } catch (err) {
    console.error("❌ Error adding sample products:", err.message);
  }
};

module.exports = {
  seedProductsWithImages,
  addSampleProducts
};
