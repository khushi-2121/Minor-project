/**
 * Nutrient Reference Guide
 * 
 * Based on standard agricultural soil testing recommendations.
 * These thresholds help classify soil nutrient status for general agriculture.
 * 
 * IMPORTANT: These are reference ranges. Specific crop requirements may vary.
 * Always consult with local agricultural extension services for precise guidance.
 * 
 * Units:
 * - Nitrogen (N), Phosphorus (P), Potassium (K): mg/kg
 * - pH: Scale 0-14
 * - Organic Carbon: %
 * - Electrical Conductivity (EC): dS/m (deci-Siemens per meter)
 */

export const NUTRIENT_THRESHOLDS = {
  nitrogen: {
    name: 'Nitrogen',
    unit: 'mg/kg',
    category: 'Macronutrient',
    function: 'Promotes vegetative growth and leaf development',
    deficiency: {
      threshold: 20,
      status: 'Deficient',
      symptoms: 'Stunted growth, yellowing leaves',
      recommendation: 'Add nitrogen-rich fertilizer or organic matter',
    },
    sufficient: {
      min: 20,
      max: 60,
      status: 'Sufficient',
      recommendation: 'Adequate for most crops; monitor as needed',
    },
    excess: {
      threshold: 60,
      status: 'Excess',
      symptoms: 'Potential lodging, disease susceptibility',
      recommendation: 'Avoid additional nitrogen; focus on other nutrients',
    },
  },

  phosphorus: {
    name: 'Phosphorus',
    unit: 'mg/kg',
    category: 'Macronutrient',
    function: 'Supports root development, flowering, and energy transfer',
    deficiency: {
      threshold: 10,
      status: 'Deficient',
      symptoms: 'Poor root development, delayed maturity',
      recommendation: 'Add phosphate fertilizer',
    },
    sufficient: {
      min: 10,
      max: 30,
      status: 'Sufficient',
      recommendation: 'Adequate phosphorus; maintain levels',
    },
    excess: {
      threshold: 30,
      status: 'Excess',
      symptoms: 'May interfere with micronutrient availability',
      recommendation: 'Avoid additional phosphate; focus on other nutrients',
    },
  },

  potassium: {
    name: 'Potassium',
    unit: 'mg/kg',
    category: 'Macronutrient',
    function: 'Regulates water movement and stress tolerance',
    deficiency: {
      threshold: 80,
      status: 'Deficient',
      symptoms: 'Reduced stress tolerance, poor fruit quality',
      recommendation: 'Add potassium-rich fertilizer',
    },
    sufficient: {
      min: 80,
      max: 200,
      status: 'Sufficient',
      recommendation: 'Adequate potassium; maintain levels',
    },
    excess: {
      threshold: 200,
      status: 'Excess',
      symptoms: 'May interfere with calcium and magnesium uptake',
      recommendation: 'Avoid additional potassium; rebalance other nutrients',
    },
  },

  ph: {
    name: 'pH',
    unit: 'Scale (0-14)',
    category: 'Soil Property',
    function: 'Affects nutrient availability and microbial activity',
    acidic: {
      max: 6.0,
      status: 'Acidic',
      symptoms: 'Aluminum toxicity, reduced nutrient availability',
      recommendation: 'Add lime to raise pH if needed',
    },
    neutral: {
      min: 6.0,
      max: 7.5,
      status: 'Neutral to Slightly Alkaline',
      recommendation: 'Ideal range for most crops; maintain levels',
    },
    alkaline: {
      min: 7.5,
      status: 'Alkaline',
      symptoms: 'Iron and micronutrient deficiencies',
      recommendation: 'Add sulfur or organic matter to lower pH if needed',
    },
  },

  organicCarbon: {
    name: 'Organic Carbon',
    unit: '%',
    category: 'Soil Property',
    function: 'Linked to soil structure, water retention, and biological activity',
    low: {
      threshold: 0.5,
      status: 'Low',
      symptoms: 'Poor soil structure, reduced water retention',
      recommendation: 'Increase organic matter through compost or manure',
    },
    moderate: {
      min: 0.5,
      max: 1.5,
      status: 'Moderate',
      recommendation: 'Adequate organic matter; continue adding to maintain',
    },
    high: {
      min: 1.5,
      status: 'High',
      symptoms: 'Good soil health; potential slow decomposition',
      recommendation: 'Maintain current practices; monitor nutrient mineralization',
    },
  },

  electricalConductivity: {
    name: 'Electrical Conductivity',
    unit: 'dS/m',
    category: 'Soil Property',
    function: 'Indicates dissolved salts; affects water availability',
    low: {
      threshold: 0.5,
      status: 'Low Salinity',
      recommendation: 'Low salt content; suitable for most crops',
    },
    moderate: {
      min: 0.5,
      max: 2.0,
      status: 'Moderate Salinity',
      recommendation: 'Monitor for salt buildup; ensure adequate drainage',
    },
    high: {
      min: 2.0,
      status: 'High Salinity',
      symptoms: 'Reduced water availability, stress to sensitive crops',
      recommendation: 'Improve drainage, leach salts, choose salt-tolerant crops',
    },
  },

  moisture: {
    name: 'Soil Moisture',
    unit: '%',
    category: 'Soil Property',
    function: 'Affects root health and nutrient movement',
    low: {
      threshold: 10,
      status: 'Low Moisture',
      symptoms: 'Plant stress, reduced nutrient uptake',
      recommendation: 'Increase irrigation or improve water retention',
    },
    adequate: {
      min: 10,
      max: 25,
      status: 'Adequate Moisture',
      recommendation: 'Good moisture level for most crops; maintain',
    },
    high: {
      min: 25,
      status: 'High Moisture',
      symptoms: 'Waterlogging, reduced oxygen, potential disease',
      recommendation: 'Improve drainage; reduce irrigation',
    },
  },
};

