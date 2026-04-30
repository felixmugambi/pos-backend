import express from 'express';
import {
  createProduct,
  getProducts,
  searchProducts,
  updateProduct,
  deleteProduct,
  getProductByBarcode,
  restoreProduct
} from '../controllers/productController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.get('/search', protect, searchProducts);
router.get('/', protect, getProducts);
router.get("/barcode/:barcode", protect, getProductByBarcode);
router.put('/:id/restore', protect, authorize('admin'), restoreProduct);

export default router;