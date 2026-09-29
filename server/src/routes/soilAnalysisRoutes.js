import { Router } from 'express';
import { body } from 'express-validator';
import { createSoilAnalysis, getSoilAnalyses, getSoilAnalysisById } from '../controllers/soilAnalysisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../utils/validation.js';

const router = Router();

const soilAnalysisValidation = [
  body('soilType')
    .trim()
    .notEmpty()
    .withMessage('Soil type is required')
    .isIn(['Sandy', 'Loamy', 'Clay', 'Silt', 'Sandy Loam', 'Clay Loam', 'Other'])
    .withMessage('Invalid soil type'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 2 })
    .withMessage('Location must be at least 2 characters')
    .isLength({ max: 120 })
    .withMessage('Location must be at most 120 characters'),
  body('crop')
    .trim()
    .notEmpty()
    .withMessage('Crop is required')
    .isLength({ min: 2 })
    .withMessage('Crop name must be at least 2 characters')
    .isLength({ max: 120 })
    .withMessage('Crop name must be at most 120 characters'),
  body('nitrogen').isFloat({ min: 0, max: 500 }).withMessage('Nitrogen must be between 0 and 500 mg/kg'),
  body('phosphorus').isFloat({ min: 0, max: 500 }).withMessage('Phosphorus must be between 0 and 500 mg/kg'),
  body('potassium').isFloat({ min: 0, max: 500 }).withMessage('Potassium must be between 0 and 500 mg/kg'),
  body('ph').isFloat({ min: 0, max: 14 }).withMessage('pH must be between 0 and 14'),
  body('moisture').isFloat({ min: 0, max: 100 }).withMessage('Moisture must be between 0 and 100%'),
  body('organicCarbon').isFloat({ min: 0, max: 10 }).withMessage('Organic carbon must be between 0 and 10%'),
  body('electricalConductivity').isFloat({ min: 0, max: 10 }).withMessage('Electrical conductivity must be between 0 and 10 dS/m'),
];

router.post('/', protect, soilAnalysisValidation, validate, createSoilAnalysis);
router.get('/', protect, getSoilAnalyses);
router.get('/:id', protect, getSoilAnalysisById);

export default router;
