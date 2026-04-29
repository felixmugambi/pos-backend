import express from 'express';
import {
  createProduct,
  getProducts,
  searchProducts,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.get('/search', protect, searchProducts);
router.get('/', protect, getProducts);
router.get("/products/barcode/:barcode", getProductByBarcode);

export default router;