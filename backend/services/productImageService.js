/**
 * Product Image Service
 * 
 * Generates realistic product image URLs based on product name and category.
 * Uses curated agriculture image URLs organized by category.
 * No external API calls needed — deterministic mapping.
 * Falls back to randomly selected category images if product not found.
 */

// Comprehensive product-specific image URLs for common agriculture products
export const PRODUCT_IMAGES = {
  // Vegetables
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
  paddy: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
  onion: 'https://images.unsplash.com/photo-1618512492227-c2d6c24dd6c8?w=600&h=400&fit=crop',
  tomato: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=400&fit=crop',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82be4985?w=600&h=400&fit=crop',
  corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop',
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&h=400&fit=crop',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop',
  chili: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=400&fit=crop',
  garlic: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=400&fit=crop',
  cucumber: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&h=400&fit=crop',
  pepper: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=400&fit=crop',
  okra: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&h=400&fit=crop',
  bean: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=600&h=400&fit=crop',
  eggplant: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&h=400&fit=crop',
  cabbage: 'https://images.unsplash.com/photo-1557844352-761f2565b578?w=600&h=400&fit=crop',
  cauliflower: 'https://images.unsplash.com/photo-1568584710177-9c0b8e24ba06?w=600&h=400&fit=crop',
  broccoli: 'https://images.unsplash.com/photo-1584270354949-c26b8d7bda62?w=600&h=400&fit=crop',
  lettuce: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&h=400&fit=crop',
  pumpkin: 'https://images.unsplash.com/photo-1570587253335-25a1bd5f157b?w=600&h=400&fit=crop',
  squash: 'https://images.unsplash.com/photo-1570587253335-25a1bd5f157b?w=600&h=400&fit=crop',
  pea: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=600&h=400&fit=crop',
  lentil: 'https://images.unsplash.com/photo-1515543904370-b12a78ec0a6f?w=600&h=400&fit=crop',

  // Fruits
  mango: 'https://images.unsplash.com/photo-1543530494-1e7bc089c0eb?w=600&h=400&fit=crop',
  banana: 'https://images.unsplash.com/photo-1528825871115-3581a5e31333?w=600&h=400&fit=crop',
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop',
  orange: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&h=400&fit=crop',
  strawberry: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
  watermelon: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&h=400&fit=crop',
  grape: 'https://images.unsplash.com/photo-1596363505723-1942b935e17a?w=600&h=400&fit=crop',
  papaya: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=600&h=400&fit=crop',
  pineapple: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=400&fit=crop',
  lemon: 'https://images.unsplash.com/photo-1590507594749-5b0b40f1b410?w=600&h=400&fit=crop',
  coconut: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=400&fit=crop',
  avocado: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&h=400&fit=crop',
  guava: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c64?w=600&h=400&fit=crop',
  cherry: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=600&h=400&fit=crop',
  peach: 'https://images.unsplash.com/photo-1608835291093-394b6c943a3d?w=600&h=400&fit=crop',

  // Grains
  wheat_grain: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
  barley: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
  oat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
  millet: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
  sugarcane: 'https://images.unsplash.com/photo-1596997000107-b0ceb60a8f8c?w=600&h=400&fit=crop',
  soybean: 'https://images.unsplash.com/photo-1615238359019-cfde42b1e3e0?w=600&h=400&fit=crop',

  // Dairy
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop',
  cheese: 'https://images.unsplash.com/photo-1552767059-ce1833656d17?w=600&h=400&fit=crop',
  butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&h=400&fit=crop',
  yogurt: 'https://images.unsplash.com/photo-1571212515416-fef01fcbff57?w=600&h=400&fit=crop',

  // Meat & Eggs
  egg: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=400&fit=crop',
  chicken: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&h=400&fit=crop',
  fish: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&h=400&fit=crop',
  beef: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=400&fit=crop',
  meat: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=400&fit=crop',
  mutton: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=400&fit=crop',
  goat: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=400&fit=crop',

  // Other
  honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
  turmeric: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=400&fit=crop',
  ginger: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=400&fit=crop',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
  tea: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop',
  cotton: 'https://images.unsplash.com/photo-1584827277042-e2d220456ff5?w=600&h=400&fit=crop',
  jute: 'https://images.unsplash.com/photo-1584827277042-e2d220456ff5?w=600&h=400&fit=crop',
  mustard: 'https://images.unsplash.com/photo-1515543904370-b12a78ec0a6f?w=600&h=400&fit=crop',
  oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop',
};

// Curated image URLs organized by product category (fallback)
const CATEGORY_IMAGES = {
  vegetables: [
    'https://images.unsplash.com/photo-1518977676601-b53f82be4985?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1618512492227-c2d6c24dd6c8?w=600&h=400&fit=crop',
  ],
  fruits: [
    'https://images.unsplash.com/photo-1619546813926-a79faa3c8004?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&h=400&fit=crop',
  ],
  grains: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&h=400&fit=crop',
  ],
  dairy: [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=400&fit=crop',
  ],
  meat: [
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=400&fit=crop',
  ],
  other: [
    'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
  ],
};

/**
 * Normalize product name for lookup
 */
function normalizeName(name) {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/[-_\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .trim();
}

/**
 * Get an image URL for a product based on its name and category
 * @param {string} productName - The product name
 * @param {string} category - The product category
 * @returns {string} A curated image URL
 */
export function getProductImageUrl(productName, category) {
  if (!productName) {
    // Fall back to category-based image
    const categoryKey = (category || 'other').toLowerCase();
    const images = CATEGORY_IMAGES[categoryKey] || CATEGORY_IMAGES.other;
    return images[0]; // deterministic first
  }

  // Try product-specific image first
  const normalized = normalizeName(productName);
  // Try exact match
  if (PRODUCT_IMAGES[normalized]) {
    return PRODUCT_IMAGES[normalized];
  }

  // Try first word match (e.g., "Organic Tomato" -> "tomato")
  const firstWord = normalized.split('_')[0];
  if (PRODUCT_IMAGES[firstWord]) {
    return PRODUCT_IMAGES[firstWord];
  }

  // Fall back to category-based image
  const categoryKey = (category || 'other').toLowerCase();
  const images = CATEGORY_IMAGES[categoryKey] || CATEGORY_IMAGES.other;

  // Deterministic selection based on product name hash
  let hash = 0;
  for (let i = 0; i < productName.length; i++) {
    hash = ((hash << 5) - hash) + productName.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % images.length;
  return images[index];
}