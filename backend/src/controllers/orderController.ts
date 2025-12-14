import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../types';

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const { orderType, items } = req.body;
        // items: [{ productId, quantity }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Calculate total price and verify products
        let totalPrice = 0;
        const orderItemsData = [];

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

        const order = await prisma.order.create({
            data: {
                userId: req.user.userId,
                orderType,
                status: 'PENDING',
                totalPrice,
                orderItems: {
                    create: orderItemsData
                }
            },
            include: {
                orderItems: {
                    include: { product: true }
                }
            }
        });

        res.status(201).json(order);
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
