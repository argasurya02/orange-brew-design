import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User as UserIcon } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-display font-bold mb-6 text-primary">My Account</h1>

            <Card className="bg-card border-border mb-6">
                <CardContent className="flex flex-col items-center pt-6">
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=F3A120&color=fff`} />
                        <AvatarFallback>
                            <UserIcon size={32} />
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="mt-2 px-3 py-1 bg-secondary rounded-full text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                        {user.role}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Profile;
