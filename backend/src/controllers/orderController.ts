import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../types';

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // When using multer, body fields are strings
        const { orderType, paymentMethod } = req.body;
        let items = [];
        try {
            items = JSON.parse(req.body.items);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid items format' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Check for receipt if TRANSFER or QRIS
        if ((paymentMethod === 'TRANSFER' || paymentMethod === 'QRIS') && !req.file) {
            return res.status(400).json({ message: 'Proof of payment is required for Transfer/QRIS' });
        }

        // Calculate total price and verify products
        let totalPrice = 0;
        const orderItemsData: { productId: number; quantity: number; price: number }[] = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }
            totalPrice += product.price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Transaction: Create Order and Payment
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Create Order
            const order = await prisma.order.create({
                data: {
                    userId: req.user!.userId,
                    orderType,
                    status: 'PENDING',
                    totalPrice,
                    orderItems: {
                        create: orderItemsData
                    }
                }
            });

            // 2. Create Payment
            const payment = await prisma.payment.create({
                data: {
                    userId: req.user!.userId,
                    orderId: order.id,
                    amount: Math.round(totalPrice), // Store as Int? Schema says Int. Handle decimals if needed.
                    method: paymentMethod,
                    status: 'PENDING',
                    receiptUrl: req.file ? `/uploads/${req.file.filename}` : null
                }
            });

            return { order, payment };
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const { role, userId } = req.user;

        let whereClause = {};
        if (role === 'USER') {
            whereClause = { userId };
        }
        // ADMIN and CASHIER see all

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                user: { select: { id: true, name: true, email: true } },
                orderItems: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status', error });
    }
};
