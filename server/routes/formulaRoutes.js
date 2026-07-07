import express from 'express';
import { getAllFormulas, updateFormula } from '../controllers/formulaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected Admin routes
router.get('/', authMiddleware, getAllFormulas);
router.put('/:id', authMiddleware, updateFormula);

export default router;
