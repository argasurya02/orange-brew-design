import { useEffect, useState } from 'react';
import { userService, User } from '@/services/users';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });

    const fetchUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'USER'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.updateRole(editingUser.id, formData.role);
                toast.success('User updated');
            } else {
                if (!formData.password) return toast.error('Password is required');
                await userService.create(formData as any);
                toast.success('User created');
            }
            setIsDialogOpen(false);
            fetchUsers();
        } catch {
            toast.error('Failed to save user');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this user?')) return;
        try {
            await userService.delete(id);
            toast.success('User deleted');
            fetchUsers();
        } catch {
            toast.error('Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                    <p className="text-gray-500">Manage system users and access</p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            {/* Table */}
            <div className="bg-gray-100 rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-200">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium text-gray-800">
                                    {user.name}
                                </TableCell>

                                <TableCell className="text-gray-600">
                                    {user.email}
                                </TableCell>

                                <TableCell>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${user.role === 'ADMIN'
                                                ? 'bg-purple-200 text-purple-800'
                                                : user.role === 'CASHIER'
                                                    ? 'bg-blue-200 text-blue-800'
                                                    : 'bg-gray-300 text-gray-700'
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </TableCell>

                                <TableCell className="text-gray-500 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 hover:text-blue-600"
                                            onClick={() => handleOpenDialog(user)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 hover:text-red-600"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-gray-100 border border-gray-300 text-gray-800">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Edit User' : 'Create User'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-gray-600">Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!!editingUser}
                                className="bg-gray-50 border-gray-300 text-gray-800"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-gray-600">Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!!editingUser}
                                className="bg-gray-50 border-gray-300 text-gray-800"
                                required
                            />
                        </div>

                        {!editingUser && (
                            <div className="grid gap-2">
                                <Label className="text-gray-600">Password</Label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-gray-50 border-gray-300"
                                    required
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label className="text-gray-600">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(val) =>
                                    setFormData({ ...formData, role: val })
                                }
                            >
                                <SelectTrigger className="bg-gray-50 border-gray-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="CASHIER">Cashier</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="border-gray-400 text-gray-600 hover:bg-gray-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUsers;
