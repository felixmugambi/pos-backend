import express from 'express';
import cors from 'cors';


import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://pos-frontend-seven-brown.vercel.app'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile apps / curl
  
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
  
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }));
  app.options('*', cors());
app.use(express.json());

app.get( '/api', (req, res) => {
    res.status(200).json({message: "Success"})
})

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



export default app;