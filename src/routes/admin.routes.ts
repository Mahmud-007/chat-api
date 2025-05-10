import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { createAdmin, seedAdmin } from '../controllers/admin.controller';
import { requireAdmin } from '../middlewares/rbac';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Only allow in non-production environments
if (process.env.NODE_ENV !== 'production') {
  router.post('/seed', requireAdmin, asyncHandler(seedAdmin)); // Only admins can access this route
  router.post(
    '/add-admin',
    asyncHandler(authenticate),
    requireAdmin,
    asyncHandler(createAdmin)
  );

  // router.post('/seed', asyncHandler(seedAdmin)); // Only admins can access this route
}
;

export default router;
