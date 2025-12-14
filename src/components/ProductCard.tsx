import { Product } from '@/services/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [clicked, setClicked] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setClicked(true);
    toast.success(`Added ${product.name} to cart`);
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <Card className="flex flex-col h-full bg-card border-none shadow-soft hover:shadow-glow transition-all duration-300 rounded-2xl overflow-hidden group">
      <div className="relative w-full aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image || 'https://placehold.co/600x400?text=Food'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Food';
          }}
        />
        <Badge className="absolute top-2 left-2 bg-black/50 backdrop-blur text-white border-none text-xs">
          {product.category}
        </Badge>
      </div>

      <CardContent className="flex-grow p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-lg leading-tight mb-1 text-foreground line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-lg text-primary">${product.price.toFixed(2)}</span>
          <Button
            size="icon"
            className={`rounded-full shadow-lg ${clicked ? 'scale-90' : 'scale-100'} transition-transform`}
            onClick={handleAddToCart}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
