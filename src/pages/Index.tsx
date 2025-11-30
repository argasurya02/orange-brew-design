import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { PromoCarousel } from '@/components/PromoCarousel';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('minuman');
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const filteredProducts = products.filter(
    (product) => activeCategory === 'semua' || product.category === activeCategory
  );

  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cart')}
            className="relative"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto space-y-6">
        {/* Promo Carousel */}
        <section>
          <h2 className="text-foreground font-semibold mb-3">Promo Hari Ini</h2>
          <PromoCarousel />
        </section>

        {/* Categories */}
        <section>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-semibold">Rekomendasi</h2>
            <Link to="/menu" className="text-primary text-sm font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
