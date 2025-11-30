import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type DeliveryType = 'dine-in' | 'delivery';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, addOrder, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('dine-in');
  const [address, setAddress] = useState('');

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const subtotal = getCartTotal();
  const serviceFee = 2000;
  const deliveryFee = deliveryType === 'delivery' ? 10000 : 0;
  const total = subtotal + serviceFee + deliveryFee;

  const handleCheckout = () => {
    if (deliveryType === 'delivery' && !address.trim()) {
      toast({
        title: 'Alamat diperlukan',
        description: 'Silakan masukkan alamat pengiriman',
        variant: 'destructive',
      });
      return;
    }

    const newOrder = {
      id: `ORD${Date.now().toString().slice(-6)}`,
      items: cart,
      total,
      status: 'diproses' as const,
      date: new Date().toISOString().split('T')[0],
      deliveryType,
      address: deliveryType === 'delivery' ? address : undefined,
    };

    addOrder(newOrder);
    toast({
      title: 'Pesanan Berhasil!',
      description: `Order #${newOrder.id} sedang diproses`,
    });
    navigate('/orders');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-foreground font-bold text-xl">Checkout</h1>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto space-y-6">
        {/* Delivery Type */}
        <section className="space-y-3">
          <h2 className="text-foreground font-semibold">Metode Pengambilan</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                deliveryType === 'dine-in'
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              )}
              onClick={() => setDeliveryType('dine-in')}
            >
              <Store className={cn(
                "h-8 w-8",
                deliveryType === 'dine-in' ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "font-medium",
                deliveryType === 'dine-in' ? "text-primary" : "text-foreground"
              )}>
                Makan di Tempat
              </span>
            </button>
            <button
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                deliveryType === 'delivery'
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              )}
              onClick={() => setDeliveryType('delivery')}
            >
              <MapPin className={cn(
                "h-8 w-8",
                deliveryType === 'delivery' ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "font-medium",
                deliveryType === 'delivery' ? "text-primary" : "text-foreground"
              )}>
                Di Antar
              </span>
            </button>
          </div>
        </section>

        {/* Address Input */}
        {deliveryType === 'delivery' && (
          <section className="space-y-3 animate-fade-in">
            <h2 className="text-foreground font-semibold">Alamat Pengiriman</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap..."
              className="w-full bg-secondary rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
            />
          </section>
        )}

        {/* Order Summary */}
        <section className="space-y-3">
          <h2 className="text-foreground font-semibold">Ringkasan Pesanan</h2>
          <div className="bg-card rounded-2xl p-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span className="text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biaya Layanan</span>
            <span className="text-foreground">{formatPrice(serviceFee)}</span>
          </div>
          {deliveryType === 'delivery' && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ongkos Kirim</span>
              <span className="text-foreground">{formatPrice(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-2 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={handleCheckout}>
            Bayar Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
