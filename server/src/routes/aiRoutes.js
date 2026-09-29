import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../utils/validation.js';
import { askAgricultureAssistant } from '../services/aiService.js';

const router = Router();

const chatValidation = [
  body('message')
    .isString()
    .withMessage('Message must be text')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message must be 1000 characters or fewer'),
];

router.post('/chat', protect, chatValidation, validate, async (req, res) => {
  try {
    const answer = await askAgricultureAssistant(req.body.message, req.user._id);
    return res.status(200).json({ success: true, reply: answer });
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(503).json({ success: false, message: 'AI service authentication failed. Please check the backend API key.' });
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ success: false, message: 'AI service is temporarily unavailable. Please try again.' });
    }

    console.error('AI assistant error:', error.message);
    return res.status(503).json({
      success: false,
      message: 'AI Assistant is currently unavailable. Please try again later.',
    });
  }
});

export default router;
