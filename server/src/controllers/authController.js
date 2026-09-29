import mongoose from 'mongoose';
import User from '../models/User.js';
import SoilAnalysis from '../models/SoilAnalysis.js';
import { buildSoilIntelligenceData } from '../services/reportService.js';
import { generateToken } from '../utils/jwt.js';

const ensureDatabaseConnection = () => {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error('Database connection unavailable');
    error.code = 'DB_UNAVAILABLE';
    throw error;
  }
};

const sendAuthError = (res, error, fallbackMessage) => {
  console.error(`${fallbackMessage}:`, error.message);

  if (error.code === 'DB_UNAVAILABLE' || error.name === 'MongooseError' || error.name === 'MongoServerSelectionError') {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Authentication service unavailable',
  });
};

// Register a new user
export const register = async (req, res) => {
  try {
    ensureDatabaseConnection();
    const { name, email, password, region } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        errors: [{ field: 'email', message: 'Email already in use' }],
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      region: region || null,
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response without password
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    return sendAuthError(res, error, 'Registration error');
  }
};

// Login user
export const login = async (req, res) => {
  try {
    ensureDatabaseConnection();
    const { email, password } = req.body;

    // Find user by email (include password to compare)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response without password
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    return sendAuthError(res, error, 'Login error');
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Current user error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to load your account right now.',
    });
  }
};

// Get the authenticated user's profile statistics
export const getProfileSummary = async (req, res) => {
  try {
    const analyses = await SoilAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    const analyzedAnalyses = analyses.filter((analysis) => analysis.status === 'analyzed');
    const latestAnalysis = analyses[0] || null;
    const latestAnalyzed = analyzedAnalyses[0] || null;
    const intelligence = latestAnalyzed ? buildSoilIntelligenceData(latestAnalyzed) : null;

    res.status(200).json({
      success: true,
      statistics: {
        totalSoilAnalyses: analyses.length,
        totalReports: analyzedAnalyses.length,
        latestAnalysisDate: latestAnalysis?.createdAt || null,
        currentSoilHealthScore: intelligence?.soilHealthScore ?? null,
      },
    });
  } catch (error) {
    console.error('Profile summary error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to load your profile statistics right now.',
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, region, profileImage } = req.body;

    // Build update object (only allow specific fields)
    const updateData = {};
    if (name) updateData.name = name;
    if (region !== undefined) updateData.region = region;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // Update user
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to update your profile right now.',
    });
  }
};

// Change the authenticated user's password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Password change error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to change your password right now.',
    });
  }
};

// Logout (frontend handles token removal)
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};
