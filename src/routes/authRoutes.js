import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only admin can create users
router.post('/register', protect, authorize('admin'), register);

// Login
router.post('/login', login);

router.get('/me', protect, getMe);


export default router;