import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { orderService } from '@/services/orders';
import { useAuth } from '@/context/AuthContext';
import { formatRupiah } from '@/lib/utils';

const CartDrawer = () => {
    const { items, removeItem, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            setOpen(false);
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const orderItems = items.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            // Defaulting to PICKUP and CASH for now
            await orderService.create('PICKUP', orderItems, 'CASH');
            clearCart();
            setOpen(false);
            navigate('/orders');
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Checkout failed, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                    <SheetDescription>
                        {items.length === 0 ? 'Your cart is empty' : `You have ${items.length} items`}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-8 h-[60vh] overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-4">
                            <div className="flex gap-2">
                                {item.image && <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=Food'; }} />}
                                <div>
                                    <h4 className="font-semibold">{item.name}</h4>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} x {formatRupiah(item.price)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold">{formatRupiah(item.price * item.quantity)}</p>
                                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <SheetFooter className="mt-4 flex-col gap-4 sm:flex-col">
                    <div className="flex justify-between w-full text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatRupiah(totalPrice)}</span>
                    </div>
                    <Button className="w-full" disabled={items.length === 0 || loading} onClick={handleCheckout}>
                        {loading ? 'Processing...' : 'Checkout'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
