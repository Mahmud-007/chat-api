import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { seedAdmin } from '../controllers/admin.controller';

const router = express.Router();

// Only allow in non-production environments
if (process.env.NODE_ENV !== 'production') {
  router.post('/seed', asyncHandler(seedAdmin)); // Endpoint to seed admin
}

export default router;
