import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOpportunity, getBrandOpportunities } from '../controller/OpportunityController.js';

const router = express.Router();

router.get('/', protect, getBrandOpportunities);
router.post('/', protect, createOpportunity);

export default router;