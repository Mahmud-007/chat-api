import express from 'express';
import { login, signup, verifyEmail } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middlewares/auth.middleware';
import { getCurrentUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.get('/verify-email', asyncHandler(verifyEmail));
router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(authenticate), asyncHandler(getCurrentUser));

export default router;
