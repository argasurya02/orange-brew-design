import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, User as UserIcon, Edit2, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    if (!user) return null;

    const handleEditClick = () => {
        setFormData({
            name: user.name,
            email: user.email
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        updateUser({
            name: formData.name,
            email: formData.email
        });
        toast.success('Profile updated');
        setIsEditing(false);
    };

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

                    {!isEditing ? (
                        <>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="mt-2 px-3 py-1 bg-secondary rounded-full text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                                {user.role}
                            </div>
                        </>
                    ) : (
                        <div className="w-full space-y-3 mt-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-background border-input"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-background border-input"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4">
                {!isEditing ? (
                    <Button variant="outline" className="w-full justify-start" onClick={handleEditClick}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>
                )}

                <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Profile;
