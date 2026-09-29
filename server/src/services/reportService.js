import PDFDocument from 'pdfkit';
import { getFertilizerRecommendations } from './fertilizerRecommendationService.js';
import { getCropRecommendations } from './cropRecommendationService.js';
import { getSoilImprovementRecommendations } from './soilImprovementService.js';

const RANGE_LOOKUP = {
  nitrogen: { label: 'Nitrogen', unit: 'mg/kg', idealMin: 20, idealMax: 60, low: 20, high: 100 },
  phosphorus: { label: 'Phosphorus', unit: 'mg/kg', idealMin: 10, idealMax: 25, low: 10, high: 60 },
  potassium: { label: 'Potassium', unit: 'mg/kg', idealMin: 100, idealMax: 250, low: 100, high: 400 },
  ph: { label: 'pH', unit: '', idealMin: 6.0, idealMax: 7.5, low: 6.0, high: 8.5 },
  moisture: { label: 'Moisture', unit: '%', idealMin: 12, idealMax: 25, low: 12, high: 35 },
  organicCarbon: { label: 'Organic Carbon', unit: '%', idealMin: 0.8, idealMax: 1.5, low: 0.8, high: 2.5 },
  electricalConductivity: { label: 'Electrical Conductivity', unit: 'dS/m', idealMin: 0.5, idealMax: 2.0, low: 0.5, high: 4.0 },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getMetricStatus(metric, value) {
  const config = RANGE_LOOKUP[metric];
  if (!config) {
    return { label: 'Unknown', score: 0, status: 'Warning' };
  }

  if (metric === 'ph') {
    if (value >= config.idealMin && value <= config.idealMax) {
      return { label: 'Optimal', score: 100, status: 'Optimal' };
    }
    if (value < config.idealMin) {
      return {
        label: 'Low',
        score: clamp(Math.round(((value / config.idealMin) * 100) * 0.9), 15, 80),
        status: 'Low',
      };
    }
    return {
      label: 'High',
      score: clamp(Math.round((1 - (value - config.idealMax) / (config.high - config.idealMax)) * 100), 20, 85),
      status: 'High',
    };
  }

  if (value >= config.idealMin && value <= config.idealMax) {
    return { label: 'Optimal', score: 100, status: 'Optimal' };
  }

  if (value < config.low) {
    return {
      label: 'Low',
      score: clamp(Math.round((value / config.low) * 100), 15, 80),
      status: 'Low',
    };
  }

  if (value > config.high) {
    return {
      label: 'High',
      score: clamp(Math.round((1 - (value - config.high) / Math.max(config.high, 1)) * 100), 25, 80),
      status: 'High',
    };
  }

  return {
    label: 'Warning',
    score: clamp(Math.round((1 - Math.abs(value - config.idealMin) / Math.max(config.idealMax - config.idealMin, 1)) * 100), 45, 90),
    status: 'Warning',
  };
}

export function generateReportId(sequence, createdAt = new Date()) {
  const year = new Date(createdAt).getFullYear();
  return `AGR-${year}-${String(sequence).padStart(5, '0')}`;
}

export function buildSoilIntelligenceData(analysis) {
  if (!analysis) return null;

  const metrics = [
    { metric: 'nitrogen', value: Number(analysis.nitrogen), ...getMetricStatus('nitrogen', Number(analysis.nitrogen)) },
    { metric: 'phosphorus', value: Number(analysis.phosphorus), ...getMetricStatus('phosphorus', Number(analysis.phosphorus)) },
    { metric: 'potassium', value: Number(analysis.potassium), ...getMetricStatus('potassium', Number(analysis.potassium)) },
    { metric: 'ph', value: Number(analysis.ph), ...getMetricStatus('ph', Number(analysis.ph)) },
    { metric: 'moisture', value: Number(analysis.moisture), ...getMetricStatus('moisture', Number(analysis.moisture)) },
    { metric: 'organicCarbon', value: Number(analysis.organicCarbon), ...getMetricStatus('organicCarbon', Number(analysis.organicCarbon)) },
    { metric: 'electricalConductivity', value: Number(analysis.electricalConductivity), ...getMetricStatus('electricalConductivity', Number(analysis.electricalConductivity)) },
  ];

  const weightedScore = Math.round(metrics.reduce((total, metric) => total + metric.score, 0) / metrics.length);

  const riskAlerts = [];

  if (analysis.ph < 6.0 || analysis.ph > 7.5) {
    riskAlerts.push({ title: 'pH outside ideal range', detail: `Current pH is ${analysis.ph}. Value is outside the general agronomic target range and may influence nutrient availability.` });
  }

  if (analysis.moisture < 12 || analysis.moisture > 25) {
    riskAlerts.push({ title: 'Moisture imbalance', detail: `Current soil moisture is ${analysis.moisture}%. This may indicate excess dryness or waterlogging depending on crop and season.` });
  }

  if (analysis.organicCarbon < 0.8) {
    riskAlerts.push({ title: 'Low organic carbon', detail: `Organic carbon is ${analysis.organicCarbon}%. Low levels may reduce soil structure and biological activity over time.` });
  }

  if (analysis.electricalConductivity > 2.0) {
    riskAlerts.push({ title: 'Salinity risk', detail: `Electrical conductivity is ${analysis.electricalConductivity} dS/m, which is above the common moderate range for many crops.` });
  }

  if (analysis.nitrogen < 20 || analysis.phosphorus < 10 || analysis.potassium < 100) {
    riskAlerts.push({ title: 'Nutrient deficiency risk', detail: 'One or more major nutrients are below the commonly used agronomic reference range for many field crops.' });
  }

  if (analysis.prediction?.fertilityLevel === 'Low') {
    riskAlerts.push({ title: 'ML fertility warning', detail: 'The model classified the soil as Low fertility. This should be reviewed with the associated soil analysis and agronomic context.' });
  }

  return {
    soilHealthScore: weightedScore,
    metrics,
    riskAlerts,
    fertilityLevel: analysis.prediction?.fertilityLevel || 'Not available',
  };
}

function safeValue(value, fallback = 'Not available') {
  return value === null || value === undefined || value === '' ? fallback : value;
}

export function buildReportData(analysis, user) {
  if (!analysis) return null;

  const intelligence = buildSoilIntelligenceData(analysis);
  const fertilizerRecommendations = getFertilizerRecommendations(analysis);
  const cropRecommendations = getCropRecommendations(analysis);
  const soilImprovementRecommendations = getSoilImprovementRecommendations(analysis);

  const riskAlerts = intelligence?.riskAlerts?.length ? intelligence.riskAlerts : [];
  const keyConcern = riskAlerts[0]?.title || 'No major risk indicators detected by the current analysis.';
  const recommendedAction =
    fertilizerRecommendations?.recommendations?.[0]?.applicationGuidance ||
    soilImprovementRecommendations?.improvementPlan?.nutrientManagement?.recommendations?.[0]?.actions?.[0] ||
    'Review the crop and nutrient recommendations for this analysis.';

  return {
    reportId: null,
    analysisId: analysis._id,
    generatedAt: new Date(),
    userName: user?.name || 'Farmer',
    crop: safeValue(analysis.crop),
    soilType: safeValue(analysis.soilType),
    location: safeValue(analysis.location),
    createdAt: analysis.createdAt,
    status: analysis.status,
    data: {
      nitrogen: safeValue(analysis.nitrogen),
      phosphorus: safeValue(analysis.phosphorus),
      potassium: safeValue(analysis.potassium),
      ph: safeValue(analysis.ph),
      moisture: safeValue(analysis.moisture),
      organicCarbon: safeValue(analysis.organicCarbon),
      electricalConductivity: safeValue(analysis.electricalConductivity),
      soilType: safeValue(analysis.soilType),
    },
    prediction: {
      fertilityLevel: safeValue(analysis.prediction?.fertilityLevel),
      confidence: analysis.prediction?.confidence !== undefined && analysis.prediction?.confidence !== null ? Number(analysis.prediction.confidence) : null,
      modelName: safeValue(analysis.prediction?.modelName),
      modelVersion: safeValue(analysis.prediction?.modelVersion),
      predictedAt: analysis.prediction?.predictedAt || null,
    },
    soilHealth: {
      score: intelligence?.soilHealthScore ?? null,
      metrics: intelligence?.metrics || [],
      riskAlerts,
    },
    nutrientStatus: {
      nitrogen: safeValue(analysis.nitrogen > 0 ? 'Available' : 'Not available'),
      phosphorus: safeValue(analysis.phosphorus > 0 ? 'Available' : 'Not available'),
      potassium: safeValue(analysis.potassium > 0 ? 'Available' : 'Not available'),
      ph: safeValue(analysis.ph ? 'Measured' : 'Not available'),
      moisture: safeValue(analysis.moisture ? 'Measured' : 'Not available'),
      organicCarbon: safeValue(analysis.organicCarbon ? 'Measured' : 'Not available'),
      electricalConductivity: safeValue(analysis.electricalConductivity ? 'Measured' : 'Not available'),
    },
    recommendations: {
      fertilizer: fertilizerRecommendations,
      crops: cropRecommendations,
      soilImprovement: soilImprovementRecommendations,
    },
    summary: {
      overallSoilCondition: intelligence?.soilHealthScore >= 70 ? 'Healthy' : intelligence?.soilHealthScore >= 45 ? 'Moderate' : 'Needs attention',
      fertilityLevel: analysis.prediction?.fertilityLevel || 'Not available',
      soilHealthScore: intelligence?.soilHealthScore ?? null,
      keyConcern,
      recommendedAction,
    },
    aiInsights: null,
    disclaimer:
      'This report provides AI-assisted agricultural guidance based on the available soil data. It should not replace laboratory soil testing or advice from a qualified agricultural professional. Fertilizer application should follow appropriate local agricultural recommendations.',
  };
}

export async function generateReportPdfBuffer(report) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (error) => reject(error));

      doc.fontSize(18).fillColor('#0f766e').text('AgriSense AI', { align: 'center' });
      doc.moveDown(0.4);
      doc.fontSize(24).fillColor('#0f172a').text('Smart Soil Health Report', { align: 'center' });
      doc.moveDown(1);

      doc.fillColor('#475569').fontSize(10).text(`Report ID: ${report.reportId || 'N/A'}   |   Generated: ${new Date(report.generatedAt).toLocaleString()}`);
      doc.moveDown(0.8);

      doc.fillColor('#0f172a').fontSize(12).text('Summary');
      doc.fontSize(10).fillColor('#334155');
      doc.text(`Overall Soil Condition: ${report.summary?.overallSoilCondition || 'Not available'}`);
      doc.text(`Fertility Level: ${report.summary?.fertilityLevel || 'Not available'}`);
      doc.text(`Soil Health Score: ${report.summary?.soilHealthScore !== null && report.summary?.soilHealthScore !== undefined ? `${report.summary.soilHealthScore}/100` : 'Not available'}`);
      doc.text(`Key Concern: ${report.summary?.keyConcern || 'Not available'}`);
      doc.text(`Recommended Action: ${report.summary?.recommendedAction || 'Not available'}`);
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Report Information');
      doc.fontSize(10).fillColor('#334155');
      doc.text(`User: ${report.userName || 'Not available'}`);
      doc.text(`Analysis Date: ${new Date(report.createdAt).toLocaleString()}`);
      doc.text(`Crop: ${report.crop || 'Not available'}`);
      doc.text(`Soil Type: ${report.soilType || 'Not available'}`);
      doc.text(`Location: ${report.location || 'Not available'}`);
      doc.text(`Analysis ID: ${report.analysisId || 'Not available'}`);
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Soil Analysis Values');
      doc.fontSize(10).fillColor('#334155');
      const parameters = [
        ['Nitrogen', `${report.data.nitrogen} mg/kg`],
        ['Phosphorus', `${report.data.phosphorus} mg/kg`],
        ['Potassium', `${report.data.potassium} mg/kg`],
        ['pH', `${report.data.ph}`],
        ['Moisture', `${report.data.moisture}%`],
        ['Organic Carbon', `${report.data.organicCarbon}%`],
        ['Electrical Conductivity', `${report.data.electricalConductivity} dS/m`],
        ['Soil Type', report.data.soilType || 'Not available'],
      ];
      parameters.forEach(([label, value]) => {
        doc.text(`${label}: ${value || 'Not available'}`);
      });
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('ML Prediction');
      doc.fontSize(10).fillColor('#334155');
      doc.text(`Fertility Level: ${report.prediction?.fertilityLevel || 'Not available'}`);
      if (report.prediction?.confidence !== null && report.prediction?.confidence !== undefined) {
        doc.text(`Confidence: ${(Number(report.prediction.confidence) * 100).toFixed(1)}%`);
      }
      doc.text(`Model Name: ${report.prediction?.modelName || 'Not available'}`);
      doc.text(`Model Version: ${report.prediction?.modelVersion || 'Not available'}`);
      doc.text(`Prediction Date: ${report.prediction?.predictedAt ? new Date(report.prediction.predictedAt).toLocaleString() : 'Not available'}`);
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Soil Health Score');
      doc.fontSize(10).fillColor('#334155');
      doc.text(report.soilHealth?.score !== null && report.soilHealth?.score !== undefined ? `Soil Health Score: ${report.soilHealth.score}/100` : 'Soil Health Score: Not available for this analysis.');
      if (Array.isArray(report.soilHealth?.metrics) && report.soilHealth.metrics.length) {
        report.soilHealth.metrics.forEach((metric) => {
          doc.text(`${metric.metric}: ${metric.score ?? 'Not available'} (${metric.label || 'Unknown'})`);
        });
      }
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Nutrient Status');
      doc.fontSize(10).fillColor('#334155');
      doc.text(`Nitrogen: ${report.data.nitrogen !== 'Not available' ? `${report.data.nitrogen} mg/kg` : 'Not available'}`);
      doc.text(`Phosphorus: ${report.data.phosphorus !== 'Not available' ? `${report.data.phosphorus} mg/kg` : 'Not available'}`);
      doc.text(`Potassium: ${report.data.potassium !== 'Not available' ? `${report.data.potassium} mg/kg` : 'Not available'}`);
      doc.text(`pH Status: ${report.prediction?.fertilityLevel || 'Not available'}`);
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Soil Risk Alerts');
      doc.fontSize(10).fillColor('#334155');
      if (Array.isArray(report.soilHealth?.riskAlerts) && report.soilHealth.riskAlerts.length) {
        report.soilHealth.riskAlerts.forEach((alert) => {
          doc.text(`- ${alert.title}: ${alert.detail}`);
        });
      } else {
        doc.text('No major risk indicators detected by the current analysis.');
      }
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Fertilizer Recommendations');
      doc.fontSize(10).fillColor('#334155');
      const fertilizerRecommendations = report.recommendations?.fertilizer?.recommendations || [];
      if (fertilizerRecommendations.length) {
        fertilizerRecommendations.slice(0, 4).forEach((item) => {
          doc.text(`- ${item.fertilizer || 'Unknown fertilizer'} (${item.category || 'General'}): ${item.reason || 'General guidance.'}`);
        });
      } else {
        doc.text('No fertilizer recommendation data available for this analysis.');
      }
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Crop Compatibility');
      doc.fontSize(10).fillColor('#334155');
      const cropRecommendations = report.recommendations?.crops?.recommendations || [];
      if (cropRecommendations.length) {
        cropRecommendations.slice(0, 4).forEach((crop) => {
          doc.text(`- ${crop.crop || 'Crop'}: Compatibility ${crop.compatibilityScore ?? 'Not available'}; Reasons: ${crop.reasons?.join(', ') || 'Not available'}`);
        });
      } else {
        doc.text('Crop compatibility results are not available for this analysis.');
      }
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Soil Improvement Plan');
      doc.fontSize(10).fillColor('#334155');
      const improvement = report.recommendations?.soilImprovement?.improvementPlan || {};
      Object.entries(improvement).forEach(([key, value]) => {
        if (value && value.section) {
          doc.text(`${value.section}: ${value.description || 'Details available in the app.'}`);
        }
      });
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('AgriSense AI Insights');
      doc.fontSize(10).fillColor('#334155');
      const aiInsights = report.aiInsights;
      if (aiInsights) {
        doc.text(aiInsights);
      } else {
        doc.text('AI insights are not available for this report.');
      }
      doc.moveDown(1);

      doc.fillColor('#0f172a').fontSize(12).text('Disclaimer');
      doc.fontSize(10).fillColor('#334155');
      doc.text(report.disclaimer || 'This report provides AI-assisted agricultural guidance based on the available soil data.');

      const pages = doc.bufferedPageRange();
      const pageCount = pages.count;
      for (let i = 0; i < pageCount; i += 1) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor('#64748b').text(`Page ${i + 1} of ${pageCount}`, 0, doc.page.height - 30, {
          align: 'center',
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
