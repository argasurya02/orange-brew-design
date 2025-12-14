import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Upsert Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@orangebrew.com' },
        update: {},
        create: {
            email: 'admin@orangebrew.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Upsert Cashier
    const cashier = await prisma.user.upsert({
        where: { email: 'cashier@orangebrew.com' },
        update: {},
        create: {
            email: 'cashier@orangebrew.com',
            name: 'Cashier User',
            password: hashedPassword,
            role: 'CASHIER',
        },
    });

    // Upsert User
    const user = await prisma.user.upsert({
        where: { email: 'user@orangebrew.com' },
        update: {},
        create: {
            email: 'user@orangebrew.com',
            name: 'Regular User',
            password: hashedPassword,
            role: 'USER',
        },
    });

    console.log({ admin, cashier, user });

    const products = [
        {
            name: 'Orange Cold Brew',
            price: 4.50,
            category: 'Drink',
            description: 'Signature cold brew with a hint of fresh orange zest.',
            image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7faaf?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Caramel Macchiato',
            price: 5.00,
            category: 'Drink',
            description: 'Espresso coffee with vanilla and caramel drizzle.',
            image: 'https://images.unsplash.com/photo-1485808191679-5f8c7c835569?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Iced Matcha Latte',
            price: 5.50,
            category: 'Drink',
            description: 'Premium matcha green tea with milk and ice.',
            image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3145?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Espresso Tonic',
            price: 4.00,
            category: 'Drink',
            description: 'Refreshing mix of tonic water and double shot espresso.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Classic Croissant',
            price: 3.50,
            category: 'Food',
            description: 'Buttery, flaky, and freshly baked croissant.',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Avocado Toast',
            price: 7.00,
            category: 'Food',
            description: 'Sourdough toast topped with mashed avocado and seasoning.',
            image: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Blueberry Muffin',
            price: 3.00,
            category: 'Food',
            description: 'Soft muffin packed with fresh blueberries.',
            image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Bagel with Cream Cheese',
            price: 4.00,
            category: 'Food',
            description: 'Toasted bagel served with plain cream cheese.',
            image: 'https://images.unsplash.com/photo-1585478684894-a36d03097552?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Lemon Tart',
            price: 4.50,
            category: 'Food',
            description: 'Zesty lemon curd in a crisp pastry shell.',
            image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Chocolate Chip Cookie',
            price: 2.50,
            category: 'Food',
            description: 'Classic soft and chewy chocolate chip cookie.',
            image: 'https://images.unsplash.com/photo-1499636138143-bd649043ea52?auto=format&fit=crop&q=80&w=800',
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('Seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
