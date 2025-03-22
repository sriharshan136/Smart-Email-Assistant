import express from 'express';
import emailController from '../controllers/emailController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/draft', authenticateToken, emailController.draftEmail);
router.post('/correct-tone', authenticateToken, emailController.correctTone);
router.post('/summarize', authenticateToken, emailController.summarizeEmail);
router.post('/followup', authenticateToken, emailController.followUpSuggestion);
router.post('/classify', authenticateToken, emailController.classifyEmail);

export default router;
