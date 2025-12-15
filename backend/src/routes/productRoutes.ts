import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Publicly accessible products
router.get('/', getProducts);

// Admin only routes
router.use(authenticateToken);
router.use(authorizeRole('ADMIN'));
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
