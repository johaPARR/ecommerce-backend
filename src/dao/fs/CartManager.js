import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    // Leer todos los carritos del archivo JSON
    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) {
                return [];
            }
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer carritos:", error);
            return [];
        }
    }

    // Crear un nuevo carrito con ID autogenerado
    async addCart() {
        const carts = await this.getCarts();
        const newCart = { 
            id: Date.now(), // Generación simple de ID único
            products: [] 
        };
        
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }
}