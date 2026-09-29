import mongoose from 'mongoose';

const soilAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      trim: true,
      enum: ['Sandy', 'Loamy', 'Clay', 'Silt', 'Sandy Loam', 'Clay Loam', 'Other'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    crop: {
      type: String,
      required: [true, 'Crop is required'],
      trim: true,
    },
    nitrogen: {
      type: Number,
      required: [true, 'Nitrogen is required'],
      min: [0, 'Nitrogen cannot be negative'],
      max: [2000, 'Nitrogen must be less than or equal to 2000 mg/kg'],
    },
    phosphorus: {
      type: Number,
      required: [true, 'Phosphorus is required'],
      min: [0, 'Phosphorus cannot be negative'],
      max: [2000, 'Phosphorus must be less than or equal to 2000 mg/kg'],
    },
    potassium: {
      type: Number,
      required: [true, 'Potassium is required'],
      min: [0, 'Potassium cannot be negative'],
      max: [2000, 'Potassium must be less than or equal to 2000 mg/kg'],
    },
    ph: {
      type: Number,
      required: [true, 'pH is required'],
      min: [0, 'pH cannot be less than 0'],
      max: [14, 'pH cannot be greater than 14'],
    },
    moisture: {
      type: Number,
      required: [true, 'Moisture is required'],
      min: [0, 'Moisture cannot be negative'],
      max: [100, 'Moisture cannot be greater than 100%'],
    },
    organicCarbon: {
      type: Number,
      required: [true, 'Organic carbon is required'],
      min: [0, 'Organic carbon cannot be negative'],
      max: [100, 'Organic carbon cannot be greater than 100%'],
    },
    electricalConductivity: {
      type: Number,
      required: [true, 'Electrical conductivity is required'],
      min: [0, 'Electrical conductivity cannot be negative'],
      max: [10, 'Electrical conductivity cannot be greater than 10 dS/m'],
    },
    status: {
      type: String,
      default: 'submitted',
      enum: ['submitted', 'processing', 'analyzed', 'failed'],
      index: true,
    },
    prediction: {
      fertilityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: null,
      },
      modelName: {
        type: String,
        default: null,
      },
      modelVersion: {
        type: String,
        default: null,
      },
      predictedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const SoilAnalysis = mongoose.model('SoilAnalysis', soilAnalysisSchema);

export default SoilAnalysis;
