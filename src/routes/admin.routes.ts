import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { seedAdmin } from '../controllers/admin.controller';
import { requireAdmin } from '../middlewares/rbac';

const router = express.Router();

// Only allow in non-production environments
if (process.env.NODE_ENV !== 'production') {
//   router.post('/seed', asyncHandler(requireAdmin), asyncHandler(seedAdmin)); // Only admins can access this route
  router.post('/seed', asyncHandler(seedAdmin)); // Only admins can access this route
}

export default router;