/**
 * Get nutrient classification
 * @param {string} nutrient - Nutrient name (nitrogen, phosphorus, potassium, ph, organicCarbon, electricalConductivity, moisture)
 * @param {number} value - Nutrient value
 * @returns {Object} Classification with status and recommendations
 */
export function classifyNutrient(nutrient, value) {
  const ref = NUTRIENT_THRESHOLDS[nutrient.toLowerCase()];
  if (!ref) return { status: 'Unknown', message: 'Nutrient not found' };

  // Special handling for pH
  if (nutrient.toLowerCase() === 'ph') {
    if (value < ref.acidic.max) return { status: ref.acidic.status, ...ref.acidic };
    if (value <= ref.neutral.max) return { status: ref.neutral.status, ...ref.neutral };
    return { status: ref.alkaline.status, ...ref.alkaline };
  }

  // Special handling for other ranges
  if (nutrient.toLowerCase() === 'organicCarbon') {
    if (value < ref.low.threshold) return { status: ref.low.status, ...ref.low };
    if (value <= ref.moderate.max) return { status: ref.moderate.status, ...ref.moderate };
    return { status: ref.high.status, ...ref.high };
  }

  if (nutrient.toLowerCase() === 'electricalConductivity') {
    if (value < ref.low.threshold) return { status: ref.low.status, ...ref.low };
    if (value <= ref.moderate.max) return { status: ref.moderate.status, ...ref.moderate };
    return { status: ref.high.status, ...ref.high };
  }

  if (nutrient.toLowerCase() === 'moisture') {
    if (value < ref.low.threshold) return { status: ref.low.status, ...ref.low };
    if (value <= ref.adequate.max) return { status: ref.adequate.status, ...ref.adequate };
    return { status: ref.high.status, ...ref.high };
  }

  // NPK classification
  if (value < ref.deficiency.threshold) return { status: ref.deficiency.status, ...ref.deficiency };
  if (value <= ref.sufficient.max) return { status: ref.sufficient.status, ...ref.sufficient };
  return { status: ref.excess.status, ...ref.excess };
}

/**
 * Get all nutrient information
 * @returns {Object} Complete nutrient reference
 */
export function getAllNutrients() {
  return NUTRIENT_THRESHOLDS;
}
