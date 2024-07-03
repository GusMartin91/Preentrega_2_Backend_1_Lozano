import { Router } from 'express';
import cartManager from '../managers/cartManager.js';

const router = Router();

router.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ status: 'success', data: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: error.message });
    }
});

router.get('/carts/:id', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.id);
        if (!cart) {
            return res.status(404).json({ status: 'error', msg: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: error.message });
    }
});

router.post('/carts', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json({ status: 'success', data: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', msg: error.message });
    }
});

router.post('/carts/:id/products', async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ status: 'error', msg: 'Missing required field: productId' });
        }

        const updatedCart = await cartManager.addProductToCart(req.params.id, productId);

        res.status(200).json({ status: 'success', data: updatedCart });
    } catch (error) {
        if (error.message === 'Cart not found') {
            res.status(404).json({ status: 'error', msg: error.message });
        } else {
            res.status(500).json({ status: 'error', msg: error.message });
        }
    }
});

router.delete('/carts/:id/products/:productId', async (req, res) => {
    try {
        const updatedCart = await cartManager.removeProductFromCart(req.params.id, req.params.productId);
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', msg: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', data: updatedCart });
    } catch (error) {
        if (error.message === 'Cart not found') {
            res.status(404).json({ status: 'error', msg: error.message });
        } else {
            res.status(500).json({ status: 'error', msg: error.message });
        }
    }
});

export default router;
