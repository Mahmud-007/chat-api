import { Request, Response } from 'express';
import User from '../models/User';
import { signupSchema } from '../validations/auth.validation';
import { hashPassword } from '../utils/hash';
import jwt from 'jsonwebtoken';
import { sendEmailVerification } from '../utils/sendEmail';

// Signup function (named export)
export const signup = async (req: Request, res: Response): Promise<Response> => {  // Explicit return type
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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  await sendEmailVerification(user.email, token);

  return res.status(201).json({ message: 'Signup successful. Please verify your email.' });
};

// Verify email function (named export)
export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {  // Explicit return type
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
