import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

router.use(authenticateToken);

router.post('/', upload.single('receipt'), createOrder);
router.get('/', getOrders);
router.patch('/:id/status', authorizeRole('ADMIN', 'CASHIER'), updateOrderStatus);

export default router;
