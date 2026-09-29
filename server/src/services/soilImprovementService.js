/**
 * Soil Improvement Service
 *
 * Analyzes soil conditions and recommends targeted improvements
 * for sustainable and productive soil management.
 */

import { NUTRIENT_THRESHOLDS, classifyNutrient } from '../data/nutrientReference.js';
import { FERTILIZER_DATABASE } from '../data/fertilizers.js';

/**
 * Generate soil improvement recommendations
 * @param {Object} analysis - Complete soil analysis object
 * @returns {Object} Structured soil improvement response
 */
export function getSoilImprovementRecommendations(analysis) {
  const improvements = {
    nutrientManagement: generateNutrientManagementPlan(analysis),
    phManagement: generatePhManagementPlan(analysis),
    organicMatter: generateOrganicMatterPlan(analysis),
    waterManagement: generateWaterManagementPlan(analysis),
    sustainablePractices: generateSustainablePractices(analysis),
  };

  return {
    success: true,
    analysisId: analysis._id,
    soilContext: {
      soilType: analysis.soilType,
      location: analysis.location,
      crop: analysis.crop,
      nitrogen: analysis.nitrogen,
      phosphorus: analysis.phosphorus,
      potassium: analysis.potassium,
      ph: analysis.ph,
      moisture: analysis.moisture,
      organicCarbon: analysis.organicCarbon,
      electricalConductivity: analysis.electricalConductivity,
      fertilityLevel: analysis.prediction?.fertilityLevel || 'Not analyzed',
    },
    improvementPlan: improvements,
    priority:
      'Focus on addressing deficiencies first, then work on building long-term soil health through organic matter and sustainable practices.',
    implementation: {
      immediate: 'Address critical nutrient deficiencies with targeted fertilizers (1-2 months)',
      shortTerm: 'Implement pH corrections and increase organic matter (3-6 months)',
      longTerm: 'Build sustainable soil health through rotation, cover crops, and minimal tillage (6-12 months)',
    },
    disclaimer:
      'These recommendations are based on soil test results. Consult with local agricultural experts before implementing changes. Results may vary based on climate, water availability, and management practices.',
  };
}

/**
 * Generate nutrient management recommendations
 */
function generateNutrientManagementPlan(analysis) {
  const plan = {
    section: 'Nutrient Management',
    description: 'Address nutrient imbalances to optimize crop production and soil health',
    recommendations: [],
  };

  // Nitrogen management
  const nStatus = classifyNutrient('nitrogen', analysis.nitrogen);
  plan.recommendations.push({
    nutrient: 'Nitrogen',
    current: `${analysis.nitrogen} mg/kg`,
    status: nStatus.status,
    issue: generateNutrientIssue(nStatus.status),
    actions: generateNitrogenActions(analysis, nStatus.status),
    priority: nStatus.status === 'Deficient' ? 'High' : 'Medium',
  });

  // Phosphorus management
  const pStatus = classifyNutrient('phosphorus', analysis.phosphorus);
  plan.recommendations.push({
    nutrient: 'Phosphorus',
    current: `${analysis.phosphorus} mg/kg`,
    status: pStatus.status,
    issue: generateNutrientIssue(pStatus.status),
    actions: generatePhosphorusActions(analysis, pStatus.status),
    priority: pStatus.status === 'Deficient' ? 'High' : 'Medium',
  });

  // Potassium management
  const kStatus = classifyNutrient('potassium', analysis.potassium);
  plan.recommendations.push({
    nutrient: 'Potassium',
    current: `${analysis.potassium} mg/kg`,
    status: kStatus.status,
    issue: generateNutrientIssue(kStatus.status),
    actions: generatePotassiumActions(analysis, kStatus.status),
    priority: kStatus.status === 'Deficient' ? 'High' : 'Medium',
  });

  return plan;
}

/**
 * Generate issue description based on nutrient status
 */
function generateNutrientIssue(status) {
  const issueMap = {
    Deficient: 'Soil lacks this nutrient; crops may show deficiency symptoms',
    Sufficient: 'Nutrient level is adequate for crop growth',
    Excess: 'Nutrient level is high; excess may interfere with other nutrients or cause environmental issues',
  };
  return issueMap[status] || 'Status unknown';
}

/**
 * Generate nitrogen-specific actions
 */
function generateNitrogenActions(analysis, status) {
  if (status === 'Deficient') {
    return [
      'Apply nitrogen-rich fertilizer (Urea recommended) before crop planting',
      'Consider split application for better nutrient use efficiency',
      'Incorporate crop residues to increase nitrogen cycling',
      'Consider nitrogen-fixing cover crops in rotation',
    ];
  } else if (status === 'Excess') {
    return [
      'Avoid additional nitrogen fertilizer application',
      'Focus on balancing with phosphorus and potassium',
      'Use phosphate-rich fertilizers to improve N:P ratio',
      'Consider legume crops to reduce nitrogen application',
    ];
  }
  return ['Maintain current nitrogen management practices', 'Monitor soil nitrogen levels annually'];
}

