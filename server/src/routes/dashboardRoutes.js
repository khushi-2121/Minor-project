import { Router } from 'express';
import SoilAnalysis from '../models/SoilAnalysis.js';
import { protect } from '../middleware/authMiddleware.js';
import { buildSoilIntelligenceData } from '../services/reportService.js';
import { buildReportData, generateReportId } from '../services/reportService.js';
import { getFertilizerRecommendations } from '../services/fertilizerRecommendationService.js';
import { getCropRecommendations } from '../services/cropRecommendationService.js';
import { getSoilImprovementRecommendations } from '../services/soilImprovementService.js';
import { analyzeNutrientStatus } from '../services/fertilizerRecommendationService.js';

const router = Router();

const buildAnalysisView = (analysis) => {
  const intelligence = analysis.status === 'analyzed' ? buildSoilIntelligenceData(analysis) : null;
  const nutrientAnalysis = analysis.status === 'analyzed'
    ? analyzeNutrientStatus(analysis)
    : null;

  return {
    _id: analysis._id,
    createdAt: analysis.createdAt,
    status: analysis.status,
    crop: analysis.crop,
    soilType: analysis.soilType,
    location: analysis.location,
    fertilityLevel: analysis.prediction?.fertilityLevel || null,
    soilHealthScore: intelligence?.soilHealthScore ?? null,
    soilHealthLabel: intelligence?.soilHealthLabel || null,
    nutrients: {
      nitrogen: analysis.nitrogen,
      phosphorus: analysis.phosphorus,
      potassium: analysis.potassium,
    },
    nutrientStatus: nutrientAnalysis
      ? {
          nitrogen: nutrientAnalysis.nitrogen.status,
          phosphorus: nutrientAnalysis.phosphorus.status,
          potassium: nutrientAnalysis.potassium.status,
        }
      : null,
    condition: {
      ph: analysis.ph,
      moisture: analysis.moisture,
      organicCarbon: analysis.organicCarbon,
      electricalConductivity: analysis.electricalConductivity,
      soilType: analysis.soilType,
    },
  };
};

router.get('/', protect, async (req, res) => {
  try {
    const analyses = await SoilAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    const analyzed = analyses.filter((analysis) => analysis.status === 'analyzed');
    const latestAnalysis = analyses[0] || null;
    const latestAnalyzed = analyzed[0] || null;
    const latestIntelligence = latestAnalyzed ? buildSoilIntelligenceData(latestAnalyzed) : null;

    const reports = analyzed.map((analysis, index) => {
      const report = buildReportData(analysis, req.user);
      if (!report) return null;
      report.reportId = generateReportId(index + 1, analysis.createdAt);
      return report;
    }).filter(Boolean);

    let recommendations = null;
    if (latestAnalyzed) {
      recommendations = {
        analysisId: latestAnalyzed._id,
        fertilizer: getFertilizerRecommendations(latestAnalyzed),
        crops: getCropRecommendations(latestAnalyzed),
        soilImprovement: getSoilImprovementRecommendations(latestAnalyzed),
      };
    }

    return res.status(200).json({
      success: true,
      user: {
        name: req.user.name,
        email: req.user.email,
        region: req.user.region || null,
      },
      statistics: {
        totalAnalyses: analyses.length,
        totalReports: reports.length,
        latestFertilityLevel: latestAnalyzed?.prediction?.fertilityLevel || null,
        latestSoilHealthScore: latestIntelligence?.soilHealthScore ?? null,
      },
      latestAnalysis: latestAnalysis ? buildAnalysisView(latestAnalysis) : null,
      recentAnalyses: analyses.slice(0, 5).map(buildAnalysisView),
      healthTrend: analyses
        .filter((analysis) => analysis.status === 'analyzed')
        .slice()
        .reverse()
        .map((analysis) => {
          const intelligence = buildSoilIntelligenceData(analysis);
          return {
            date: analysis.createdAt,
            score: intelligence?.soilHealthScore ?? null,
            analysisId: analysis._id,
          };
        }),
      nutrientTrend: analyses
        .slice(0, 7)
        .slice()
        .reverse()
        .map((analysis) => ({
          date: analysis.createdAt,
          analysisId: analysis._id,
          nitrogen: analysis.nitrogen,
          phosphorus: analysis.phosphorus,
          potassium: analysis.potassium,
        })),
      recommendations,
      riskAlerts: latestIntelligence?.riskAlerts || [],
      reports: reports.slice(0, 5).map((report) => ({
        analysisId: report.analysisId,
        reportId: report.reportId,
        createdAt: report.createdAt,
        crop: report.crop,
      })),
    });
  } catch (error) {
    console.error('Dashboard data error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to load your soil intelligence data.',
    });
  }
});

export default router;
