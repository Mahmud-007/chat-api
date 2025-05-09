import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorHandler';
import morgan from 'morgan';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
// Routes
app.get('/', (_, res) => {
  res.json({ message: 'API is running 🚀' });
});
app.use('/api/auth', authRoutes);


// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);





export default app;
