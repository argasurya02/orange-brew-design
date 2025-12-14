import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, totalPrice, orderType, setOrderType, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (orderType === 'DELIVERY' && !address) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      // Note: Ideally we send address to backend, but Order model might not have it yet.
      // For now, we assume the backend just takes type and items.
      await orderService.create(orderType, orderItems);

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Back to Menu</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl pb-24">
      <h1 className="text-2xl font-display font-bold mb-6 text-primary">Checkout</h1>

      <div className="space-y-6">
        {/* Order Type */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Order Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={orderType}
              onValueChange={(val) => setOrderType(val as any)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DINE_IN" id="r1" />
                <Label htmlFor="r1">Dine In</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PICKUP" id="r2" />
                <Label htmlFor="r2">Pick Up</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DELIVERY" id="r3" />
                <Label htmlFor="r3">Delivery</Label>
              </div>
            </RadioGroup>

            {orderType === 'DELIVERY' && (
              <div className="mt-4">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-4 flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full text-lg h-12 font-bold"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          Pay Now
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
