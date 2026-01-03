import { useEffect, useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { format, subDays, eachDayOfInterval, isValid } from 'date-fns';
import { orderService } from '@/services/orders';
import { userService } from '@/services/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
    ShoppingBag,
    Users,
    DollarSign,
    Clock
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
    });


    const [salesData, setSalesData] = useState<{ date: string; total: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await orderService.getAll();
                const users = await userService.getAll();

                setStats({
                    totalOrders: orders.length,
                    pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
                    totalRevenue: orders
                        .filter((o) => o.status !== 'CANCELLED')
                        .reduce((acc, curr) => acc + curr.totalPrice, 0),
                    totalUsers: users.length,
                });

                // Process data for the last 7 days chart
                const today = new Date();
                const last7Days = eachDayOfInterval({
                    start: subDays(today, 6),
                    end: today,
                });

                const chartData = last7Days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayTotal = orders
                        .filter((o) => {
                            const orderDate = isValid(new Date(o.createdAt)) ? format(new Date(o.createdAt), 'yyyy-MM-dd') : '';
                            return orderDate === dateStr && o.status !== 'CANCELLED';
                        })
                        .reduce((acc, curr) => acc + curr.totalPrice, 0);

                    return {
                        date: format(day, 'dd MMM'),
                        total: dayTotal,
                    };
                });

                setSalesData(chartData);
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
            value: formatRupiah(stats.totalRevenue),
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

            {/* Sales Chart Section */}
            <Card className="bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                        Sales Trend (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pl-0">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748B"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748B"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatRupiah(value)}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1E293B' }}
                                    formatter={(value: any) => [formatRupiah(value), 'Revenue']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#4F46E5"
                                    strokeWidth={3}
                                    dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
