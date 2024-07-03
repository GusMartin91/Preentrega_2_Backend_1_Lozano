import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const path = "./src/data/carts.json";

let carts = [];

const getCarts = async () => {
    try {
        const fileExists = fs.existsSync(path);
        if (!fileExists) {
            await fs.promises.writeFile(path, JSON.stringify([]));
            carts = [];
        } else {
            const fileJson = await fs.promises.readFile(path, "utf-8");
            carts = JSON.parse(fileJson) || [];
        }
        return carts;
    } catch (error) {
        console.error(`Error reading carts: ${error}`);
        throw new Error('Could not get carts');
    }
};

const getCartById = async (id) => {
    try {
        await getCarts();
        const cart = carts.find((c) => c.id === id);
        if (!cart) {
            throw new Error('Cart not found');
        }
        return cart;
    } catch (error) {
        console.error(`Error getting cart by ID: ${error}`);
        throw new Error('Could not get cart by ID');
    }
};

const addCart = async () => {
    try {
        await getCarts();
        const newCart = { id: uuidv4(), products: [] };
        carts.push(newCart);
        await fs.promises.writeFile(path, JSON.stringify(carts, null, 2));
        return newCart;
    } catch (error) {
        console.error(`Error adding cart: ${error}`);
        throw new Error('Could not add cart');
    }
};

const addProductToCart = async (cartId, productId) => {
    try {
        await getCarts();
        const cart = carts.find((c) => c.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const productIndex = cart.products.findIndex((p) => p.id === productId);

        if (productIndex === -1) {
            cart.products.push({ id: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await fs.promises.writeFile(path, JSON.stringify(carts, null, 2));
        return cart;
    } catch (error) {
        console.error(`Error adding product to cart: ${error}`);
        throw new Error('Could not add product to cart');
    }
};

const removeProductFromCart = async (cartId, productId) => {
    try {
        await getCarts();
        const cart = carts.find((c) => c.id === cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = cart.products.filter((p) => p.id !== productId);
        await fs.promises.writeFile(path, JSON.stringify(carts, null, 2));
        return cart;
    } catch (error) {
        console.error(`Error removing product from cart: ${error}`);
        throw new Error('Could not remove product from cart');
    }
};

export default {
    getCarts,
    getCartById,
    addCart,
    addProductToCart,
    removeProductFromCart,
};
