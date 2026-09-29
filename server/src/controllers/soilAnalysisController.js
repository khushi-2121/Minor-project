import SoilAnalysis from '../models/SoilAnalysis.js';
import { predictSoilFertility } from '../services/mlService.js';

const buildAnalysisPayload = (body) => ({
  soilType: body.soilType,
  location: body.location,
  crop: body.crop,
  nitrogen: Number(body.nitrogen),
  phosphorus: Number(body.phosphorus),
  potassium: Number(body.potassium),
  ph: Number(body.ph),
  moisture: Number(body.moisture),
  organicCarbon: Number(body.organicCarbon),
  electricalConductivity: Number(body.electricalConductivity),
});

export const createSoilAnalysis = async (req, res, next) => {
  console.log('Soil analysis request received:', { userId: req.user._id.toString() });
  try {
    const payload = buildAnalysisPayload(req.body);
    console.log('Soil analysis payload validated:', { soilType: payload.soilType, crop: payload.crop });

    // Create analysis with "processing" status
    let analysis = await SoilAnalysis.create({
      ...payload,
      user: req.user._id,
      status: 'processing',
    });
    console.log('Soil analysis saved for processing:', { analysisId: analysis._id.toString() });

    try {
      // Call ML service for prediction
      const prediction = await predictSoilFertility(payload);
      console.log('Soil analysis ML prediction received:', { analysisId: analysis._id.toString(), fertilityLevel: prediction.fertilityLevel });

      // Update analysis with prediction and change status to "analyzed"
      analysis = await SoilAnalysis.findByIdAndUpdate(
        analysis._id,
        {
          prediction: {
            fertilityLevel: prediction.fertilityLevel,
            confidence: prediction.confidence,
            modelName: prediction.modelName,
            modelVersion: prediction.modelVersion,
            predictedAt: prediction.predictedAt,
          },
          status: 'analyzed',
        },
        { new: true }
      ).populate('user', 'name email');

      return res.status(201).json({
        success: true,
        message: 'Soil analysis completed successfully',
        data: analysis,
        analysis,
      });
    } catch (mlError) {
      console.error('Soil analysis ML error:', { analysisId: analysis._id.toString(), message: mlError.message });
      // If ML service fails, mark analysis as failed but preserve the soil data
      await SoilAnalysis.findByIdAndUpdate(
        analysis._id,
        {
          status: 'failed',
        }
      );

      return res.status(503).json({
        success: false,
        message: mlError.message || 'Soil prediction service is unavailable.',
        analysisId: analysis._id,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getSoilAnalyses = async (req, res, next) => {
  try {
    const analyses = await SoilAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    next(error);
  }
};

export const getSoilAnalysisById = async (req, res, next) => {
  try {
    const analysis = await SoilAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Soil analysis not found',
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};
