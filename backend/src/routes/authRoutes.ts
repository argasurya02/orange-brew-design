import { Router } from 'express';
import { register, login, getMe, getAllUsers, createUser, updateUser, deleteUser } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, authorizeRole('ADMIN'), getAllUsers);
router.post('/users', authenticateToken, authorizeRole('ADMIN'), createUser);
router.patch('/users/:id', authenticateToken, authorizeRole('ADMIN'), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole('ADMIN'), deleteUser);

export default router;
