import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const path = "./src/data/products.json";

let products = [];

const getProducts = async (limit) => {
    try {
        const fileExists = fs.existsSync(path);

        if (fileExists) {
            const fileJson = await fs.promises.readFile(path, "utf-8");
            products = JSON.parse(fileJson) || [];

            if (limit && !isNaN(limit) && limit > 0) {
                return products.slice(0, limit);
            }
        } else {
            products = [];
        }

        return products;
    } catch (error) {
        console.error(`Error reading products: ${error}`);
        throw new Error('Could not get products');
    }
};

const addProduct = async (product) => {
    try {
        await getProducts();

        const { title, description, price, thumbnail, code, stock, category } = product;

        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error('Missing required product fields');
        }

        const newProduct = {
            id: uuidv4(),
            title,
            description,
            price,
            thumbnail: product.thumbnail || null,
            code,
            stock,
            category,
            status: true
        };

        products.push(newProduct);

        await fs.promises.writeFile(path, JSON.stringify(products, null, 2));

        return newProduct;
    } catch (error) {
        console.error(`Error adding product: ${error}`);
        throw new Error('Could not add product');
    }
};

const getProductById = async (id) => {
    try {
        await getProducts();

        const product = products.find((p) => p.id === id);
        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        console.error(`Error getting product by ID: ${error}`);
        throw new Error('Could not get product by ID');
    }
};

const updateProduct = async (id, productData) => {
    try {
        await getProducts();

        const index = products.findIndex((p) => p.id === id);
        if (index === -1) {
            throw new Error('Product not found');
        }

        products[index] = {
            ...products[index],
            ...productData,
        };

        await fs.promises.writeFile(path, JSON.stringify(products, null, 2));

        return products[index];
    } catch (error) {
        console.error(`Error updating product: ${error}`);
        throw new Error('Could not update product');
    }
};

const deleteProduct = async (id) => {
    try {
        await getProducts();

        const initialLength = products.length;
        products = products.filter((p) => p.id !== id);

        if (products.length === initialLength) {
            throw new Error('Product not found');
        }

        await fs.promises.writeFile(path, JSON.stringify(products, null, 2));

        return products;
    } catch (error) {
        console.error(`Error deleting product: ${error}`);
        throw new Error('Could not delete product');
    }
};

export default {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
