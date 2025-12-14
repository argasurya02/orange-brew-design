import { Router } from 'express';
import { getProducts } from '../controllers/productController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

// Publicly accessible products, or protect if needed
router.get('/', getProducts);

export default router;
