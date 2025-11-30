import { Coffee, UtensilsCrossed, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories = [
  { id: 'minuman' as Category, label: 'Minuman', icon: Coffee },
  { id: 'makanan' as Category, label: 'Makanan', icon: UtensilsCrossed },
  { id: 'snack' as Category, label: 'Snack', icon: Cookie },
];

export const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={activeCategory === cat.id ? 'categoryActive' : 'category'}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap",
            activeCategory === cat.id && "shadow-glow"
          )}
          onClick={() => onCategoryChange(cat.id)}
        >
          <cat.icon className="h-4 w-4" />
          <span>{cat.label}</span>
        </Button>
      ))}
    </div>
  );
};
