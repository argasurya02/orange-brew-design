import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Mail, Shield, Save } from 'lucide-react';

const ManageProfile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API delay
        setTimeout(() => {
            updateUser({
                name: formData.name,
                email: formData.email
            });
            toast.success('Profile updated successfully');
        }, 800);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-500">Manage your account information.</p>
            </div>

            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-9 border-gray-300"
                                    placeholder="Your name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-9 border-gray-300"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role (Read Only)</Label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="role"
                                    value={formData.role}
                                    readOnly
                                    disabled
                                    className="pl-9 bg-gray-50 text-gray-500 border-gray-200"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 rounded-b-xl border-t border-gray-100 flex justify-end py-3">
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default ManageProfile;