/**
 * Generate phosphorus-specific actions
 */
function generatePhosphorusActions(analysis, status) {
  if (status === 'Deficient') {
    return [
      'Apply phosphate fertilizer (DAP or Single Superphosphate recommended)',
      'Phosphorus moves slowly in soil; ensure good incorporation',
      'Consider rock phosphate for long-term phosphorus availability',
      'Maintain adequate organic matter to improve phosphorus availability',
    ];
  } else if (status === 'Excess') {
    return [
      'Limit phosphate fertilizer application',
      'Focus on potassium and nitrogen balance',
      'Avoid high-phosphorus fertilizers',
      'Monitor water runoff to prevent environmental impact',
    ];
  }
  return ['Maintain current phosphorus levels', 'Apply phosphate only as needed based on crop requirements'];
}

/**
 * Generate potassium-specific actions
 */
function generatePotassiumActions(analysis, status) {
  if (status === 'Deficient') {
    return [
      'Apply potassium fertilizer (Muriate of Potash or Sulphate of Potash)',
      'Increase organic matter through compost and manure to improve K availability',
      'Consider wood ash as an organic K source',
      'Potassium is more available in warm, moist soils',
    ];
  } else if (status === 'Excess') {
    return [
      'Avoid additional potassium fertilizer',
      'Balance with calcium and magnesium',
      'Monitor soil K levels; consider crop removal reducing excess K',
      'Reduce fertilizer application over time',
    ];
  }
  return ['Maintain current potassium levels', 'Apply potassium based on crop requirements and soil testing'];
}

/**
 * Generate pH management plan
 */
function generatePhManagementPlan(analysis) {
  const phStatus = classifyNutrient('ph', analysis.ph);
  const plan = {
    section: 'pH Management',
    description: 'Adjust soil pH to optimize nutrient availability and microbial activity',
    current: `pH ${analysis.ph}`,
    status: phStatus.status,
    recommendations: [],
  };

  if (analysis.ph < 6.0) {
    plan.recommendations.push(
      {
        action: 'Apply agricultural lime (limestone)',
        timing: '2-3 months before planting',
        benefit: 'Raises pH and provides calcium',
        precaution: 'Do not over-lime; follow soil pH buffer test recommendations',
        rate: 'Consult extension services for precise rate based on buffer capacity',
      },
      {
        action: 'Reduce tillage to minimize organic matter loss',
        timing: 'Ongoing',
        benefit: 'Maintains pH-buffering organic matter',
      },
      {
        action: 'Incorporate organic matter (compost, manure)',
        timing: 'Annually',
        benefit: 'Improves soil buffering capacity and nutrient cycling',
      }
    );
  } else if (analysis.ph > 7.5) {
    plan.recommendations.push(
      {
        action: 'Apply sulfur or sulfur-containing materials',
        timing: '3-6 months before planting',
        benefit: 'Gradually lowers pH',
        precaution: 'Slow acting; requires time for microbial oxidation',
        rate: 'Consult extension services for exact rate',
      },
      {
        action: 'Increase organic matter to buffer high pH',
        timing: 'Annually',
        benefit: 'Helps reduce extreme alkalinity',
      },
      {
        action: 'Consider chelated micronutrients for high pH',
        timing: 'If micronutrient deficiency observed',
        benefit: 'Alleviates iron, zinc, and other micronutrient deficiencies',
      }
    );
  } else {
    plan.recommendations.push({
      action: 'Maintain current pH through organic matter management',
      timing: 'Ongoing',
      benefit: 'pH is in optimal range; focus on maintaining it',
    });
  }

  return plan;
}

/**
 * Generate organic matter / soil structure plan
 */
