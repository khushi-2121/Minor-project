import axios from 'axios';
import SoilAnalysis from '../models/SoilAnalysis.js';
import { buildSoilIntelligenceData } from './reportService.js';

const AI_TIMEOUT = 30000;
const isPlaceholderKey = (value) => {
  const normalized = value?.trim().toLowerCase() || '';
  return !normalized || normalized.startsWith('your_') || normalized.includes('replace');
};

const buildLocalFallbackResponse = (message, analysis) => {
  const question = message.toLowerCase();
  const soilSummary = analysis
    ? `Your latest analysis shows ${analysis.soilType} soil for ${analysis.crop}, with nitrogen ${analysis.nitrogen} mg/kg, phosphorus ${analysis.phosphorus} mg/kg, potassium ${analysis.potassium} mg/kg, pH ${analysis.ph}, moisture ${analysis.moisture}%, organic carbon ${analysis.organicCarbon}%, and EC ${analysis.electricalConductivity} dS/m.`
    : 'No completed soil analysis is available yet, so I cannot make a personalized claim about your field.';

  if (question.includes('low nitrogen') || (question.includes('nitrogen') && question.includes('mean'))) {
    return `Low nitrogen means the soil does not contain enough available nitrogen for healthy plant growth. It can cause slow growth and yellowing of older leaves. Test the soil before applying nitrogen, then use a crop-appropriate nitrogen source or mature organic matter at the recommended rate. ${soilSummary}`;
  }

  if (question.includes('crop') || question.includes('suitable')) {
    if (!analysis) {
      return 'Please complete a soil analysis first so I can compare crop suitability with your actual soil type, pH, nutrients, moisture, and crop context.';
    }
    return `${soilSummary} Crop suitability depends on the crop target, season, water availability, pH, salinity, and nutrient balance. Use the crop recommendations for this analysis as the starting point, and confirm the choice with local seasonal and climate guidance.`;
  }

  if (question.includes('fertility') || question.includes('improve my soil')) {
    return `${soilSummary} Improve fertility by correcting measured nutrient deficiencies, adding well-matured organic matter when appropriate, maintaining suitable moisture, reducing erosion, and retesting after the next growing cycle. Avoid applying amendments without checking the soil result and crop requirements.`;
  }

  if (question.includes('fertilizer')) {
    if (!analysis) {
      return 'Please complete a soil analysis first so fertilizer selection can be based on your measured N, P, K, pH, crop, and application conditions.';
    }
    return `${soilSummary} Choose fertilizer according to the nutrient that is actually limiting and the crop requirement. Avoid a blanket application; use the fertilizer recommendation for this analysis and follow its application guidance, label directions, and local agronomic advice.`;
  }

  if (question.includes('ph')) {
    return `Soil pH affects nutrient availability and root conditions. A low pH is acidic and a high pH is alkaline; amendments should be selected and applied only after confirming the measured value, crop tolerance, and local recommendations. ${soilSummary}`;
  }

  if (question.includes('npk') || question.includes('phosphorus') || question.includes('potassium')) {
    return `Nitrogen supports vegetative growth, phosphorus supports roots and flowering, and potassium supports water regulation and stress tolerance. The right correction depends on measured values and crop demand. ${soilSummary}`;
  }

  return `I can help with soil fertility, NPK, pH, moisture, organic carbon, electrical conductivity, crops, fertilizers, and soil improvement. Ask a specific question, or complete a soil analysis for guidance based on your actual field data. ${soilSummary}`;
};

const buildSoilContext = (analysis) => {
  if (!analysis) {
    return 'No completed soil analysis is available. Ask the user to complete a soil analysis before giving personalized advice.';
  }

  const intelligence = buildSoilIntelligenceData(analysis);
  return JSON.stringify({
    soilType: analysis.soilType,
    crop: analysis.crop,
    nitrogen: analysis.nitrogen,
    phosphorus: analysis.phosphorus,
    potassium: analysis.potassium,
    ph: analysis.ph,
    moisture: analysis.moisture,
    organicCarbon: analysis.organicCarbon,
    electricalConductivity: analysis.electricalConductivity,
    fertilityLevel: analysis.prediction?.fertilityLevel || null,
    soilHealthScore: intelligence?.soilHealthScore ?? null,
    riskAlerts: intelligence?.riskAlerts || [],
  });
};

export const askAgricultureAssistant = async (message, userId) => {
  const aiApiKey = process.env.AI_API_KEY;
  const aiApiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const aiModel = process.env.AI_MODEL || 'gpt-4o-mini';

  const latestAnalysis = await SoilAnalysis.findOne({
    user: userId,
    status: 'analyzed',
  }).sort({ createdAt: -1 });

  if (isPlaceholderKey(aiApiKey)) {
    return buildLocalFallbackResponse(message, latestAnalysis);
  }

  const response = await axios.post(
    aiApiUrl,
    {
      model: aiModel,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are AgriSense AI, an agricultural soil assistant. Give concise, practical guidance. Use only the supplied soil context for personalized claims. If context is unavailable, tell the user to complete a soil analysis first. Do not invent measurements, diagnoses, or guaranteed outcomes. Recommend qualified local agronomic advice for high-stakes decisions.',
        },
        {
          role: 'system',
          content: `Latest user soil context: ${buildSoilContext(latestAnalysis)}`,
        },
        { role: 'user', content: message },
      ],
    },
    {
      timeout: AI_TIMEOUT,
      headers: {
        Authorization: `Bearer ${aiApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const answer = response.data?.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error('AI service returned an empty response.');
  }

  return answer;
};
