import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemCard = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="flex gap-4 bg-card rounded-2xl p-4 animate-fade-in">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 rounded-xl object-cover"
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{item.name}</h3>
          <p className="text-primary font-bold text-sm">{formatPrice(item.price)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="iconSm"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-8 w-8 rounded-lg"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-foreground w-6 text-center">{item.quantity}</span>
            <Button
              variant="icon"
              size="iconSm"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-8 w-8 rounded-lg"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => removeFromCart(item.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
