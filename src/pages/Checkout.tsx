import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

type PaymentMethod = 'CASH' | 'TRANSFER' | 'QRIS';

const Checkout = () => {
  const { items, totalPrice, orderType, setOrderType, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [receipt, setReceipt] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (orderType === 'DELIVERY' && !address) {
      toast.error('Please enter delivery address');
      return;
    }
    if ((paymentMethod === 'TRANSFER' || paymentMethod === 'QRIS') && !receipt) {
      toast.error('Please upload payment receipt');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      await orderService.create(orderType, orderItems, paymentMethod, receipt || undefined);

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      console.error('Checkout failed', error);
      toast.error(error.message || 'Checkout failed. Please try again.');
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
        <Card className="bg-card border-border shadow-soft">
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
                  className="mt-1 bg-secondary/50 border-transparent focus:border-primary"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-card border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={paymentMethod}
              onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
              className="flex flex-col space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CASH" id="p1" />
                <Label htmlFor="p1">Cash / Pay at Counter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TRANSFER" id="p2" />
                <div className="flex flex-col">
                  <Label htmlFor="p2">Bank Transfer</Label>
                  <span className="text-xs text-muted-foreground">BCA 1234567890 a.n Orange Brew</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="QRIS" id="p3" />
                <div className="flex flex-col">
                  <Label htmlFor="p3">QRIS</Label>
                  <span className="text-xs text-muted-foreground">Scan QR code provided</span>
                </div>
              </div>
            </RadioGroup>

            {(paymentMethod === 'TRANSFER' || paymentMethod === 'QRIS') && (
              <div className="mt-6 border-t border-border pt-4">
                {paymentMethod === 'QRIS' && (
                  <div className="mb-4 flex justify-center">
                    {/* Placeholder QRIS Image */}
                    <div className="w-48 h-48 bg-white p-2 rounded-lg">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OrangeBrewPayment" alt="QRIS" className="w-full h-full" />
                    </div>
                  </div>
                )}
                <Label htmlFor="receipt">Upload Payment Receipt</Label>
                <div className="mt-2">
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="receipt" className="flex items-center justify-center w-full h-32 px-4 transition bg-secondary/30 border-2 border-dashed border-muted-foreground/30 rounded-xl cursor-pointer hover:border-primary hover:bg-secondary/50 gap-2">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{receipt ? receipt.name : 'Click to upload receipt'}</span>
                  </Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-card border-border shadow-soft">
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
          {paymentMethod === 'CASH' ? 'Place Order' : 'Submit Payment'}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
