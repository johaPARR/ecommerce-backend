import fs from 'fs';
import path from 'path';

export default class ProductManager {
    constructor(filePath) {
        this.path = filePath; // Ruta al archivo src/data/products.json
    }

    // Leer todos los productos
    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) {
                return [];
            }
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer productos:", error);
            return [];
        }
    }

    // Agregar un producto
    async addProduct(product) {
        const products = await this.getProducts();
        
        const newProduct = {
            id: Date.now(), // Generación simple de ID único
            ...product,
            status: product.status ?? true
        };

        products.push(newProduct);
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }
}