import { API_URL, getAuthHeaders, handleResponse } from '@/lib/api';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image?: string;
    description?: string;
}

export interface OrderItemEntry {
    productId: number;
    quantity: number;
}

export interface Order {
    id: number;
    userId: number;
    orderType: 'DINE_IN' | 'PICKUP' | 'DELIVERY';
    status: 'PENDING' | 'COOKING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    totalPrice: number;
    orderItems: {
        product: Product;
        quantity: number;
        price: number;
    }[];
    createdAt: string;
}

export const orderService = {
    create: async (orderType: string, items: OrderItemEntry[], paymentMethod: string, receipt?: File) => {
        const formData = new FormData();
        formData.append('orderType', orderType);
        formData.append('paymentMethod', paymentMethod);
        formData.append('items', JSON.stringify(items));
        if (receipt) {
            formData.append('receipt', receipt);
        }

        const headers = getAuthHeaders();
        // Remove Content-Type to let browser set boundary for FormData
        delete (headers as any)['Content-Type'];

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });
        return handleResponse(response);
    },

    getAll: async (): Promise<Order[]> => {
        const response = await fetch(`${API_URL}/orders`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    updateStatus: async (id: number, status: string): Promise<Order> => {
        const response = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },
};
