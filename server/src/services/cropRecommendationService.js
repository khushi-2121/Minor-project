/**
 * Crop Recommendation Service
 *
 * Analyzes soil conditions and recommends suitable crops based on
 * soil type, pH, nutrient levels, moisture, salinity, and other factors.
 */

import { getAllCrops, getCropById } from '../data/crops.js';
import { classifyNutrient } from '../data/nutrientReference.js';

/**
 * Calculate crop suitability score based on soil conditions
 * @param {Object} crop - Crop database object
 * @param {Object} soilData - User's soil analysis data
 * @returns {number} Compatibility score (0-100)
 */
function calculateCompatibilityScore(crop, soilData) {
  let score = 0;
  const weights = {
    soilType: 20,
    ph: 20,
    nitrogen: 15,
    phosphorus: 15,
    potassium: 15,
    moisture: 10,
    ec: 5,
  };

  // Soil type compatibility
  if (crop.suitableSoilTypes.includes(soilData.soilType)) {
    score += weights.soilType;
  } else {
    score += weights.soilType * 0.5; // Partial compatibility
  }

  // pH compatibility
  const phDiff = Math.min(
    Math.abs(soilData.ph - crop.phRequirements.min),
    Math.abs(soilData.ph - crop.phRequirements.max),
    Math.abs(soilData.ph - crop.phRequirements.ideal)
  );
  const phScore = Math.max(0, 100 - phDiff * 10); // Decrease by 10 per unit difference
  score += (phScore / 100) * weights.ph;

  // Nitrogen compatibility
  const nReq = crop.nutrientRequirements.nitrogen;
  if (soilData.nitrogen >= nReq.min && soilData.nitrogen <= nReq.max) {
    score += weights.nitrogen;
  } else if (soilData.nitrogen >= nReq.min * 0.8 && soilData.nitrogen <= nReq.max * 1.2) {
    score += weights.nitrogen * 0.7; // Marginal
  } else {
    score += weights.nitrogen * 0.3; // Poor
  }

  // Phosphorus compatibility
  const pReq = crop.nutrientRequirements.phosphorus;
  if (soilData.phosphorus >= pReq.min && soilData.phosphorus <= pReq.max) {
    score += weights.phosphorus;
  } else if (soilData.phosphorus >= pReq.min * 0.8 && soilData.phosphorus <= pReq.max * 1.2) {
    score += weights.phosphorus * 0.7;
  } else {
    score += weights.phosphorus * 0.3;
  }

  // Potassium compatibility
  const kReq = crop.nutrientRequirements.potassium;
  if (soilData.potassium >= kReq.min && soilData.potassium <= kReq.max) {
    score += weights.potassium;
  } else if (soilData.potassium >= kReq.min * 0.8 && soilData.potassium <= kReq.max * 1.2) {
    score += weights.potassium * 0.7;
  } else {
    score += weights.potassium * 0.3;
  }

  // Moisture compatibility (simple check)
  const moistureMin = crop.moisturePreference.includes('Low') ? 5 : crop.moisturePreference.includes('High') ? 20 : 12;
  const moistureMax = crop.moisturePreference.includes('Low') ? 15 : crop.moisturePreference.includes('High') ? 30 : 20;
  if (soilData.moisture >= moistureMin && soilData.moisture <= moistureMax) {
    score += weights.moisture;
  } else {
    score += weights.moisture * 0.4;
  }

  // EC (Salinity) compatibility (simple check)
  if (crop.salinityTolerance.includes('High')) {
    score += weights.ec; // Tolerates high EC
  } else if (crop.salinityTolerance.includes('Moderate') && soilData.electricalConductivity <= 2.0) {
    score += weights.ec;
  } else if (crop.salinityTolerance.includes('Low') && soilData.electricalConductivity <= 1.0) {
    score += weights.ec;
  } else {
    score += weights.ec * 0.3;
  }

  return Math.round(score);
}

