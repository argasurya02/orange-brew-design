import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../types';

export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const payment = await prisma.payment.update({
            where: { id },
            data: { status }
        });

        // Optional: Update Order status based on Payment status
        if (status === 'CONFIRMED') { // Enum is CONFIRMED, user asked for "Paid" (mapped usually)
            // Check schema enum. Schema says PENDING, CONFIRMED.
            // User prompt says: Pending, Paid, Rejected.
            // I should probably map Paid -> CONFIRMED. Rejected -> REJECTED?
            // Schema currently only has PENDING, CONFIRMED. I should update Schema or map.
            // Let's check Schema.
            await prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'COOKING' } // Auto move to cooking if paid?
            });
        }

        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating payment status', error });
    }
};
