import express from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only for write operations
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

// Public
router.get('/', protect, getCategories);

export default router;