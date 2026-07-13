import { Router } from 'express';
import ProductManager from '../dao/db/ProductManager.db.js';
import CartManager from '../dao/db/CartManager.db.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Vista principal de productos (con datos de BD)
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const result = await productManager.getProducts(limit, page);

        res.render('products', {
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            title: 'Catálogo de Perfumes',
            style: 'styles.css'
        });
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }
});

// Vista de detalle de un producto
router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render('productDetail', {
            product,
            title: product.title,
            style: 'styles.css'
        });
    } catch (error) {
        res.status(500).send("Error al cargar el producto");
    }
});

// Vista de un carrito específico (con populate)
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render('cart', {
            cart,
            title: 'Mi Carrito',
            style: 'styles.css'
        });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

// Vista de productos en tiempo real (los datos llegan por Socket.io en el front)
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        title: 'Productos en Tiempo Real',
        style: 'styles.css'
    });
});

export default router;