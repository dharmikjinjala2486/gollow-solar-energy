import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import prisma from './prisma/db.js';

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import formulaRoutes from './routes/formulaRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Ensure Canvas WebGL renders properly
  })
);
app.use(cors());
app.use(express.json());

// API Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200, 
  message: { error: 'Too many requests from this IP. Please try again in 15 minutes.' },
});
app.use('/api/', limiter);

// API Route Bindings
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/formulas', formulaRoutes);

// Admin Dashboard stats endpoint
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const [inquiriesCount, subscribersCount, blogsCount, inquiries] = await prisma.$transaction([
      prisma.inquiry.count(),
      prisma.subscriber.count({ where: { active: true } }),
      prisma.blog.count(),
      prisma.inquiry.findMany({ select: { roofSize: true } }),
    ]);

    // Calculate sum of active sizing
    const totalSizedKw = inquiries.reduce((sum, item) => sum + (item.roofSize / 6), 0);

    return res.json({
      inquiriesCount,
      subscribersCount,
      blogsCount,
      totalSizedKw: parseFloat(totalSizedKw.toFixed(1)),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to retrieve stats.' });
  }
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`[Server] GOL LOW Solar API Running on http://localhost:${PORT}`);
});