/**
 * Identify limiting factors for crop cultivation
 * @param {Object} crop - Crop database object
 * @param {Object} soilData - User's soil analysis data
 * @returns {Array} Array of limitation objects
 */
function identifyLimitations(crop, soilData) {
  const limitations = [];

  // Check soil type
  if (!crop.suitableSoilTypes.includes(soilData.soilType)) {
    limitations.push({
      factor: 'Soil Type',
      current: soilData.soilType,
      recommended: crop.suitableSoilTypes.join(', '),
      severity: 'Moderate',
      suggestion: `This crop prefers ${crop.suitableSoilTypes.join(' or ')}. Your ${soilData.soilType} soil may require soil conditioning.`,
    });
  }

  // Check pH
  if (soilData.ph < crop.phRequirements.min || soilData.ph > crop.phRequirements.max) {
    const phRecommendation = soilData.ph < crop.phRequirements.min ? 'Raise pH with lime' : 'Lower pH with sulfur';
    limitations.push({
      factor: 'pH Level',
      current: soilData.ph,
      recommended: `${crop.phRequirements.min} - ${crop.phRequirements.max}`,
      severity: 'High',
      suggestion: `Your soil pH is outside the optimal range. ${phRecommendation} if cultivating this crop.`,
    });
  }

  // Check Nitrogen
  const nReq = crop.nutrientRequirements.nitrogen;
  if (soilData.nitrogen < nReq.min) {
    limitations.push({
      factor: 'Nitrogen',
      current: soilData.nitrogen,
      recommended: `${nReq.min} - ${nReq.max} mg/kg`,
      severity: 'High',
      suggestion: `Nitrogen is deficient for this crop. Apply nitrogen-rich fertilizer before planting.`,
    });
  }

  // Check Phosphorus
  const pReq = crop.nutrientRequirements.phosphorus;
  if (soilData.phosphorus < pReq.min) {
    limitations.push({
      factor: 'Phosphorus',
      current: soilData.phosphorus,
      recommended: `${pReq.min} - ${pReq.max} mg/kg`,
      severity: 'High',
      suggestion: `Phosphorus is deficient for this crop. Apply phosphate fertilizer before planting.`,
    });
  }

  // Check Potassium
  const kReq = crop.nutrientRequirements.potassium;
  if (soilData.potassium < kReq.min) {
    limitations.push({
      factor: 'Potassium',
      current: soilData.potassium,
      recommended: `${kReq.min} - ${kReq.max} mg/kg`,
      severity: 'Medium',
      suggestion: `Potassium is slightly low for this crop. Consider applying potassium fertilizer.`,
    });
  }

  // Check Moisture
  const moistureMin = crop.moisturePreference.includes('Low') ? 5 : crop.moisturePreference.includes('High') ? 20 : 12;
  const moistureMax = crop.moisturePreference.includes('Low') ? 15 : crop.moisturePreference.includes('High') ? 30 : 20;
  if (soilData.moisture < moistureMin || soilData.moisture > moistureMax) {
    const action =
      soilData.moisture < moistureMin ? 'Increase irrigation or improve water retention' : 'Improve drainage';
    limitations.push({
      factor: 'Moisture',
      current: soilData.moisture,
      recommended: `${moistureMin} - ${moistureMax}%`,
      severity: 'Medium',
      suggestion: `Current moisture is outside optimal range. ${action}.`,
    });
  }

  // Check Salinity (EC)
  const ecLimit = crop.salinityTolerance.includes('Low') ? 1.0 : crop.salinityTolerance.includes('Moderate') ? 2.0 : 4.0;
  if (soilData.electricalConductivity > ecLimit) {
    limitations.push({
      factor: 'Electrical Conductivity (Salinity)',
      current: soilData.electricalConductivity,
      recommended: `< ${ecLimit} dS/m`,
      severity: 'Medium',
      suggestion: `Soil has high salt content. Improve drainage and leach salts if cultivating this crop.`,
    });
  }

  return limitations;
}