function generateOrganicMatterPlan(analysis) {
  const ocStatus = classifyNutrient('organicCarbon', analysis.organicCarbon);
  const plan = {
    section: 'Organic Matter & Soil Structure',
    description: 'Build long-term soil health through organic matter management',
    current: `${analysis.organicCarbon}% organic carbon`,
    status: ocStatus.status,
    recommendations: [],
  };

  if (analysis.organicCarbon < 0.8) {
    plan.recommendations.push(
      {
        action: 'Increase compost/farmyard manure application',
        rate: '5-10 tons/hectare annually',
        benefit: 'Builds soil structure, water retention, and biological activity',
        timing: 'Before planting or incorporated during off-season',
      },
      {
        action: 'Incorporate crop residues instead of burning',
        benefit: 'Increases organic carbon and nutrient cycling',
        timing: 'After harvest',
      },
      {
        action: 'Use cover crops or green manure',
        benefit: 'Adds organic matter and nitrogen when incorporated',
        timing: 'Between main crops',
      },
      {
        action: 'Reduce or eliminate tillage',
        benefit: 'Preserves existing soil organic matter',
        timing: 'Ongoing management practice',
      }
    );
  } else if (analysis.organicCarbon > 1.5) {
    plan.recommendations.push({
      action: 'Maintain current organic matter levels',
      benefit: 'Good soil health; focus on stabilizing current levels',
      timing: 'Regular organic matter inputs',
    });
  } else {
    plan.recommendations.push({
      action: 'Continue improving organic matter steadily',
      rate: '3-5 tons/hectare annually',
      benefit: 'Optimal levels; maintain and gradually improve',
      timing: 'Ongoing practice',
    });
  }

  return plan;
}

/**
 * Generate water management plan
 */
function generateWaterManagementPlan(analysis) {
  const moistureStatus = classifyNutrient('moisture', analysis.moisture);
  const plan = {
    section: 'Water Management',
    description: 'Optimize water availability and drainage for crop health',
    current: `${analysis.moisture}% moisture`,
    status: moistureStatus.status,
    recommendations: [],
  };

  if (analysis.moisture < 10) {
    plan.recommendations.push(
      {
        action: 'Increase irrigation frequency',
        benefit: 'Ensures adequate water for crop growth',
      },
      {
        action: 'Mulch fields to retain soil moisture',
        benefit: 'Reduces evaporation and regulates soil temperature',
      },
      {
        action: 'Increase organic matter to improve water holding capacity',
        benefit: 'Sandy soils particularly benefit from increased compost/manure',
      },
      {
        action: 'Consider drip irrigation for water efficiency',
        benefit: 'Reduces water usage while maintaining soil moisture',
      }
    );
  } else if (analysis.moisture > 25) {
    plan.recommendations.push(
      {
        action: 'Improve soil drainage',
        benefit: 'Prevents waterlogging and root diseases',
      },
      {
        action: 'Reduce irrigation frequency',
        benefit: 'Allows soil to dry slightly between waterings',
      },
      {
        action: 'Add sand and organic matter to improve soil structure',
        benefit: 'Improves water drainage while maintaining fertility',
      },
      {
        action: 'Consider raised beds in severely waterlogged areas',
        benefit: 'Provides well-drained rooting zone',
      }
    );
  } else {
    plan.recommendations.push({
      action: 'Maintain current watering practices',
      benefit: 'Moisture levels are adequate; monitor based on crop needs',
    });
  }

  return plan;
}

/**
 * Generate sustainable farming practices
 */
function generateSustainablePractices(analysis) {
  return {
    section: 'Sustainable Farming Practices',
    description: 'Long-term strategies for soil health and farm sustainability',
    practices: [
      {
        name: 'Crop Rotation',
        benefit: 'Breaks pest cycles, improves soil structure, reduces fertilizer need',
        implementation: 'Rotate different crop families annually or bi-annually',
        impact: 'High',
      },
      {
        name: 'Reduced Tillage / No-Tillage',
        benefit: 'Preserves soil structure, reduces erosion, maintains organic matter',
        implementation: 'Minimize soil disturbance; use direct seeding where possible',
        impact: 'High',
      },
      {
        name: 'Cover Cropping',
        benefit: 'Adds organic matter, fixes nitrogen, prevents erosion',
        implementation: 'Plant legumes or grass between main crops',
        impact: 'Medium',
      },
      {
        name: 'Integrated Pest Management',
        benefit: 'Reduces chemical use, maintains soil biology',
        implementation: 'Use biological controls, resistant varieties, targeted applications',
        impact: 'Medium',
      },
      {
        name: 'Mulching',
        benefit: 'Reduces weed pressure, retains moisture, adds organic matter',
        implementation: 'Apply crop residue, compost, or plastic mulch',
        impact: 'Medium',
      },
      {
        name: 'Balanced Nutrient Management',
        benefit: 'Reduces over-application, improves efficiency, protects environment',
        implementation: 'Use soil testing to guide fertilizer application',
        impact: 'High',
      },
      {
        name: 'Organic Matter Management',
        benefit: 'Builds soil carbon, improves structure, increases water retention',
        implementation: 'Apply compost, manure, green manure annually',
        impact: 'High',
      },
      {
        name: 'Water Harvesting',
        benefit: 'Reduces irrigation dependency, improves water use efficiency',
        implementation: 'Collect rainfall, use drip irrigation, improve soil water retention',
        impact: 'Medium',
      },
    ],
  };
}
