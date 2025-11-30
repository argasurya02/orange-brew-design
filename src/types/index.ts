export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'minuman' | 'makanan' | 'snack';
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'diproses' | 'selesai' | 'dibatalkan';
  date: string;
  deliveryType: 'dine-in' | 'delivery';
  address?: string;
}

export type Category = 'semua' | 'minuman' | 'makanan' | 'snack';
