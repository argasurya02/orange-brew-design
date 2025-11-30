import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Ditambahkan ke keranjang',
      description: `${product.name} berhasil ditambahkan`,
    });
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden animate-fade-in group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
          <Button
            variant="icon"
            size="iconSm"
            onClick={handleAddToCart}
            className="h-7 w-7"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
