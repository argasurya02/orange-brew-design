import { useNavigate } from 'react-router-dom';
import { useCart, OrderType } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, ShoppingBag, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const OrderTypeSelection = () => {
    const { setOrderType } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSelect = (type: OrderType) => {
        setOrderType(type);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <h1 className="text-3xl font-display font-bold text-primary mb-2">Orange Brew</h1>
            <p className="text-muted-foreground mb-10 text-center">How would you like to enjoy your order today?</p>

            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                <Card
                    className="cursor-pointer hover:border-primary transition-all border-border bg-card"
                    onClick={() => handleSelect('DINE_IN')}
                >
                    <CardContent className="flex items-center p-6 gap-4">
                        <div className="p-3 bg-secondary rounded-full text-primary">
                            <Utensils size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Dine In</h3>
                            <p className="text-sm text-muted-foreground">Enjoy your meal at our place</p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:border-primary transition-all border-border bg-card"
                    onClick={() => handleSelect('PICKUP')}
                >
                    <CardContent className="flex items-center p-6 gap-4">
                        <div className="p-3 bg-secondary rounded-full text-primary">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Pick Up</h3>
                            <p className="text-sm text-muted-foreground">Order ahead and skip the line</p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:border-primary transition-all border-border bg-card"
                    onClick={() => handleSelect('DELIVERY')}
                >
                    <CardContent className="flex items-center p-6 gap-4">
                        <div className="p-3 bg-secondary rounded-full text-primary">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Delivery</h3>
                            <p className="text-sm text-muted-foreground">We bring the order to you</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderTypeSelection;
