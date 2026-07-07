import express from 'express';
import {
  calculateSavings,
  estimateProject,
  chatAssistant,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/calculate', calculateSavings);
router.post('/estimate', estimateProject);
router.post('/chat', chatAssistant);

export default router;
