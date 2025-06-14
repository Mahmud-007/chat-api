import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import TokenBlacklist from '../models/TokenBlacklist';
import { isTokenBlacklisted } from '../utils/isTokenBlacklisted';

export interface AuthenticatedRequest extends Request {
  user?: any;
}



export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  try {
    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    console.log('Authenticated user:', user); // Debugging line
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
