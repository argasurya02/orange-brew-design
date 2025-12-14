import { Router } from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, authorizeRole('ADMIN'), getAllUsers);

export default router;
