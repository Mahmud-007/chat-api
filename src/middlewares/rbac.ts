import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const requireRole = (role: string): any => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Assuming the user's role is stored in req.user after authentication (e.g., via JWT)
    const userRole = req.user?.role;
    console.log('User role:', userRole, req.user?.role);
    if (userRole !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

// Export a helper for admin role
const requireAdmin = requireRole('admin');

export { requireRole, requireAdmin };
