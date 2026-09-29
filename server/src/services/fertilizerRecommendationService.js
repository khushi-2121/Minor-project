/**
 * Fertilizer Recommendation Service
 *
 * Analyzes soil nutrient levels and provides targeted fertilizer recommendations.
 * Considers current nutrient status, crop requirements, and sustainability.
 */

import { NUTRIENT_THRESHOLDS, classifyNutrient } from '../data/nutrientReference.js';
import {
  FERTILIZER_DATABASE,
  getFertilizersByCategory,
  getFertilizersByCrop,
} from '../data/fertilizers.js';

/**
 * Analyze nutrient deficiencies based on soil test values
 * @param {Object} soilData - Soil analysis data (N, P, K, crop, etc.)
 * @returns {Object} Nutrient analysis with deficiencies and excesses
 */
export function analyzeNutrientStatus(soilData) {
  const analysis = {
    nitrogen: {},
    phosphorus: {},
    potassium: {},
    deficiencies: [],
    excesses: [],
  };

  // Analyze Nitrogen
  const nClassification = classifyNutrient('nitrogen', soilData.nitrogen);
  analysis.nitrogen = {
    value: soilData.nitrogen,
    unit: 'mg/kg',
    ...nClassification,
  };
  if (nClassification.status === 'Deficient') {
    analysis.deficiencies.push({
      nutrient: 'Nitrogen',
      value: soilData.nitrogen,
      status: nClassification.status,
      priority: 'High',
      recommendation: nClassification.recommendation,
    });
  } else if (nClassification.status === 'Excess') {
    analysis.excesses.push({
      nutrient: 'Nitrogen',
      value: soilData.nitrogen,
      status: nClassification.status,
      caution: nClassification.caution,
    });
  }

  // Analyze Phosphorus
  const pClassification = classifyNutrient('phosphorus', soilData.phosphorus);
  analysis.phosphorus = {
    value: soilData.phosphorus,
    unit: 'mg/kg',
    ...pClassification,
  };
  if (pClassification.status === 'Deficient') {
    analysis.deficiencies.push({
      nutrient: 'Phosphorus',
      value: soilData.phosphorus,
      status: pClassification.status,
      priority: 'High',
      recommendation: pClassification.recommendation,
    });
  } else if (pClassification.status === 'Excess') {
    analysis.excesses.push({
      nutrient: 'Phosphorus',
      value: soilData.phosphorus,
      status: pClassification.status,
      caution: pClassification.caution,
    });
  }

  // Analyze Potassium
  const kClassification = classifyNutrient('potassium', soilData.potassium);
  analysis.potassium = {
    value: soilData.potassium,
    unit: 'mg/kg',
    ...kClassification,
  };
  if (kClassification.status === 'Deficient') {
    analysis.deficiencies.push({
      nutrient: 'Potassium',
      value: soilData.potassium,
      status: kClassification.status,
      priority: 'Medium',
      recommendation: kClassification.recommendation,
    });
  } else if (kClassification.status === 'Excess') {
    analysis.excesses.push({
      nutrient: 'Potassium',
      value: soilData.potassium,
      status: kClassification.status,
      caution: kClassification.caution,
    });
  }

  return analysis;
}

/**
 * Generate fertilizer recommendations based on soil analysis
 * @param {Object} soilData - Complete soil analysis data
 * @param {Object} nutrientAnalysis - Result from analyzeNutrientStatus
 * @returns {Array} Recommended fertilizers with reasoning
 */
