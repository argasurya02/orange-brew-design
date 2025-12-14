import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderTypeSelection from './pages/OrderTypeSelection';
import Profile from './pages/Profile';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <div className="dark min-h-screen flex flex-col bg-background text-foreground font-sans antialiased pb-16 md:pb-0">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Menu />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/order-type" element={<OrderTypeSelection />} />

                  {/* General User Routes (some might be public but typically cart/checkout need logic) */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<Checkout />} />

                  {/* User Routes */}
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/account" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />

                  {/* Admin/Cashier Routes */}
                  <Route path="/admin/orders" element={
                    <ProtectedRoute roles={['ADMIN', 'CASHIER']}>
                      <AdminOrders />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/users" element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
