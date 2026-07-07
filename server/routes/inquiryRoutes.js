import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
  exportInquiriesCsv,
} from '../controllers/inquiryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/', createInquiry);

// Protected Admin routes
router.get('/', authMiddleware, getAllInquiries);
router.get('/export', authMiddleware, exportInquiriesCsv);
router.put('/:id/status', authMiddleware, updateInquiryStatus);
router.delete('/:id', authMiddleware, deleteInquiry);

export default router;
