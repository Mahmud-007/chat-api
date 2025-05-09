import User from '../models/User';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
const seedSecret = process.env.SEED_SECRET; // Define this in your .env

export const seedAdmin = async (req: Request, res: Response) => {
  if (req.headers['x-seed-secret'] !== seedSecret) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = new User({
      firstName: 'Super',
      name: 'Admin',
      email: 'admin@example.com',
      country: 'US',
      password: hashedPassword,
      isVerified: true,
      role: 'admin',
    });

    await admin.save();

    return res.status(201).json({ message: 'Admin seeded successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during admin seeding' });
  }
};