/**
 * Generate crop recommendations based on soil analysis
 * @param {Object} analysis - Complete soil analysis object
 * @returns {Object} Structured crop recommendation response
 */
export function getCropRecommendations(analysis) {
  const allCrops = getAllCrops();

  // Calculate compatibility scores for all crops
  const cropScores = allCrops
    .map((crop) => {
      const score = calculateCompatibilityScore(crop, {
        soilType: analysis.soilType,
        ph: analysis.ph,
        nitrogen: analysis.nitrogen,
        phosphorus: analysis.phosphorus,
        potassium: analysis.potassium,
        moisture: analysis.moisture,
        electricalConductivity: analysis.electricalConductivity,
      });

      return {
        ...crop,
        compatibilityScore: score,
        limitations: identifyLimitations(crop, {
          soilType: analysis.soilType,
          ph: analysis.ph,
          nitrogen: analysis.nitrogen,
          phosphorus: analysis.phosphorus,
          potassium: analysis.potassium,
          moisture: analysis.moisture,
          electricalConductivity: analysis.electricalConductivity,
        }),
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Categorize by compatibility level
  const bestMatches = cropScores.filter((c) => c.compatibilityScore >= 75);
  const goodMatches = cropScores.filter((c) => c.compatibilityScore >= 60 && c.compatibilityScore < 75);
  const moderateMatches = cropScores.filter((c) => c.compatibilityScore < 60);

  return {
    success: true,
    analysisId: analysis._id,
    soilContext: {
      soilType: analysis.soilType,
      location: analysis.location,
      currentCrop: analysis.crop,
      nitrogen: analysis.nitrogen,
      phosphorus: analysis.phosphorus,
      potassium: analysis.potassium,
      ph: analysis.ph,
      moisture: analysis.moisture,
      organicCarbon: analysis.organicCarbon,
      electricalConductivity: analysis.electricalConductivity,
    },
    cropRecommendations: {
      bestMatches: bestMatches.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        season: c.season,
        compatibilityScore: c.compatibilityScore,
        reason: `Excellent match for your soil conditions. Score: ${c.compatibilityScore}/100`,
        suitableSoilTypes: c.suitableSoilTypes,
        phRequirements: c.phRequirements,
        nutrientRequirements: c.nutrientRequirements,
        waterRequirement: c.waterRequirement,
        yieldPotential: c.yieldPotential,
        advantages: c.advantages,
        limitations: c.limitations,
      })),
      goodMatches: goodMatches.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        season: c.season,
        compatibilityScore: c.compatibilityScore,
        reason: `Good match with some considerations. Score: ${c.compatibilityScore}/100`,
        suitableSoilTypes: c.suitableSoilTypes,
        phRequirements: c.phRequirements,
        nutrientRequirements: c.nutrientRequirements,
        waterRequirement: c.waterRequirement,
        yieldPotential: c.yieldPotential,
        advantages: c.advantages,
        limitations: c.limitations,
      })),
      moderateMatches: moderateMatches.slice(0, 3).map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        season: c.season,
        compatibilityScore: c.compatibilityScore,
        reason: `Moderate match; requires soil amendments. Score: ${c.compatibilityScore}/100`,
        suitableSoilTypes: c.suitableSoilTypes,
        phRequirements: c.phRequirements,
        nutrientRequirements: c.nutrientRequirements,
        waterRequirement: c.waterRequirement,
        yieldPotential: c.yieldPotential,
        advantages: c.advantages,
        limitations: c.limitations,
      })),
    },
    scoringMethodology:
      'Compatibility scores are calculated based on soil type match (20%), pH compatibility (20%), NPK levels (45%), moisture (10%), and salinity tolerance (5%). Scores range from 0-100, with higher scores indicating better suitability.',
    note: 'These recommendations should be verified with local agricultural experts. Regional climate, water availability, market demand, and other factors also influence crop selection.',
  };
}
