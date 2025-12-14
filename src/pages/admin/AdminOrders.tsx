import { useEffect, useState } from 'react';
import { orderService, Order } from '@/services/orders';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAuthHeaders, API_URL, handleResponse } from '@/lib/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'CASHIER')) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getAll();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ status: newStatus })
            });
            await handleResponse(response);
            // Refresh or update locally
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500';
            case 'COOKING': return 'bg-orange-500';
            case 'READY': return 'bg-green-500';
            case 'COMPLETED': return 'bg-blue-500';
            case 'CANCELLED': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-10 w-10 text-orange-500" /></div>;

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Order Management ({orders.length})</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orders.map((order: any) => (
                    <Card key={order.id} className="border-l-4" style={{ borderLeftColor: order.status === 'PENDING' ? '#eab308' : '#e5e7eb' }}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50">
                            <div>
                                <CardTitle className="text-lg">#{order.id} - {order.user?.name}</CardTitle>
                                <p className="text-xs text-gray-500">{order.user?.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline">{order.orderType}</Badge>
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-4">
                            <div className="space-y-1 mb-4">
                                {order.orderItems?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.product?.name}</span>
                                        <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between font-bold border-t pt-2">
                                <span>Total Price:</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 pt-4 flex gap-2">
                            <Select onValueChange={(val) => updateStatus(order.id, val)} defaultValue={order.status}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="COOKING">Cooking</SelectItem>
                                    <SelectItem value="READY">Ready</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
