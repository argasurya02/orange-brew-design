import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { items, updateQuantity, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate('/')}>Browse Menu</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl pb-40 sm:pb-28">
            {/* ↑ padding bawah supaya konten tidak ketutup checkout bar */}

            <h1 className="text-2xl font-display font-bold mb-6 text-primary">
                Your Cart
            </h1>

            <div className="space-y-4">
                {items.map((item) => (
                    <Card key={item.id} className="bg-card border-none shadow-soft">
                        <CardContent className="p-4 flex gap-4 items-center">
                            <div className="h-16 w-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image || 'https://placehold.co/100x100?text=Food'}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-foreground">{item.name}</h3>
                                <p className="text-primary font-semibold">
                                    {formatRupiah(item.price)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full hover:bg-background"
                                    onClick={() => updateQuantity(item.id, -1)}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>

                                <span className="font-bold w-6 text-center text-sm">
                                    {item.quantity}
                                </span>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full hover:bg-background"
                                    onClick={() => updateQuantity(item.id, 1)}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-muted-foreground hover:text-red-500"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ✅ CHECKOUT BAR */}
            <div className="fixed left-0 right-0 bottom-16 sm:bottom-0 z-40
                            bg-background/80 backdrop-blur border-t border-border p-4">
                {/* ↑ bottom-16 = naik dari navbar mobile */}

                <div className="container max-w-2xl mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                            {formatRupiah(totalPrice)}
                        </span>
                    </div>

                    <Button
                        className="w-full text-lg h-12 font-bold"
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
