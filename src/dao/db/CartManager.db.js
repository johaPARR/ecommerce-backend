import Cart from '../../models/carts.model.js';

export default class CartManager {
    // Obtener carrito por ID con los productos "poblados"
    async getCartById(cid) {
        return await Cart.findById(cid).populate('products.product');
    }

    // Crear un nuevo carrito vacío
    async createCart() {
        return await Cart.create({ products: [] });
    }

    // Agregar producto al carrito (si ya existe, incrementa cantidad)
    async addProductToCart(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return await this.getCartById(cid);
    }

    // Eliminar un producto puntual del carrito
    async removeProductFromCart(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        await cart.save();
        return await this.getCartById(cid);
    }

    // Actualizar todos los productos del carrito (reemplaza el array completo)
    // products debe venir como [{ product: id, quantity: n }, ...]
    async updateCart(cid, products) {
        const cart = await Cart.findByIdAndUpdate(
            cid,
            { products },
            { new: true, runValidators: true }
        );

        if (!cart) return null;
        return await this.getCartById(cid);
    }

    // Actualizar únicamente la cantidad de un producto puntual
    async updateProductQuantity(cid, pid, quantity) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) return null;

        cart.products[productIndex].quantity = quantity;

        await cart.save();
        return await this.getCartById(cid);
    }

    // Vaciar el carrito completo
    async clearCart(cid) {
        const cart = await Cart.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        );

        if (!cart) return null;
        return cart;
    }
}