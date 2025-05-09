import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get('/profile', asyncHandler(authenticate), (req: any, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

export default router;
