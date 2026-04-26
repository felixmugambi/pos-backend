import express from 'express';
import {
  getInventory,
  restockProduct
} from '../controllers/inventoryController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'),  getInventory);
router.post('/restock', protect, authorize('admin'), restockProduct);

export default router;