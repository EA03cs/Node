import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/Auth/routes/auth.routes.js';
import { errorHandler } from './modules/Auth/utils/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;