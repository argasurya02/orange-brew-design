import { BottomNav } from '@/components/BottomNav';
import { OrderCard } from '@/components/OrderCard';
import { useCart } from '@/context/CartContext';
import { ClipboardList } from 'lucide-react';

const Orders = () => {
  const { orders } = useCart();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-foreground font-bold text-xl">Riwayat Pesanan</h1>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Belum ada pesanan
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
