import express from 'express';
import { updatePaymentStatus } from '../controllers/paymentController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Update payment status (ADMIN and CASHIER)
router.patch('/:id/status', authenticateToken, authorizeRole('ADMIN', 'CASHIER'), updatePaymentStatus);

export default router;
