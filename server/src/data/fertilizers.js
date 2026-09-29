/**
 * Fertilizer Database
 * 
 * Structured data for common fertilizers used in agriculture.
 * Each fertilizer includes composition, purpose, and suitable conditions.
 * 
 * IMPORTANT: 
 * - Exact dosages should be determined by local agricultural experts
 * - These recommendations are guidance only
 * - Always follow local regulations and guidelines for fertilizer use
 */

export const FERTILIZER_DATABASE = [
  {
    id: 'urea',
    name: 'Urea',
    category: 'Nitrogen Fertilizer',
    type: 'Synthetic',
    composition: {
      nitrogen: 46,
      phosphorus: 0,
      potassium: 0,
    },
    purpose: 'Primary nitrogen source for plant growth and vegetative development',
    suitableConditions: {
      crops: ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Vegetable crops'],
      soilTypes: ['Sandy', 'Loamy', 'Clay Loam'],
      phRange: [5.5, 8.5],
    },
    benefits: [
      'High nitrogen concentration (46%)',
      'Cost-effective',
      'Quick nutrient availability',
      'Suitable for most crops',
    ],
    cautions: [
      'Can be leached in sandy soils',
      'Requires proper moisture for application',
      'Avoid overuse to prevent lodging',
    ],
    applicationGuidance: 'Apply according to crop requirements and soil testing recommendations. Split applications recommended for better nutrient use efficiency.',
    organicAlternative: 'Farmyard manure, compost, crop residue incorporation',
  },

  {
    id: 'diammonium_phosphate',
    name: 'Diammonium Phosphate (DAP)',
    category: 'Balanced NPK Fertilizer',
    type: 'Synthetic',
    composition: {
      nitrogen: 18,
      phosphorus: 46,
      potassium: 0,
    },
    purpose: 'Provides nitrogen and phosphorus for root development and overall plant growth',
    suitableConditions: {
      crops: ['Wheat', 'Rice', 'Maize', 'Cotton', 'Groundnut', 'Pulses'],
      soilTypes: ['Sandy', 'Loamy', 'Clay Loam'],
      phRange: [5.5, 8.5],
    },
    benefits: [
      'Balanced N and P ratio',
      'Improves root development',
      'Better nutrient use efficiency',
      'Widely available',
    ],
    cautions: [
      'Can reduce potassium availability if overused',
      'Monitor soil pH after repeated use',
      'Not recommended for potassium-deficient soils',
    ],
    applicationGuidance: 'Typically applied at planting or as a basal dose. Combine with potassium fertilizer if soil K is deficient.',
    organicAlternative: 'Bone meal (phosphorus source) + compost (nitrogen source)',
  },

  {
    id: 'muriate_potash',
    name: 'Muriate of Potash (MOP)',
    category: 'Potassium Fertilizer',
    type: 'Synthetic',
    composition: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 60,
    },
    purpose: 'Provides potassium for plant strength, disease resistance, and stress tolerance',
    suitableConditions: {
      crops: ['Potatoes', 'Sugarcane', 'Fruits', 'Vegetables'],
      soilTypes: ['Sandy', 'Loamy', 'Clay'],
      phRange: [5.5, 8.5],
    },
    benefits: [
      'High potassium content (60%)',
      'Improves plant strength',
      'Enhances disease resistance',
      'Increases fruit/crop quality',
    ],
    cautions: [
      'Contains chloride; not suitable for chloride-sensitive crops',
      'Can increase soil salinity',
      'Monitor soil EC after application',
    ],
    applicationGuidance: 'Apply based on soil testing results. For sensitive crops, use Sulphate of Potash instead.',
    organicAlternative: 'Wood ash, potassium-rich compost',
  },

  {
    id: 'sulphate_potash',
    name: 'Sulphate of Potash (SOP)',
    category: 'Potassium Fertilizer',
    type: 'Synthetic',
    composition: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 50,
    },
    purpose: 'Provides potassium without chloride; suitable for sensitive crops',
    suitableConditions: {
      crops: ['Tobacco', 'Grapes', 'Tea', 'Fruits', 'Vegetables'],
      soilTypes: ['Sandy', 'Loamy', 'Clay Loam'],
      phRange: [5.5, 8.5],
    },
    benefits: [
      'Chloride-free potassium source',
      'Does not increase soil salinity',
      'Suitable for sensitive crops',
      'Contains sulfur as bonus nutrient',
    ],
    cautions: [
      'Higher cost than MOP',
      'Lower potassium concentration (50% vs 60%)',
    ],
    applicationGuidance: 'Preferred for high-value crops and chloride-sensitive varieties. Apply based on soil test recommendations.',
    organicAlternative: 'Compost from plant material, seaweed-based products',
  },

  {
    id: 'single_superphosphate',
    name: 'Single Superphosphate (SSP)',
    category: 'Phosphorus Fertilizer',
    type: 'Synthetic',
    composition: {
      nitrogen: 0,
      phosphorus: 16,
      potassium: 0,
    },
    purpose: 'Provides phosphorus for root development and energy transfer; contains sulfur',
    suitableConditions: {
      crops: ['All crops'],
      soilTypes: ['Sandy', 'Loamy', 'Clay', 'Acidic soils'],
      phRange: [4.5, 8.5],
    },
    benefits: [
      'Provides available phosphorus',
      'Contains sulfur (12%) as bonus',
      'Suitable for sulfur-deficient soils',
      'Good for acidic soils',
    ],
    cautions: [
      'Lower phosphorus concentration (16% vs 46% in DAP)',
      'Bulky (requires more storage)',
      'May increase soil acidity',
    ],
    applicationGuidance: 'Apply as basal dose or starter fertilizer. Particularly useful in sulfur-deficient regions.',
    organicAlternative: 'Bone meal, rock phosphate, compost',
  },

  {
    id: 'npk_1010',
    name: 'NPK 10:10:10',
    category: 'Balanced NPK Fertilizer',
    type: 'Synthetic',
    composition: {
      nitrogen: 10,
      phosphorus: 10,
      potassium: 10,
    },
    purpose: 'Balanced fertilizer providing all three major nutrients in equal proportions',
    suitableConditions: {
      crops: ['General crops', 'Vegetables', 'Fruits', 'Pulses'],
      soilTypes: ['All soil types'],
      phRange: [5.5, 8.5],
    },
    benefits: [
      'Complete balanced nutrition',
      'Versatile for multiple crops',
      'Easy to apply',
      'Suitable when soil test unavailable',
    ],
    cautions: [
      'May not address specific nutrient deficiencies',
      'Optimal when soil testing is done',
      'May waste nutrients if one nutrient is already sufficient',
    ],
    applicationGuidance: 'Use as general maintenance fertilizer. Soil testing recommended for precision application.',
    organicAlternative: 'Mixed compost + decomposed manure',
  },

  {
    id: 'farmyard_manure',
    name: 'Farmyard Manure (FYM)',
    category: 'Organic Manure',
    type: 'Organic',
    composition: {
      nitrogen: 0.5,
      phosphorus: 0.3,
      potassium: 0.5,
    },
    purpose: 'Improves soil structure, water retention, and biological activity; provides nutrients gradually',
    suitableConditions: {
      crops: ['All crops'],
      soilTypes: ['All soil types'],
      phRange: [4.5, 9.0],
    },
    benefits: [
      'Improves soil structure',
      'Increases water retention',
      'Enhances biological activity',
      'Low cost (from farm)',
      'Sustainable practice',
    ],
    cautions: [
      'Low nutrient concentration; requires large quantities',
      'May contain weed seeds if not properly composted',
      'Takes time to decompose and release nutrients',
      'Requires adequate storage space',
    ],
    applicationGuidance: 'Apply 5-10 tons/hectare annually. Well-decomposed manure preferred. Incorporate into soil before planting.',
    organicAlternative: 'Compost, vermicompost',
  },

  {
    id: 'compost',
    name: 'Compost',
    category: 'Organic Manure',
    type: 'Organic',
    composition: {
      nitrogen: 1.0,
      phosphorus: 0.5,
      potassium: 1.0,
    },
    purpose: 'Enriches soil with organic matter and nutrients; improves soil health and sustainability',
    suitableConditions: {
      crops: ['All crops'],
      soilTypes: ['All soil types'],
      phRange: [4.5, 9.0],
    },
    benefits: [
      'Improves soil structure significantly',
      'Increases water-holding capacity',
      'Enhances microbial activity',
      'Reduces dependence on synthetic fertilizers',
      'Environmentally sustainable',
    ],
    cautions: [
      'Requires time and effort to prepare',
      'Nutrient content varies by feedstock',
      'Slower nutrient release than synthetic',
      'Requires proper composting technique',
    ],
    applicationGuidance: 'Apply 3-5 tons/hectare annually. Mix thoroughly with soil. Can be applied at any time.',
    organicAlternative: 'Farmyard manure, vermicompost, crop residues',
  },

  {
    id: 'green_manure',
    name: 'Green Manure (Legume incorporation)',
    category: 'Organic Manure',
    type: 'Organic',
    composition: {
      nitrogen: 1.5,
      phosphorus: 0.4,
      potassium: 0.8,
    },
    purpose: 'Legume crops incorporated into soil to add nitrogen and organic matter; reduces synthetic fertilizer need',
    suitableConditions: {
      crops: ['All crops'],
      soilTypes: ['All soil types'],
      phRange: [4.5, 9.0],
    },
    benefits: [
      'Biological nitrogen fixation',
      'Reduced synthetic fertilizer need',
      'Improved soil structure',
      'Weed suppression',
      'Cost-effective',
    ],
    cautions: [
      'Requires crop rotation planning',
      'Nutrients not immediately available',
      'May require irrigation',
      'Timing crucial for incorporation',
    ],
    applicationGuidance: 'Plant legume crop (e.g., clover, vetch) and incorporate 45-60 days after flowering. Work into top 15-20 cm of soil.',
    organicAlternative: 'Farmyard manure, compost',
  },

  {
    id: 'biofertilizer',
    name: 'Biofertilizer (Nitrogen-fixing bacteria)',
    category: 'Biofertilizer',
    type: 'Biological',
    composition: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
    },
    purpose: 'Contains beneficial microorganisms that fix atmospheric nitrogen or solubilize nutrients',
    suitableConditions: {
      crops: ['Legumes', 'Cereals', 'Vegetables'],
      soilTypes: ['All soil types'],
      phRange: [5.5, 8.5],
    },
    benefits: [
      'Reduces synthetic nitrogen fertilizer need',
      'Improves soil health',
      'Cost-effective',
      'Environmentally sustainable',
      'May improve nutrient uptake',
    ],
    cautions: [
      'Effectiveness depends on soil conditions',
      'Requires proper storage and handling',
      'Should not be mixed with chemical pesticides',
      'Results variable',
    ],
    applicationGuidance: 'Apply to seeds or soil according to package instructions. Best used with complementary organic matter.',
    organicAlternative: 'Green manure, compost-based practices',
  },

  {
    id: 'lime',
    name: 'Agricultural Lime (Limestone)',
    category: 'Soil Amendment',
    type: 'Synthetic',
    composition: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
    },
    purpose: 'Raises soil pH; suitable for acidic soils; provides calcium and magnesium',
    suitableConditions: {
      crops: ['Legumes', 'Fruits', 'Vegetables'],
      soilTypes: ['Acidic soils'],
      phRange: [4.0, 6.0],
    },
    benefits: [
      'Raises pH in acidic soils',
      'Provides calcium',
      'Contains magnesium',
      'Improves nutrient availability',
      'Reduces aluminum toxicity',
    ],
    cautions: [
      'Can over-alkalize soils',
      'Requires months to show full effect',
      'Should be applied before liming-sensitive nutrients',
      'Excess can reduce micronutrient availability',
    ],
    applicationGuidance: 'Apply 0.5-2 tons/hectare based on soil pH test and buffer capacity. Incorporate into soil well in advance of planting.',
    organicAlternative: 'Seaweed, wood ash (use cautiously)',
  },
];

/**
 * Get fertilizer by ID
 * @param {string} id - Fertilizer ID
 * @returns {Object} Fertilizer details
 */
export function getFertilizerById(id) {
  return FERTILIZER_DATABASE.find((f) => f.id === id);
}

/**
 * Get all fertilizers
 * @returns {Array} All fertilizer records
 */
export function getAllFertilizers() {
  return FERTILIZER_DATABASE;
}

/**
 * Get fertilizers by category
 * @param {string} category - Fertilizer category
 * @returns {Array} Fertilizers in that category
 */
export function getFertilizersByCategory(category) {
  return FERTILIZER_DATABASE.filter((f) => f.category === category);
}

/**
 * Get fertilizers suitable for a crop
 * @param {string} crop - Crop name
 * @returns {Array} Suitable fertilizers
 */
export function getFertilizersByCrop(crop) {
  return FERTILIZER_DATABASE.filter((f) => f.suitableConditions?.crops?.includes(crop));
}

/**
 * Get all fertilizer categories
 * @returns {Array} Unique categories
 */
export function getAllCategories() {
  const categories = new Set(FERTILIZER_DATABASE.map((f) => f.category));
  return Array.from(categories);
}
