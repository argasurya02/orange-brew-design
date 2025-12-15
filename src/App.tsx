import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
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
import AdminLayout from './components/layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Mobile-First User Layout
const UserLayout = () => {
  return (
    <div className="dark min-h-screen flex flex-col bg-background text-foreground font-sans antialiased pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Routes>
              {/* Public & User Routes (Dark Theme) */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/order-type" element={<OrderTypeSelection />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />

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
              </Route>

              {/* Admin Routes (Light Theme, Filament Style) */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['ADMIN', 'CASHIER']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminProducts />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
