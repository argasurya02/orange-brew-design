import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

const Account = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Edit Profil', action: () => {} },
    { icon: Settings, label: 'Pengaturan', action: () => {} },
    { icon: HelpCircle, label: 'Bantuan', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-foreground font-bold text-xl">Akun</h1>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 flex items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-foreground font-bold text-lg">Guest User</h2>
            <p className="text-muted-foreground text-sm">guest@example.com</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Login Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/login')}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Login / Daftar
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Account;
