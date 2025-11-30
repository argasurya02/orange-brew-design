import { Order } from '@/types';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'selesai':
        return 'bg-success/20 text-success';
      case 'diproses':
        return 'bg-primary/20 text-primary';
      case 'dibatalkan':
        return 'bg-destructive/20 text-destructive';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'selesai':
        return 'Selesai';
      case 'diproses':
        return 'Diproses';
      case 'dibatalkan':
        return 'Dibatalkan';
    }
  };

  return (
    <div
      className="bg-card rounded-2xl p-4 animate-fade-in cursor-pointer hover:bg-card/80 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground text-sm">#{order.id}</span>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            getStatusColor(order.status)
          )}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground font-semibold">{formatPrice(order.total)}</p>
          <p className="text-muted-foreground text-sm">{order.date}</p>
        </div>
        <span className="text-muted-foreground text-sm capitalize">
          {order.deliveryType === 'dine-in' ? 'Makan di Tempat' : 'Delivery'}
        </span>
      </div>
    </div>
  );
};
