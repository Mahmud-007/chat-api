import express from 'express';
import { login, signup, verifyEmail } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.get('/verify-email', asyncHandler(verifyEmail));
router.post('/login', asyncHandler(login));

export default router;
