/**
 * Product Images Mapping
 * Using open-source cloud images from Unsplash CDN and Pixabay
 * Images are free to use for personal and commercial projects
 */

const productImages = {
  // Seeds
  "Tomato Seeds": "https://images.unsplash.com/photo-1592841494869-46531ee08ae0?w=400&h=400&fit=crop",
  "Carrot Seeds": "https://images.unsplash.com/photo-1584622614875-e8d9c8a1c0b8?w=400&h=400&fit=crop",
  "Cucumber Seeds": "https://images.unsplash.com/photo-1591928571974-910b57ae9914?w=400&h=400&fit=crop",
  "Pepper Seeds": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Lettuce Seeds": "https://images.unsplash.com/photo-1599599810480-c8d38453aeb5?w=400&h=400&fit=crop",
  "Spinach Seeds": "https://images.unsplash.com/photo-1599599811035-7dd0a06418b5?w=400&h=400&fit=crop",
  "Pumpkin Seeds": "https://images.unsplash.com/photo-1599599811694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Broccoli Seeds": "https://images.unsplash.com/photo-1599599810694-5ac4dd26ac7?w=400&h=400&fit=crop",
  "Cabbage Seeds": "https://images.unsplash.com/photo-1599599811694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Onion Seeds": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Garlic Seeds": "https://images.unsplash.com/photo-1585518419759-12e9e98e3ecf?w=400&h=400&fit=crop",
  "Radish Seeds": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Beet Seeds": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Green Beans Seeds": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Peas Seeds": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",

  // Saplings
  "Tomato Sapling": "https://images.unsplash.com/photo-1592841494869-46531ee08ae0?w=400&h=400&fit=crop",
  "Chili Sapling": "https://images.unsplash.com/photo-1585518419759-12e9e98e3ecf?w=400&h=400&fit=crop",
  "Mint Sapling": "https://images.unsplash.com/photo-1599599810480-c8d38453aeb5?w=400&h=400&fit=crop",
  "Coriander Sapling": "https://images.unsplash.com/photo-1599599811035-7dd0a06418b5?w=400&h=400&fit=crop",
  "Basil Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Thyme Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Oregano Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Parsley Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Cucumber Sapling": "https://images.unsplash.com/photo-1591928571974-910b57ae9914?w=400&h=400&fit=crop",
  "Eggplant Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Cauliflower Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Cabbage Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Onion Sapling": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Spinach Sapling": "https://images.unsplash.com/photo-1599599810480-c8d38453aeb5?w=400&h=400&fit=crop",
  "Lettuce Sapling": "https://images.unsplash.com/photo-1599599810480-c8d38453aeb5?w=400&h=400&fit=crop",

  // Minerals (Fertilizers, Soil, etc.)
  "NPK Fertilizer": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Compost": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Potting Soil": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Neem Oil": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Calcium Supplement": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Organic Pesticide": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Mulch": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "pH Test Kit": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Grow Light": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Plant Support Stakes": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",

  // Tools
  "Garden Spade": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Hand Trowel": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Pruning Shears": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Watering Can": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Garden Gloves": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Hoe": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Rake": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Garden Fork": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Shovel": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
  "Secateurs": "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop",
};

/**
 * Get image URL for a product by name
 * If not found, returns a default garden image
 */
const getProductImage = (productName) => {
  return productImages[productName] || "https://images.unsplash.com/photo-1599599810694-b5ac4dd26ac7?w=400&h=400&fit=crop";
};

/**
 * Get all product images
 */
const getAllProductImages = () => productImages;

module.exports = {
  productImages,
  getProductImage,
  getAllProductImages
};
