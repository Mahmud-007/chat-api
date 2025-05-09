import express from 'express';
import { signup, verifyEmail } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.get('/verify-email', asyncHandler(verifyEmail));

export default router;
