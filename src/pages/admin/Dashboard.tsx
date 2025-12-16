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
        totalUsers: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await orderService.getAll();
                const users = await userService.getAll();

                setStats({
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
                    totalRevenue: orders
                        .filter(o => o.status !== 'CANCELLED')
                        .reduce((acc, curr) => acc + curr.totalPrice, 0),
                    totalUsers: users.length,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            }
        };

        fetchData();
    }, []);

    const cards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: <ShoppingBag className="h-4 w-4 text-indigo-600" />,
            bg: 'bg-indigo-50',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: <Clock className="h-4 w-4 text-amber-600" />,
            bg: 'bg-amber-50',
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: <DollarSign className="h-4 w-4 text-emerald-600" />,
            bg: 'bg-emerald-50',
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <Users className="h-4 w-4 text-sky-600" />,
            bg: 'bg-sky-50',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">
                    Dashboard
                </h1>
                <p className="text-slate-500">
                    Overview of your business performance.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <Card
                        key={index}
                        className="bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                {card.icon}
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                {card.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
