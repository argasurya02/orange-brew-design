import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, Home, Coffee, ClipboardList } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();
    const { items } = useCart();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-40 hidden md:block">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-display font-bold text-primary tracking-tight">
                        Orange Brew
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>Menu</Link>
                        {user && (
                            <Link to="/orders" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/orders') ? 'text-primary' : 'text-muted-foreground'}`}>Orders</Link>
                        )}
                        {user && (user.role === 'ADMIN' || user.role === 'CASHIER') && (
                            <Link to="/admin/orders" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/orders') ? 'text-primary' : 'text-muted-foreground'}`}>Manage</Link>
                        )}

                        <div className="flex items-center gap-4 border-l pl-4 ml-2 border-border">
                            <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors">
                                <ShoppingBag className="h-5 w-5" />
                                {items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <Link to="/account">
                                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                </Link>
                            ) : (
                                <Button asChild size="sm" className="rounded-full">
                                    <Link to="/login">Login</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-50 pb-safe">
                <div className="flex justify-around items-center h-16 px-2">
                    <Link to="/" className={`flex flex-col items-center gap-1 p-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
                        <Home className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    {user && (
                        <Link to="/orders" className={`flex flex-col items-center gap-1 p-2 ${isActive('/orders') ? 'text-primary' : 'text-muted-foreground'}`}>
                            <ClipboardList className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Orders</span>
                        </Link>
                    )}

                    <Link to="/cart" className={`flex flex-col items-center gap-1 p-2 ${isActive('/cart') ? 'text-primary' : 'text-muted-foreground'} relative`}>
                        <div className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] leading-none px-1 py-0.5 rounded-full min-w-[12px] text-center">
                                    {items.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium">Cart</span>
                    </Link>

                    {user ? (
                        <Link to="/account" className={`flex flex-col items-center gap-1 p-2 ${isActive('/account') ? 'text-primary' : 'text-muted-foreground'}`}>
                            <User className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Account</span>
                        </Link>
                    ) : (
                        <Link to="/login" className={`flex flex-col items-center gap-1 p-2 ${isActive('/login') ? 'text-primary' : 'text-muted-foreground'}`}>
                            <User className="h-5 w-5" />
                            <span className="text-[10px] font-medium">Login</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile Top Bar (Logo Only) */}
            <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border h-14 flex items-center justify-center px-4">
                <Link to="/" className="text-xl font-display font-bold text-primary">Orange Brew</Link>
                {(user?.role === 'ADMIN' || user?.role === 'CASHIER') && (
                    <Link to="/admin/orders" className="absolute right-4 text-xs font-bold bg-secondary px-2 py-1 rounded">Admin</Link>
                )}
            </div>
        </>
    );
};

export default Navbar;
