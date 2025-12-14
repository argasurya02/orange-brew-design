import { API_URL, getAuthHeaders, handleResponse } from '../lib/api';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await fetch(`${API_URL}/auth/users`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};
