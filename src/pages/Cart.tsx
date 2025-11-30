import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemCard } from '@/components/CartItem';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useCart();

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const subtotal = getCartTotal();
  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-foreground font-bold text-xl">Keranjang</h1>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center mb-4">
              Keranjang kamu masih kosong
            </p>
            <Button onClick={() => navigate('/menu')}>Lihat Menu</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Summary */}
      {cart.length > 0 && (
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
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
