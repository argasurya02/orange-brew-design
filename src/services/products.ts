import { API_URL, getAuthHeaders, handleResponse } from '@/lib/api';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image?: string;
    description?: string;
    createdAt?: string; // Add this if needed for display
}

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const response = await fetch(`${API_URL}/products`);
        return handleResponse(response);
    },

    create: async (data: Omit<Product, 'id'>): Promise<Product> => {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    update: async (id: number, data: Partial<Product>): Promise<Product> => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};
