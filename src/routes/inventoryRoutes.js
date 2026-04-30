import express from 'express';
import {
  adjustStock,
  getInventory,
  restockProduct
} from '../controllers/inventoryController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'),  getInventory);
router.post('/restock', protect, authorize('admin'), restockProduct);
router.post("/adjust", protect, authorize("admin"), adjustStock);

export default router;