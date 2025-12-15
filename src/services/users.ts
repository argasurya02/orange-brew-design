import { API_URL, getAuthHeaders, handleResponse } from '@/lib/api';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'CASHIER';
    createdAt: string;
}

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await fetch(`${API_URL}/auth/users`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    create: async (data: Partial<User> & { password: string }): Promise<User> => {
        const response = await fetch(`${API_URL}/auth/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updateRole: async (id: number, role: string): Promise<User> => {
        const response = await fetch(`${API_URL}/auth/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ role }),
        });
        return handleResponse(response);
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/auth/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};
