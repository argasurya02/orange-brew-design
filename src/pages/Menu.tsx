import { useEffect, useState } from 'react';
import { productService, Product } from '@/services/products';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const { orderType } = useCart();

  const categories = ['All', 'Drink', 'Food', 'Snack'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === 'All' || product.category === filter; // Assumes backend category matches 'Drink', 'Food' etc.
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="container mx-auto pb-24 px-4 pt-6">
      {/* Promo Banner */}
      <div className="w-full h-40 md:h-64 rounded-2xl bg-gradient-to-r from-primary/80 to-accent/80 mb-8 flex items-center px-6 md:px-12 relative overflow-hidden">
        <div className="relative z-10 text-white">
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-2">Morning Brew?</h2>
          <p className="opacity-90 max-w-sm">Get 20% off on all espresso drinks before 10 AM. Order for {orderType} now!</p>
        </div>
        {/* Abstract Circle */}
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="mb-6 space-y-4 sticky top-[64px] z-30 bg-background/95 backdrop-blur py-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search coffee, food..."
            className="pl-10 h-12 bg-secondary/30 border-none rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={filter === cat ? 'default' : 'secondary'}
              className={`px-6 py-2 rounded-full cursor-pointer text-sm whitespace-nowrap transition-all ${filter === cat ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-secondary/80'}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default Menu;
