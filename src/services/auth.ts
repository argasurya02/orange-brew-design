import { API_URL, getAuthHeaders, handleResponse } from '../lib/api';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    register: async (name: string, email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        return handleResponse(response);
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};