export function generateFertilizerRecommendations(soilData, nutrientAnalysis) {
  const recommendations = [];

  // If there are critical deficiencies, prioritize addressing them
  if (nutrientAnalysis.deficiencies.length > 0) {
    // Nitrogen deficiency
    const nDeficiency = nutrientAnalysis.deficiencies.find((d) => d.nutrient === 'Nitrogen');
    if (nDeficiency) {
      const nFertilizers = getFertilizersByCategory('Nitrogen Fertilizer');
      nFertilizers.forEach((fert) => {
        recommendations.push({
          fertilizerId: fert.id,
          fertilizer: fert.name,
          category: fert.category,
          type: fert.type,
          reason: 'Your soil is deficient in nitrogen. This fertilizer provides concentrated nitrogen for growth.',
          priority: 'High',
          nutrients: fert.composition,
          applicationGuidance: fert.applicationGuidance,
          organicAlternative: fert.organicAlternative,
          composition: `N: ${fert.composition.nitrogen}%, P: ${fert.composition.phosphorus}%, K: ${fert.composition.potassium}%`,
        });
      });
    }

    // Phosphorus deficiency
    const pDeficiency = nutrientAnalysis.deficiencies.find((d) => d.nutrient === 'Phosphorus');
    if (pDeficiency) {
      const pFertilizers = getFertilizersByCategory('Phosphorus Fertilizer');
      pFertilizers.forEach((fert) => {
        recommendations.push({
          fertilizerId: fert.id,
          fertilizer: fert.name,
          category: fert.category,
          type: fert.type,
          reason: 'Your soil is deficient in phosphorus. This fertilizer supports root development and energy transfer.',
          priority: 'High',
          nutrients: fert.composition,
          applicationGuidance: fert.applicationGuidance,
          organicAlternative: fert.organicAlternative,
          composition: `N: ${fert.composition.nitrogen}%, P: ${fert.composition.phosphorus}%, K: ${fert.composition.potassium}%`,
        });
      });
    }

    // Potassium deficiency
    const kDeficiency = nutrientAnalysis.deficiencies.find((d) => d.nutrient === 'Potassium');
    if (kDeficiency) {
      const kFertilizers = getFertilizersByCategory('Potassium Fertilizer');
      kFertilizers.forEach((fert) => {
        recommendations.push({
          fertilizerId: fert.id,
          fertilizer: fert.name,
          category: fert.category,
          type: fert.type,
          reason: 'Your soil is deficient in potassium. This fertilizer improves plant strength and stress tolerance.',
          priority: 'Medium',
          nutrients: fert.composition,
          applicationGuidance: fert.applicationGuidance,
          organicAlternative: fert.organicAlternative,
          composition: `N: ${fert.composition.nitrogen}%, P: ${fert.composition.phosphorus}%, K: ${fert.composition.potassium}%`,
        });
      });
    }
  }

  // If all NPK are sufficient, recommend balanced fertilizer for maintenance
  if (
    nutrientAnalysis.nitrogen.status === 'Sufficient' &&
    nutrientAnalysis.phosphorus.status === 'Sufficient' &&
    nutrientAnalysis.potassium.status === 'Sufficient' &&
    nutrientAnalysis.deficiencies.length === 0
  ) {
    const balancedFertilizers = [
      FERTILIZER_DATABASE.find((f) => f.id === 'npk_1010'),
      FERTILIZER_DATABASE.find((f) => f.id === 'farmyard_manure'),
      FERTILIZER_DATABASE.find((f) => f.id === 'compost'),
    ].filter(Boolean);

    balancedFertilizers.forEach((fert) => {
      recommendations.push({
        fertilizerId: fert.id,
        fertilizer: fert.name,
        category: fert.category,
        type: fert.type,
        reason: 'Your soil has balanced nutrients. Use this for maintenance and sustainable farming.',
        priority: 'Medium',
        nutrients: fert.composition,
        applicationGuidance: fert.applicationGuidance,
        organicAlternative: fert.organicAlternative,
        composition: `N: ${fert.composition.nitrogen}%, P: ${fert.composition.phosphorus}%, K: ${fert.composition.potassium}%`,
      });
    });
  }

  // Recommend organic alternatives if applicable
  if (soilData.crop) {
    const cropSpecificFertilizers = getFertilizersByCrop(soilData.crop);
    cropSpecificFertilizers.forEach((fert) => {
      if (fert.type === 'Organic' && !recommendations.find((r) => r.fertilizerId === fert.id)) {
        recommendations.push({
          fertilizerId: fert.id,
          fertilizer: fert.name,
          category: fert.category,
          type: fert.type,
          reason: `Organic option suitable for ${soilData.crop}. Improves soil health and sustainability.`,
          priority: 'Low',
          nutrients: fert.composition,
          applicationGuidance: fert.applicationGuidance,
          organicAlternative: fert.organicAlternative,
          composition: `N: ${fert.composition.nitrogen}%, P: ${fert.composition.phosphorus}%, K: ${fert.composition.potassium}%`,
        });
      }
    });
  }

  // Sort by priority
  recommendations.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return recommendations;
}

/**
 * Generate complete fertilizer recommendation response
 * @param {Object} analysis - Complete soil analysis object
 * @returns {Object} Structured recommendation response
 */
export function getFertilizerRecommendations(analysis) {
  const nutrientAnalysis = analyzeNutrientStatus({
    nitrogen: analysis.nitrogen,
    phosphorus: analysis.phosphorus,
    potassium: analysis.potassium,
    crop: analysis.crop,
    soilType: analysis.soilType,
  });

  const recommendations = generateFertilizerRecommendations(analysis, nutrientAnalysis);

  return {
    success: true,
    analysisId: analysis._id,
    soilContext: {
      soilType: analysis.soilType,
      crop: analysis.crop,
      location: analysis.location,
      nitrogen: analysis.nitrogen,
      phosphorus: analysis.phosphorus,
      potassium: analysis.potassium,
      ph: analysis.ph,
      moisture: analysis.moisture,
      organicCarbon: analysis.organicCarbon,
      electricalConductivity: analysis.electricalConductivity,
      fertilityLevel: analysis.prediction?.fertilityLevel || 'Not analyzed',
    },
    nutrientAnalysis,
    recommendations,
    disclaimer:
      'These recommendations are AI-assisted guidance based on your soil test results. Always verify with local agricultural recommendations or consult a qualified agronomist before fertilizer application. Dosages and application methods should be determined by local experts based on specific regional conditions.',
  };
}
