import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, category, image, description } = req.body;
        const product = await prisma.product.create({
            data: { name, price: Number(price), category, image, description }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, category, image, description } = req.body;
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, price: Number(price), category, image, description }
        });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: Number(id) } });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product', error });
    }
};
