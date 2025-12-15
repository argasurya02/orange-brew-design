import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orderService } from '@/services/orders';
import { userService } from '@/services/users';
import { ShoppingBag, Clock, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await orderService.getAll();
                const users = await userService.getAll();

                const totalOrders = orders.length;
                const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
                const totalRevenue = orders
                    .filter(o => o.status !== 'CANCELLED')
                    .reduce((acc, curr) => acc + curr.totalPrice, 0);
                const totalUsers = users.length;

                setStats({ totalOrders, pendingOrders, totalRevenue, totalUsers });
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            }
        };

        fetchData();
    }, []);

    const cards = [
        { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag className="h-4 w-4 text-blue-600" />, color: 'bg-blue-50' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: <Clock className="h-4 w-4 text-orange-600" />, color: 'bg-orange-50' },
        { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign className="h-4 w-4 text-green-600" />, color: 'bg-green-50' },
        { title: 'Total Users', value: stats.totalUsers, icon: <Users className="h-4 w-4 text-purple-600" />, color: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your business performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <Card key={index} className="border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${card.color}`}>
                                {card.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Can add charts or recent orders table here */}
        </div>
    );
};

export default Dashboard;
