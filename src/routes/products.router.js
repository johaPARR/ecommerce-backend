import { Router } from 'express';
import ProductManager from '../dao/db/ProductManager.db.js';

const router = Router();
const productManager = new ProductManager();

// GET /api/products - Listar productos con paginación, filtro y orden
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;

        const result = await productManager.getProducts(limit, page, query, sort);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener productos de la BD" });
    }
});

// GET /api/products/:pid - Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener el producto" });
    }
});

// POST /api/products - Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);

        // --- INTEGRACIÓN CON WEBSOCKETS ---
        const io = req.app.get('socketio');
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts.docs);
        // ------------------------------------

        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al crear producto" });
    }
});

// PUT /api/products/:pid - Actualizar producto existente (no modifica el ID)
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productManager.updateProduct(pid, req.body);

        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        const io = req.app.get('socketio');
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts.docs);

        res.json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al actualizar producto" });
    }
});

// DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(pid);

        if (!deletedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        const io = req.app.get('socketio');
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts.docs);

        res.json({ status: "success", payload: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar producto" });
    }
});

export default router;