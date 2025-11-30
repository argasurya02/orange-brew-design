import { Product } from '@/types';

import coffeeLatte from '@/assets/coffee-latte.jpg';
import caramelMacchiato from '@/assets/caramel-macchiato.jpg';
import hotChocolate from '@/assets/hot-chocolate.jpg';
import matchaLatte from '@/assets/matcha-latte.jpg';
import spaghettiCreamy from '@/assets/spaghetti-creamy.jpg';
import friedChicken from '@/assets/fried-chicken.jpg';
import nasiGoreng from '@/assets/nasi-goreng.jpg';
import frenchFries from '@/assets/french-fries.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Coffee Latte',
    price: 25000,
    image: coffeeLatte,
    category: 'minuman',
    description: 'Espresso dengan susu segar'
  },
  {
    id: '2',
    name: 'Caramel Macchiato',
    price: 32000,
    image: caramelMacchiato,
    category: 'minuman',
    description: 'Latte dengan sirup caramel'
  },
  {
    id: '3',
    name: 'Hot Chocolate',
    price: 28000,
    image: hotChocolate,
    category: 'minuman',
    description: 'Coklat panas dengan marshmallow'
  },
  {
    id: '4',
    name: 'Matcha Latte',
    price: 30000,
    image: matchaLatte,
    category: 'minuman',
    description: 'Green tea latte premium'
  },
  {
    id: '5',
    name: 'Spaghetti Creamy',
    price: 45000,
    image: spaghettiCreamy,
    category: 'makanan',
    description: 'Pasta dengan saus keju creamy'
  },
  {
    id: '6',
    name: 'Fried Chicken',
    price: 35000,
    image: friedChicken,
    category: 'makanan',
    description: 'Ayam goreng crispy'
  },
  {
    id: '7',
    name: 'Nasi Goreng Special',
    price: 38000,
    image: nasiGoreng,
    category: 'makanan',
    description: 'Nasi goreng dengan telur mata sapi'
  },
  {
    id: '8',
    name: 'French Fries',
    price: 22000,
    image: frenchFries,
    category: 'snack',
    description: 'Kentang goreng dengan saus keju'
  },
];
