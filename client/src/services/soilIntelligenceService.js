import { soilAnalysisService } from './soilAnalysisService';

const RANGE_LOOKUP = {
  nitrogen: { label: 'Nitrogen', unit: 'mg/kg', idealMin: 20, idealMax: 60, low: 20, high: 100 },
  phosphorus: { label: 'Phosphorus', unit: 'mg/kg', idealMin: 10, idealMax: 25, low: 10, high: 60 },
  potassium: { label: 'Potassium', unit: 'mg/kg', idealMin: 100, idealMax: 250, low: 100, high: 400 },
  ph: { label: 'pH', unit: '', idealMin: 6.0, idealMax: 7.5, low: 6.0, high: 8.5 },
  moisture: { label: 'Moisture', unit: '%', idealMin: 12, idealMax: 25, low: 12, high: 35 },
  organicCarbon: { label: 'Organic carbon', unit: '%', idealMin: 0.8, idealMax: 1.5, low: 0.8, high: 2.5 },
  electricalConductivity: { label: 'Electrical conductivity', unit: 'dS/m', idealMin: 0.5, idealMax: 2.0, low: 0.5, high: 4.0 },
};

const statusMeta = {
  Low: { tone: 'text-red-700 bg-red-50 border-red-200', bar: '#ef4444' },
  Optimal: { tone: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: '#10b981' },
  High: { tone: 'text-amber-700 bg-amber-50 border-amber-200', bar: '#f59e0b' },
  Warning: { tone: 'text-orange-700 bg-orange-50 border-orange-200', bar: '#f97316' },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getMetricStatus(metric, value) {
  const config = RANGE_LOOKUP[metric];
  if (!config) {
    return {
      label: 'Unknown',
      score: 0,
      explanation: 'No reference range available.',
      status: 'Warning',
    };
  }

  const { idealMin, idealMax, low, high } = config;

  if (metric === 'ph') {
    if (value >= idealMin && value <= idealMax) {
      return {
        label: 'Optimal',
        score: 100,
        explanation: 'pH is within the general neutral-to-slightly-alkaline range that supports nutrient availability for many crops.',
        status: 'Optimal',
      };
    }

    if (value < idealMin) {
      const score = clamp(Math.round(((value / idealMin) * 100) * 0.9), 15, 80);
      return {
        label: 'Low',
        score,
        explanation: 'pH is below the usual agronomic target range, which may reduce nutrient availability and affect root activity.',
        status: 'Low',
      };
    }

    const score = clamp(Math.round((1 - (value - idealMax) / (high - idealMax)) * 100), 20, 85);
    return {
      label: 'High',
      score,
      explanation: 'pH is above the usual agronomic target range, which may limit the availability of some nutrients and require management.',
      status: 'High',
    };
  }

  if (value >= idealMin && value <= idealMax) {
    return {
      label: 'Optimal',
      score: 100,
      explanation: `${config.label} is within the commonly used agronomic target range for many field conditions.`,
      status: 'Optimal',
    };
  }

  if (value < low) {
    const score = clamp(Math.round((value / low) * 100), 15, 80);
    return {
      label: 'Low',
      score,
      explanation: `${config.label} is below the commonly used agronomic range and may indicate a deficiency risk when crop demand is high.`,
      status: 'Low',
    };
  }

  if (value > high) {
    const score = clamp(Math.round((1 - (value - high) / Math.max(high, 1)) * 100), 25, 80);
    return {
      label: 'High',
      score,
      explanation: `${config.label} is above the commonly used agronomic range and may require adjustment to avoid imbalance or excess effects.`,
      status: 'High',
    };
  }

  const score = clamp(Math.round((1 - Math.abs(value - idealMin) / Math.max(idealMax - idealMin, 1)) * 100), 45, 90);
  return {
    label: 'Warning',
    score,
    explanation: `${config.label} is outside the ideal agronomic band but still within the broader monitoring range; continued observation is recommended.`,
    status: 'Warning',
  };
}

function scoreMetric(metric, value) {
  const result = getMetricStatus(metric, value);
  return {
    ...result,
    value,
    metric,
    label: result.label,
    unit: RANGE_LOOKUP[metric]?.unit || '',
  };
}

export function buildSoilIntelligenceData(analysis) {
  if (!analysis) {
    return null;
  }

  const metrics = [
    scoreMetric('nitrogen', Number(analysis.nitrogen)),
    scoreMetric('phosphorus', Number(analysis.phosphorus)),
    scoreMetric('potassium', Number(analysis.potassium)),
    scoreMetric('ph', Number(analysis.ph)),
    scoreMetric('moisture', Number(analysis.moisture)),
    scoreMetric('organicCarbon', Number(analysis.organicCarbon)),
    scoreMetric('electricalConductivity', Number(analysis.electricalConductivity)),
  ];

  const weightedScore = Math.round(
    metrics.reduce((total, metric) => total + metric.score, 0) / metrics.length
  );

  const riskAlerts = [];

  if (analysis.ph < 6.0 || analysis.ph > 7.5) {
    riskAlerts.push({
      severity: 'Medium',
      title: 'pH outside ideal range',
      detail: `Current pH is ${analysis.ph}. Value is outside the general agronomic target range and may influence nutrient availability.`,
    });
  }

  if (analysis.moisture < 12 || analysis.moisture > 25) {
    riskAlerts.push({
      severity: 'Medium',
      title: 'Moisture imbalance',
      detail: `Current soil moisture is ${analysis.moisture}%. This may indicate excess dryness or waterlogging depending on crop and season.`,
    });
  }

  if (analysis.organicCarbon < 0.8) {
    riskAlerts.push({
      severity: 'Medium',
      title: 'Low organic carbon',
      detail: `Organic carbon is ${analysis.organicCarbon}%. Low levels may reduce soil structure and biological activity over time.`,
    });
  }

  if (analysis.electricalConductivity > 2.0) {
    riskAlerts.push({
      severity: 'High',
      title: 'Salinity risk',
      detail: `Electrical conductivity is ${analysis.electricalConductivity} dS/m, which is above the common moderate range for many crops.`,
    });
  }

  if (analysis.nitrogen < 20 || analysis.phosphorus < 10 || analysis.potassium < 100) {
    riskAlerts.push({
      severity: 'High',
      title: 'Nutrient deficiency risk',
      detail: 'One or more major nutrients are below the commonly used agronomic reference range for many field crops.',
    });
  }

  if (analysis.prediction?.fertilityLevel === 'Low') {
    riskAlerts.push({
      severity: 'High',
      title: 'ML fertility warning',
      detail: 'The model classified the soil as Low fertility. This should be reviewed with the associated soil analysis and agronomic context.',
    });
  }

  const soilHealthLabel =
    weightedScore >= 80 ? 'Healthy' : weightedScore >= 60 ? 'Moderate' : weightedScore >= 40 ? 'Needs attention' : 'Critical';

  return {
    analysisId: analysis._id,
    soilType: analysis.soilType,
    location: analysis.location,
    crop: analysis.crop,
    status: analysis.status,
    recordDate: analysis.createdAt,
    soilHealthScore: weightedScore,
    soilHealthLabel,
    metrics,
    riskAlerts,
    fertilityLevel: analysis.prediction?.fertilityLevel || 'Not available',
    confidence: analysis.prediction?.confidence ? Math.round(analysis.prediction.confidence * 100) : null,
    explanation:
      'Soil health score is calculated from measurable agronomic indicators using a weighted general assessment. It is intended for monitoring and planning, not a substitute for a formal laboratory report or local field agronomy advice.',
  };
}

export async function getLatestSoilIntelligenceForUser() {
  try {
    const response = await soilAnalysisService.getAnalyses();
    const analyses = response?.analyses || [];

    const latestAnalyzed = analyses.find((analysis) => analysis.status === 'analyzed') || analyses[0] || null;

    if (!latestAnalyzed) {
      return {
        success: false,
        message: 'No soil analysis found for this user.',
      };
    }

    const intelligence = buildSoilIntelligenceData(latestAnalyzed);

    return {
      success: true,
      analysis: latestAnalyzed,
      intelligence,
      message: latestAnalyzed.status === 'analyzed'
        ? 'Using the latest completed soil analysis for this user.'
        : 'Using the most recent soil analysis record available for this user.',
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message || 'Unable to load soil intelligence data.',
    };
  }
}

export function getMetricTone(metricKey) {
  return statusMeta[metricKey] || statusMeta.Warning;
}
