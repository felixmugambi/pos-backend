import express from 'express';
import {
  createSale,
  getSales,
  getSaleById,
  getSalesByDate,
  getSalesSummary
} from '../controllers/salesController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create sale (cashier + admin)
router.post('/', protect, authorize('admin', 'cashier'), createSale);

// View all sales (admin only)
router.get('/', protect, authorize('admin'), getSales);


// Reports
router.get('/reports/daily', protect, authorize('admin'), getSalesByDate);

// Summary
router.get('/summary', protect, authorize('admin'), getSalesSummary);

// Single receipt
router.get('/:id', protect, getSaleById);

export default router;