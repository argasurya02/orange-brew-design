import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatRupiah } from '@/lib/utils';
import { orderService, Order } from '@/services/orders';
import { paymentService } from '@/services/payments';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:3000'; // Hardcoded for now, should be from env/lib

const AdminPayments = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<Order['payment'] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchPayments = async () => {
        try {
            const data = await orderService.getAll();
            // Filter only orders that have payment info (and implicitly, filter out cancelled if needed, but user wants all payments)
            // Payment might be null for old orders or different flow, so filter
            const ordersWithPayment = data.filter(o => o.payment);
            setOrders(ordersWithPayment);
        } catch (error) {
            toast.error('Failed to fetch payments');
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filtered = orders.filter(
            (o) =>
                o.id.toString().includes(lowerSearch) ||
                o.user.name.toLowerCase().includes(lowerSearch)
        );
        setFilteredOrders(filtered);
    }, [search, orders]);

    const handleViewProof = (payment: NonNullable<Order['payment']>) => {
        setSelectedPayment(payment);
        setIsDialogOpen(true);
    };

    const handleStatusUpdate = async (id: string, newStatus: 'CONFIRMED' | 'REJECTED') => {
        try {
            await paymentService.updateStatus(id, newStatus);
            toast.success(`Payment ${newStatus === 'CONFIRMED' ? 'Verified' : 'Rejected'}`);
            fetchPayments();
            setIsDialogOpen(false); // Close if open
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) { // Map backend PENDING/CONFIRMED/REJECTED to UI
            case 'CONFIRMED':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>; // "Paid" in UI
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-500">Manage order payments and verifications.</p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-300 shadow-sm">
                <Search className="text-gray-500" size={20} />
                <Input
                    placeholder="Search by Order ID or Customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-gray-400"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-900">Order ID</TableHead>
                            <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                            <TableHead className="font-semibold text-gray-900">Method</TableHead>
                            <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                            <TableHead className="font-semibold text-gray-900">Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-900">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>{order.user.name}</TableCell>
                                    <TableCell className="capitalize">{order.payment!.method.toLowerCase()}</TableCell>
                                    <TableCell>{formatRupiah(order.payment!.amount)}</TableCell>
                                    <TableCell>{getStatusBadge(order.payment!.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewProof(order.payment!)}
                                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                        >
                                            <Eye size={16} className="mr-2" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                        <DialogDescription>Verify payment proof for Order #{selectedPayment?.id}</DialogDescription>
                    </DialogHeader>

                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                                {selectedPayment.receiptUrl ? (
                                    <img
                                        src={`${API_BASE_URL}${selectedPayment.receiptUrl}`}
                                        alt="Payment Proof"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <p className="text-gray-400 text-sm">No receipt uploaded (Cash/Auto)</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Amount</p>
                                    <p className="font-semibold">{formatRupiah(selectedPayment.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Method</p>
                                    <p className="font-semibold capitalize">{selectedPayment.method.toLowerCase()}</p>
                                </div>
                            </div>

                            {user?.role === 'ADMIN' || user?.role === 'CASHIER' ? (
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={() => handleStatusUpdate(selectedPayment.id, 'REJECTED')}
                                    >
                                        <XCircle size={16} className="mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusUpdate(selectedPayment.id, 'CONFIRMED')}
                                    >
                                        <CheckCircle size={16} className="mr-2" />
                                        Verify Paid
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPayments;
