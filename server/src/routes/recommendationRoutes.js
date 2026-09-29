import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import SoilAnalysis from '../models/SoilAnalysis.js';
import { getFertilizerRecommendations } from '../services/fertilizerRecommendationService.js';
import { getCropRecommendations } from '../services/cropRecommendationService.js';
import { getSoilImprovementRecommendations } from '../services/soilImprovementService.js';

const router = express.Router();

/**
 * GET /api/recommendations
 * Get all recommendations for the user's latest soil analysis
 */
router.get('/', protect, async (req, res) => {
  try {
    // Get latest completed analysis for this user
    const analysis = await SoilAnalysis.findOne({
      user: req.user._id,
      status: 'analyzed',
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No completed soil analysis found. Please complete an analysis first.',
      });
    }

    // Generate all recommendations
    const fertilizerRecs = getFertilizerRecommendations(analysis);
    const cropRecs = getCropRecommendations(analysis);
    const soilImpRecs = getSoilImprovementRecommendations(analysis);

    res.status(200).json({
      success: true,
      analysisId: analysis._id,
      recommendations: {
        fertilizer: fertilizerRecs,
        crops: cropRecs,
        soilImprovement: soilImpRecs,
      },
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
    });
  }
});

/**
 * GET /api/recommendations/fertilizer
 * Get fertilizer recommendations for the user's latest soil analysis
 */
router.get('/fertilizer', protect, async (req, res) => {
  try {
    // Get latest completed analysis for this user
    const analysis = await SoilAnalysis.findOne({
      user: req.user._id,
      status: 'analyzed',
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No completed soil analysis found. Please complete an analysis first.',
      });
    }

    const recommendations = getFertilizerRecommendations(analysis);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error fetching fertilizer recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate fertilizer recommendations',
    });
  }
});

/**
 * GET /api/recommendations/crops
 * Get crop compatibility recommendations for the user's latest soil analysis
 */
router.get('/crops', protect, async (req, res) => {
  try {
    // Get latest completed analysis for this user
    const analysis = await SoilAnalysis.findOne({
      user: req.user._id,
      status: 'analyzed',
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No completed soil analysis found. Please complete an analysis first.',
      });
    }

    const recommendations = getCropRecommendations(analysis);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error fetching crop recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate crop recommendations',
    });
  }
});

/**
 * GET /api/recommendations/soil-improvement
 * Get soil improvement recommendations for the user's latest soil analysis
 */
router.get('/soil-improvement', protect, async (req, res) => {
  try {
    // Get latest completed analysis for this user
    const analysis = await SoilAnalysis.findOne({
      user: req.user._id,
      status: 'analyzed',
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No completed soil analysis found. Please complete an analysis first.',
      });
    }

    const recommendations = getSoilImprovementRecommendations(analysis);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error fetching soil improvement recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate soil improvement recommendations',
    });
  }
});

export default router;
