import { API_URL, handleResponse } from '../lib/api';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image?: string;
    description?: string;
    createdAt: string;
}

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const response = await fetch(`${API_URL}/products`);
        return handleResponse(response);
    },
};
