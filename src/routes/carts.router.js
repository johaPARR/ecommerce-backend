import { Router } from 'express';
import CartManager from '../dao/db/CartManager.db.js';

const router = Router();
const cartManager = new CartManager();

// POST /api/carts - Crear un carrito nuevo
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: "success", payload: newCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el carrito" });
    }
});

// GET /api/carts/:cid - Listar productos de un carrito específico
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: cart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener el carrito" });
    }
});

// POST /api/carts/:cid/products/:pid - Agregar producto al carrito (o incrementar cantidad)
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);

        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: updatedCart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar el producto al carrito" });
    }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar un producto puntual del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);

        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: updatedCart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar el producto del carrito" });
    }
});

// PUT /api/carts/:cid - Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; // [{ product: id, quantity: n }, ...]

        const updatedCart = await cartManager.updateCart(cid, products);

        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: updatedCart.products });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al actualizar el carrito" });
    }
});

// PUT /api/carts/:cid/products/:pid - Actualizar únicamente la cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: "error", message: "La cantidad debe ser un número mayor a 0" });
        }

        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);

        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
        }

        res.json({ status: "success", payload: updatedCart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al actualizar la cantidad" });
    }
});

// DELETE /api/carts/:cid - Vaciar el carrito completo
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartManager.clearCart(cid);

        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", payload: updatedCart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al vaciar el carrito" });
    }
});

export default router;