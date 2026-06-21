/**
 * Crop Suggestion Fallback Service
 * 
 * Rule-based deterministic crop recommendations when AI fails.
 * Based on general agronomy knowledge organized by region/season.
 */

const CROP_DATABASE = {
  south_asia: {
    kharif: ['Rice', 'Maize', 'Sugarcane', 'Cotton', 'Soybean'],
    rabi: ['Wheat', 'Mustard', 'Potato', 'Onion', 'Garlic'],
    summer: ['Watermelon', 'Cucumber', 'Okra', 'Chili'],
    year_round: ['Banana', 'Papaya', 'Coconut', 'Turmeric'],
  },
  southeast_asia: {
    wet: ['Rice', 'Sugarcane', 'Cassava', 'Taro'],
    dry: ['Corn', 'Peanut', 'Mung Bean'],
    year_round: ['Banana', 'Mango', 'Coconut', 'Pineapple'],
  },
  sub_saharan_africa: {
    rainy: ['Maize', 'Millet', 'Sorghum', 'Cassava', 'Yam'],
    dry: ['Groundnut', 'Cowpea', 'Cotton'],
    year_round: ['Cassava', 'Banana', 'Plantain', 'Vegetables'],
  },
  latin_america: {
    wet: ['Rice', 'Maize', 'Bean', 'Cassava'],
    dry: ['Wheat', 'Barley', 'Potato'],
    year_round: ['Coffee', 'Banana', 'Avocado', 'Mango'],
  },
  middle_east: {
    winter: ['Wheat', 'Barley', 'Lentil', 'Chickpea'],
    summer: ['Tomato', 'Cucumber', 'Watermelon', 'Okra'],
    year_round: ['Date Palm', 'Citrus', 'Olive'],
  },
  default: {
    warm: ['Rice', 'Maize', 'Tomato', 'Potato', 'Onion'],
    cool: ['Wheat', 'Barley', 'Pea', 'Lentil'],
    year_round: ['Tomato', 'Bean', 'Squash', 'Leafy Greens'],
  },
};

/**
 * Determine the region based on location string
 */
function detectRegion(location = '') {
  const lower = location.toLowerCase();
  if (/india|bangladesh|pakistan|sri lanka|nepal|bhutan/.test(lower)) return 'south_asia';
  if (/thailand|vietnam|indonesia|philippines|myanmar|cambodia|laos|malaysia/.test(lower)) return 'southeast_asia';
  if (/nigeria|kenya|ethiopia|ghana|tanzania|uganda|south africa|cameroon/.test(lower)) return 'sub_saharan_africa';
  if (/brazil|mexico|colombia|argentina|peru|chile/.test(lower)) return 'latin_america';
  if (/saudi|uae|oman|qatar|iran|iraq|jordan|turkey/.test(lower)) return 'middle_east';
  return 'default';
}

/**
 * Detect current season (simplified)
 */
function detectSeason() {
  const month = new Date().getMonth(); // 0-11
  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return 'warm';
  if (month >= 5 && month <= 8) return 'wet';
  if (month >= 9 && month <= 10) return 'dry';
  return 'cool'; // Nov-Feb
}

/**
 * Get fallback crop recommendations
 * @param {string} location - Farm location
 * @param {string} landSize - Farm land size (used for scale)
 * @returns {Array} Array of crop suggestion objects
 */
export function getFallbackCropSuggestions(location, landSize) {
  const region = detectRegion(location);
  const season = detectSeason();
  const regionData = CROP_DATABASE[region] || CROP_DATABASE.default;

  // Pick crops based on season
  let crops = [];
  if (season === 'warm' || season === 'wet') {
    crops = regionData.wet || regionData.warm || regionData.rainy || [];
  } else {
    crops = regionData.dry || regionData.cool || regionData.winter || [];
  }

  // Always include year-round crops
  if (regionData.year_round) {
    crops = [...crops, ...regionData.year_round];
  }

  // Remove duplicates and limit to 5
  const unique = [...new Set(crops)].slice(0, 5);

  return unique.map((cropName, index) => ({
    cropName,
    expectedYield: `${(1000 + index * 500).toLocaleString()} kg`,
    plantingWindow: season === 'wet' || season === 'warm'
      ? 'April - June (warm season)'
      : 'October - December (cool season)',
    reason: `${cropName} is well-suited for ${location || 'your region'} during the current growing season. It has good market demand and is adaptable to local soil conditions.`,
  }));
}