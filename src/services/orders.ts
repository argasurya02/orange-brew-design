import { API_URL, getAuthHeaders, handleResponse } from '../lib/api';

interface OrderItemEntry {
    productId: number;
    quantity: number;
}

export interface Order {
    id: number;
    orderType: 'DINE_IN' | 'PICKUP' | 'DELIVERY';
    status: string;
    totalPrice: number;
    createdAt: string;
    orderItems: any[];
}

export const orderService = {
    create: async (orderType: string, items: OrderItemEntry[]) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ orderType, items }),
        });
        return handleResponse(response);
    },

    getAll: async (): Promise<Order[]> => {
        const response = await fetch(`${API_URL}/orders`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};
