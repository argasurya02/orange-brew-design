import { API_URL, getAuthHeaders, handleResponse } from '@/lib/api';

export const paymentService = {
    updateStatus: async (id: string, status: 'PENDING' | 'CONFIRMED' | 'REJECTED') => {
        const response = await fetch(`${API_URL}/payments/${id}/status`, {
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
