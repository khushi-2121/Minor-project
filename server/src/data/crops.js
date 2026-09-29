/**
 * Crop Database
 * 
 * Structured data for crops with soil requirements and suitability criteria.
 * Used to recommend crops based on soil conditions.
 * 
 * IMPORTANT:
 * - Recommendations should be verified with local agricultural experts
 * - Regional variations and climate play important roles
 * - Always consider local practices and market demands
 */

export const CROP_DATABASE = [
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'Cereal',
    season: 'Rabi (Winter)',
    suitableSoilTypes: ['Sandy Loam', 'Clay Loam', 'Loamy'],
    phRequirements: {
      min: 6.0,
      max: 7.5,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 15, max: 60 },
      phosphorus: { min: 8, max: 25 },
      potassium: { min: 50, max: 150 },
    },
    moisturePreference: 'Moderate (15-25%)',
    salinityTolerance: 'Moderate (EC < 2.0 dS/m)',
    organicCarbonPreference: '> 0.8%',
    temperatureRange: '10-25°C',
    waterRequirement: '400-600 mm',
    yieldPotential: '4-6 tons/hectare (with good management)',
    cultivation: {
      duration: '120-150 days',
      spacing: 'Row to row: 20-25 cm',
      seedRate: '100-125 kg/hectare',
    },
    suitableRegions: ['North India', 'Central India', 'Parts of South India'],
    advantages: [
      'Relatively hardy crop',
      'Good market demand',
      'Suitable for rotation',
      'Can tolerate moderate stress',
    ],
    limitations: [
      'Sensitive to waterlogging at germination',
      'Requires cool season',
      'Susceptible to rust in high humidity',
    ],
  },

  {
    id: 'rice',
    name: 'Rice',
    category: 'Cereal',
    season: 'Kharif (Monsoon)',
    suitableSoilTypes: ['Clay', 'Clay Loam', 'Loamy'],
    phRequirements: {
      min: 5.5,
      max: 8.0,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 40, max: 80 },
      phosphorus: { min: 15, max: 30 },
      potassium: { min: 100, max: 200 },
    },
    moisturePreference: 'High (waterlogged conditions)',
    salinityTolerance: 'Low (EC < 1.0 dS/m)',
    organicCarbonPreference: '> 1.0%',
    temperatureRange: '20-30°C',
    waterRequirement: '1000-1500 mm',
    yieldPotential: '5-7 tons/hectare (with good management)',
    cultivation: {
      duration: '120-150 days',
      spacing: 'Row to row: 20 cm, Plant to plant: 10 cm',
      seedRate: '50-60 kg/hectare',
    },
    suitableRegions: ['Eastern India', 'Coastal areas', 'Parts of South India'],
    advantages: [
      'Staple crop with high demand',
      'Suitable for waterlogged conditions',
      'Good cash crop',
    ],
    limitations: [
      'Requires significant water',
      'Cannot tolerate drought',
      'Labor intensive',
      'Vulnerable to pests in monsoon',
    ],
  },

  {
    id: 'maize',
    name: 'Maize (Corn)',
    category: 'Cereal',
    season: 'Kharif (Monsoon) / Rabi (Winter)',
    suitableSoilTypes: ['Sandy Loam', 'Clay Loam', 'Loamy'],
    phRequirements: {
      min: 5.5,
      max: 7.5,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 30, max: 80 },
      phosphorus: { min: 12, max: 30 },
      potassium: { min: 80, max: 150 },
    },
    moisturePreference: 'Moderate (15-20%)',
    salinityTolerance: 'Low to Moderate (EC < 1.5 dS/m)',
    organicCarbonPreference: '> 0.8%',
    temperatureRange: '21-27°C',
    waterRequirement: '500-700 mm',
    yieldPotential: '5-8 tons/hectare (with good management)',
    cultivation: {
      duration: '80-120 days',
      spacing: 'Row to row: 60 cm, Plant to plant: 20-25 cm',
      seedRate: '20-25 kg/hectare',
    },
    suitableRegions: ['All India'],
    advantages: [
      'High yield potential',
      'Short duration',
      'Versatile crop',
      'Good fodder crop',
    ],
    limitations: [
      'Requires balanced nutrition',
      'Sensitive to waterlogging',
      'Needs good drainage',
    ],
  },

  {
    id: 'sugarcane',
    name: 'Sugarcane',
    category: 'Cash Crop',
    season: 'Year-round (12-18 months)',
    suitableSoilTypes: ['Loamy', 'Clay Loam', 'Sandy Loam'],
    phRequirements: {
      min: 5.5,
      max: 8.0,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 40, max: 120 },
      phosphorus: { min: 20, max: 40 },
      potassium: { min: 150, max: 250 },
    },
    moisturePreference: 'High (well distributed irrigation)',
    salinityTolerance: 'Low (EC < 1.5 dS/m)',
    organicCarbonPreference: '> 1.0%',
    temperatureRange: '20-30°C',
    waterRequirement: '1500-2250 mm',
    yieldPotential: '60-80 tons/hectare (cane)',
    cultivation: {
      duration: '12-18 months',
      spacing: 'Row to row: 75-90 cm',
      seedRate: '1-1.25 tons/hectare (setts)',
    },
    suitableRegions: ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu'],
    advantages: [
      'High yield potential',
      'Good cash crop',
      'Long growth period for multiple nutrients',
      'Biofiuel applications',
    ],
    limitations: [
      'Water intensive',
      'Requires good soil',
      'Nutrient hungry',
      'Long duration crop',
    ],
  },

  {
    id: 'cotton',
    name: 'Cotton',
    category: 'Cash Crop',
    season: 'Kharif (Monsoon)',
    suitableSoilTypes: ['Sandy Loam', 'Loamy', 'Clay Loam'],
    phRequirements: {
      min: 5.8,
      max: 8.0,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 40, max: 100 },
      phosphorus: { min: 15, max: 40 },
      potassium: { min: 100, max: 200 },
    },
    moisturePreference: 'Moderate (12-18%)',
    salinityTolerance: 'Moderate (EC < 2.0 dS/m)',
    organicCarbonPreference: '> 0.8%',
    temperatureRange: '21-30°C',
    waterRequirement: '600-900 mm',
    yieldPotential: '15-20 quintals/hectare (with good management)',
    cultivation: {
      duration: '150-180 days',
      spacing: 'Row to row: 90-100 cm, Plant to plant: 45-60 cm',
      seedRate: '20 kg/hectare',
    },
    suitableRegions: ['Gujarat', 'Maharashtra', 'Telangana', 'Punjab'],
    advantages: [
      'High-value cash crop',
      'Good export potential',
      'Relatively drought tolerant',
    ],
    limitations: [
      'Requires good drainage',
      'Pest prone',
      'Nutrient intensive',
      'Sensitive to moisture stress',
    ],
  },

  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    category: 'Legume/Oil Crop',
    season: 'Kharif (Monsoon) / Rabi (Winter)',
    suitableSoilTypes: ['Sandy Loam', 'Loamy'],
    phRequirements: {
      min: 5.5,
      max: 8.0,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 10, max: 40 },
      phosphorus: { min: 12, max: 25 },
      potassium: { min: 60, max: 120 },
    },
    moisturePreference: 'Moderate (12-16%)',
    salinityTolerance: 'Low (EC < 0.8 dS/m)',
    organicCarbonPreference: '> 0.6%',
    temperatureRange: '20-30°C',
    waterRequirement: '400-600 mm',
    yieldPotential: '1.5-2.5 tons/hectare (pods)',
    cultivation: {
      duration: '100-120 days',
      spacing: 'Row to row: 30 cm, Plant to plant: 10-12 cm',
      seedRate: '80-100 kg/hectare',
    },
    suitableRegions: ['Gujarat', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu'],
    advantages: [
      'Nitrogen-fixing legume',
      'Good oil crop',
      'Drought tolerant',
      'Good for crop rotation',
    ],
    limitations: [
      'Cannot tolerate waterlogging',
      'Requires well-drained soil',
      'Disease prone in humid conditions',
    ],
  },

  {
    id: 'soybean',
    name: 'Soybean',
    category: 'Legume/Oil Crop',
    season: 'Kharif (Monsoon)',
    suitableSoilTypes: ['Sandy Loam', 'Loamy', 'Clay Loam'],
    phRequirements: {
      min: 6.0,
      max: 8.0,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 10, max: 40 },
      phosphorus: { min: 15, max: 30 },
      potassium: { min: 80, max: 150 },
    },
    moisturePreference: 'Moderate (12-20%)',
    salinityTolerance: 'Low (EC < 1.0 dS/m)',
    organicCarbonPreference: '> 0.8%',
    temperatureRange: '20-30°C',
    waterRequirement: '450-700 mm',
    yieldPotential: '2-3 tons/hectare',
    cultivation: {
      duration: '80-100 days',
      spacing: 'Row to row: 45 cm, Plant to plant: 5-7 cm',
      seedRate: '75-100 kg/hectare',
    },
    suitableRegions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
    advantages: [
      'High protein content',
      'Nitrogen-fixing crop',
      'Good for crop rotation',
      'Increasing market demand',
    ],
    limitations: [
      'Not suitable for waterlogged areas',
      'Seed quality dependent',
      'Limited storage life',
    ],
  },

  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Vegetable',
    season: 'Year-round (varying by region)',
    suitableSoilTypes: ['Loamy', 'Sandy Loam', 'Clay Loam'],
    phRequirements: {
      min: 6.0,
      max: 7.5,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 20, max: 60 },
      phosphorus: { min: 15, max: 40 },
      potassium: { min: 80, max: 200 },
    },
    moisturePreference: 'Moderate (20-25%)',
    salinityTolerance: 'Low (EC < 1.0 dS/m)',
    organicCarbonPreference: '> 1.0%',
    temperatureRange: '20-30°C',
    waterRequirement: '400-600 mm',
    yieldPotential: '30-50 tons/hectare (with good management)',
    cultivation: {
      duration: '60-90 days (after transplanting)',
      spacing: 'Row to row: 60-75 cm, Plant to plant: 45-60 cm',
      seedRate: '500-700 grams/hectare (seeds)',
    },
    suitableRegions: ['All India'],
    advantages: [
      'High-value crop',
      'Good market demand',
      'Year-round cultivation possible',
      'Multiple harvests',
    ],
    limitations: [
      'Labor intensive',
      'Disease prone',
      'Requires good management',
      'Sensitive to water stress',
    ],
  },

  {
    id: 'potato',
    name: 'Potato',
    category: 'Vegetable',
    season: 'Rabi (Winter)',
    suitableSoilTypes: ['Sandy Loam', 'Loamy'],
    phRequirements: {
      min: 5.5,
      max: 7.5,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 30, max: 80 },
      phosphorus: { min: 20, max: 40 },
      potassium: { min: 100, max: 200 },
    },
    moisturePreference: 'Well-drained (15-20%)',
    salinityTolerance: 'Low (EC < 1.0 dS/m)',
    organicCarbonPreference: '> 1.0%',
    temperatureRange: '15-25°C',
    waterRequirement: '500-750 mm',
    yieldPotential: '20-30 tons/hectare',
    cultivation: {
      duration: '90-120 days',
      spacing: 'Row to row: 60 cm, Plant to plant: 20-25 cm',
      seedRate: '2-2.5 tons/hectare (seed tubers)',
    },
    suitableRegions: ['Northern India', 'Parts of South India'],
    advantages: [
      'High-yield crop',
      'Good storage life',
      'Staple food crop',
      'Good market',
    ],
    limitations: [
      'Cannot tolerate waterlogging',
      'Requires well-drained soil',
      'Disease and pest prone',
      'High nutrient requirement',
    ],
  },

  {
    id: 'mustard',
    name: 'Mustard',
    category: 'Oil Crop',
    season: 'Rabi (Winter)',
    suitableSoilTypes: ['Sandy Loam', 'Clay Loam', 'Loamy'],
    phRequirements: {
      min: 6.0,
      max: 8.5,
      ideal: 7.0,
    },
    nutrientRequirements: {
      nitrogen: { min: 20, max: 60 },
      phosphorus: { min: 12, max: 25 },
      potassium: { min: 40, max: 100 },
    },
    moisturePreference: 'Moderate (12-15%)',
    salinityTolerance: 'Moderate (EC < 2.0 dS/m)',
    organicCarbonPreference: '> 0.6%',
    temperatureRange: '10-25°C',
    waterRequirement: '250-400 mm',
    yieldPotential: '1.5-2.5 tons/hectare',
    cultivation: {
      duration: '90-120 days',
      spacing: 'Row to row: 30-45 cm',
      seedRate: '3-5 kg/hectare',
    },
    suitableRegions: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'],
    advantages: [
      'Low water requirement',
      'Drought tolerant',
      'Short duration',
      'Good oil content',
    ],
    limitations: [
      'Low yield without good management',
      'Pest prone',
      'Requires good spacing',
    ],
  },

  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'Vegetable',
    season: 'Rabi (Winter) / Kharif (Monsoon)',
    suitableSoilTypes: ['Loamy', 'Clay Loam', 'Sandy Loam'],
    phRequirements: {
      min: 6.0,
      max: 7.5,
      ideal: 6.5,
    },
    nutrientRequirements: {
      nitrogen: { min: 40, max: 80 },
      phosphorus: { min: 15, max: 30 },
      potassium: { min: 80, max: 150 },
    },
    moisturePreference: 'Moderate to High (20-25%)',
    salinityTolerance: 'Low (EC < 0.8 dS/m)',
    organicCarbonPreference: '> 1.0%',
    temperatureRange: '15-25°C',
    waterRequirement: '450-600 mm',
    yieldPotential: '40-60 tons/hectare',
    cultivation: {
      duration: '60-90 days (after transplanting)',
      spacing: 'Row to row: 60-75 cm, Plant to plant: 45-60 cm',
      seedRate: '300-400 grams/hectare (seeds)',
    },
    suitableRegions: ['All India (seasonal variation)'],
    advantages: [
      'High-value vegetable',
      'Good storage life',
      'High yield potential',
      'Good market demand',
    ],
    limitations: [
      'Disease prone',
      'Requires good nitrogen',
      'Labor intensive',
    ],
  },
];

/**
 * Get crop by ID
 * @param {string} id - Crop ID
 * @returns {Object} Crop details
 */
export function getCropById(id) {
  return CROP_DATABASE.find((c) => c.id === id);
}

/**
 * Get all crops
 * @returns {Array} All crop records
 */
export function getAllCrops() {
  return CROP_DATABASE;
}

/**
 * Get crops by category
 * @param {string} category - Crop category
 * @returns {Array} Crops in that category
 */
export function getCropsByCategory(category) {
  return CROP_DATABASE.filter((c) => c.category === category);
}

/**
 * Get crops suitable for soil type
 * @param {string} soilType - Soil type
 * @returns {Array} Suitable crops
 */
export function getCropsBySoilType(soilType) {
  return CROP_DATABASE.filter((c) => c.suitableSoilTypes.includes(soilType));
}

/**
 * Get all crop categories
 * @returns {Array} Unique categories
 */
export function getAllCropCategories() {
  const categories = new Set(CROP_DATABASE.map((c) => c.category));
  return Array.from(categories);
}
