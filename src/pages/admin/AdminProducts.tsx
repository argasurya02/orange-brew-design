import { useEffect, useState } from 'react';
import { productService, Product } from '@/services/products';
import { formatRupiah } from '@/lib/utils';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Search } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Food',
        image: '',
        description: ''
    });

    const fetchProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                image: product.image || '',
                description: product.description || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                category: 'Food',
                image: '',
                description: ''
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, {
                    ...formData,
                    price: parseFloat(formData.price)
                });
                toast.success('Product updated');
            } else {
                await productService.create({
                    ...formData,
                    price: parseFloat(formData.price)
                });
                toast.success('Product created');
            }
            setIsDialogOpen(false);
            fetchProducts();
        } catch {
            toast.error('Failed to save product');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await productService.delete(id);
            toast.success('Product deleted');
            fetchProducts();
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
                    <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                    <p className="text-gray-500">Manage your menu items</p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 w-full max-w-sm">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-200">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredProducts.map(product => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium text-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gray-200 overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        {product.name}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-gray-300 text-gray-700">
                                        {product.category}
                                    </span>
                                </TableCell>

                                <TableCell className="text-gray-700">
                                    {formatRupiah(product.price)}
                                </TableCell>

                                <TableCell className="max-w-[200px] truncate text-gray-500 text-sm">
                                    {product.description || '-'}
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 hover:text-blue-600"
                                            onClick={() => handleOpenDialog(product)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 hover:text-red-600"
                                            onClick={() => handleDelete(product.id)}
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
                            {editingProduct ? 'Edit Product' : 'Create Product'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-gray-600">Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-orange-500 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-gray-600">Price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-gray-50 border-gray-300 focus:border-orange-500"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-gray-600">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) =>
                                        setFormData({ ...formData, category: val })
                                    }
                                >
                                    <SelectTrigger className="bg-gray-50 border-gray-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Drink">Drink</SelectItem>
                                        <SelectItem value="Snack">Snack</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-gray-600">Image URL</Label>
                            <Input
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="bg-gray-50 border-gray-300"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-gray-600">Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-gray-50 border-gray-300"
                            />
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

export default AdminProducts;
