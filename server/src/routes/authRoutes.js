import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser, getProfileSummary, updateProfile, changePassword, logout } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../utils/validation.js';

const router = Router();

// Register validation
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email is too long'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain at least one special character')
    .isLength({ max: 128 })
    .withMessage('Password must be at most 128 characters'),
  body('region')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('Region must be at most 120 characters'),
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email is too long'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password is too long'),
];

// Update profile validation
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  body('region')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('Region must be at most 120 characters'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/)
    .withMessage('New password must contain at least one special character')
    .isLength({ max: 128 })
    .withMessage('New password must be at most 128 characters'),
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getCurrentUser);
router.get('/profile-summary', protect, getProfileSummary);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);
router.put('/password', protect, changePasswordValidation, validate, changePassword);
router.post('/logout', protect, logout);

export default router;
