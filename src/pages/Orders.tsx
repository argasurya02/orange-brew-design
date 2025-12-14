import { useEffect, useState } from 'react';
import { orderService, Order } from '@/services/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Clock, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'COOKING': return <ChefHat className="h-4 w-4" />;
      case 'READY': return <Package className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'COOKING': return 'bg-orange-500/20 text-orange-500 border-orange-500/20';
      case 'READY': return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'CANCELLED': return 'bg-red-500/20 text-red-500 border-red-500/20';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  if (loading) return <div className="flex justify-center p-10 min-h-screen items-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4 pb-24">
      <h1 className="text-2xl font-display font-bold mb-6 text-primary">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 px-6">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
          <Button onClick={() => navigate('/')}>Start Ordering</Button>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {orders.map((order) => (
            <Card key={order.id} className="bg-card border-none shadow-soft overflow-hidden">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 bg-secondary/30 gap-2">
                <div>
                  <CardTitle className="text-base font-semibold">Order #{order.id}</CardTitle>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Badge variant="outline" className="text-xs border-primary/20 bg-primary/10 text-primary whitespace-nowrap">{order.orderType}</Badge>
                  <Badge className={`flex items-center gap-1 text-xs whitespace-nowrap ${getStatusColor(order.status)} hover:bg-opacity-100`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {order.orderItems?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                      <div className="flex gap-2 items-center">
                        <span className="bg-secondary rounded px-2 py-0.5 text-xs font-bold text-muted-foreground">{item.quantity}x</span>
                        <span className="text-foreground">{item.product?.name || 'Item'}</span>
                      </div>
                      <span className="text-muted-foreground">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
