import { Router } from 'express';
import productManager from '../managers/productManager.js';

const router = Router();

router.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts(limit);
        res.status(200).json({ status: 'success', data: products });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: error.message });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', msg: 'Product not found' });
        }
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({ status: 'success', data: newProduct });
    } catch (error) {
        if (error.message === 'Missing required product fields') {
            res.status(400).json({ status: 'error', msg: error.message });
        } else {
            res.status(500).json({ status: 'error', msg: error.message });
        }
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', msg: 'Product not found' });
        }
        res.status(200).json({ status: 'success', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProducts = await productManager.deleteProduct(req.params.id);
        if (!deletedProducts) {
            return res.status(404).json({ status: 'error', msg: 'Product not found' });
        }
        res.status(204).json({ status: 'success', msg: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: error.message });
    }
});

export default router;