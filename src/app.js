import express from 'express';
import cors from 'cors';

import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

/* =========================================
   ✅ 1. FORCE CORS (Vercel-safe)
========================================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://pos-frontend-seven-brown.vercel.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // allow requests with no origin (mobile apps, Postman, etc.)
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // ✅ HANDLE PREFLIGHT HERE (CRITICAL)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

/* =========================================
   ✅ 2. OPTIONAL: cors middleware (safe fallback)
========================================= */
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

/* =========================================
   ✅ 3. BODY PARSER
========================================= */
app.use(express.json());

/* =========================================
   ✅ 4. TEST ROUTE
========================================= */
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API working ✅' });
});

/* =========================================
   ✅ 5. ROUTES
========================================= */
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

/* =========================================
   ✅ 6. FALLBACK (IMPORTANT)
========================================= */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;