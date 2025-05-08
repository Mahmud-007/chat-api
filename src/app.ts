import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorHandler';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_, res) => {
  res.json({ message: 'API is running 🚀' });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
