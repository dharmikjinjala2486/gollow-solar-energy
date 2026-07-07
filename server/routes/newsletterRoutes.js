import express from 'express';
import {
  subscribe,
  getAllSubscribers,
  exportSubscribersCsv,
} from '../controllers/newsletterController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/subscribe', subscribe);

// Protected Admin routes
router.get('/subscribers', authMiddleware, getAllSubscribers);
router.get('/subscribers/export', authMiddleware, exportSubscribersCsv);

export default router;
