import { Request, Response } from 'express';
import User from '../models/User';
import { signupSchema } from '../validations/auth.validation';
import { comparePassword, hashPassword } from '../utils/hash';
import jwt from 'jsonwebtoken';
import { sendEmailVerification } from '../utils/sendEmail';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import TokenBlacklist from '../models/TokenBlacklist';

// Signup function (named export)
export const signup = async (req: Request, res: Response): Promise<Response> => {
  // Explicit return type
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { firstName, name, email, country, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    firstName,
    name,
    email,
    country,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  await sendEmailVerification(user.email, token);

  return res.status(201).json({ message: 'Signup successful. Please verify your email.' });
};

// Verify email function (named export)
export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  // Explicit return type
  const { token } = req.query;
  if (!token || typeof token !== 'string') return res.status(400).json({ error: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isVerified = true;
    await user.save();

    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log('Login request received:', req.body); // Debugging line
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  res.status(200).json({ message: 'Login successful', token });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  return res.status(200).json({ user: req.user });
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    const expiresAt = new Date((decoded.exp as number) * 1000);

    await TokenBlacklist.create({ token, expiresAt });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
