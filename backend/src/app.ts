import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Orange Brew API is running');
});

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
