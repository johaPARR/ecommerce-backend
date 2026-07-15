
import Product from '../../models/products.model.js';

export default class ProductManager {
    // Obtener todos los productos (con paginación, filtro y orden)
    async getProducts(limit = 10, page = 1, query = null, sort = null) {
        const filter = this.buildFilter(query);

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true
        };

        return await Product.paginate(filter, options);
    }

    // Convierte el parámetro "query" en un filtro válido para Mongoose
    // Soporta: "category:masculino" (por campo específico) y "available" (status: true)
    buildFilter(query) {
        if (!query) return {};

        if (query.includes(':')) {
            const [key, value] = query.split(':');
            return { [key]: value };
        }

        if (query === 'available') {
            return { status: true };
        }

        // Si llega un valor suelto, se asume filtro por categoría
        return { category: query };
    }

    // Crear producto en MongoDB
    async addProduct(productData) {
        return await Product.create(productData);
    }

    // Obtener producto por ID
    // .lean() -> mismo motivo que en CartManager.db.js: sin esto, la vista
    // productDetail.handlebars no podía leer product.title/thumbnails/_id
    // porque Handlebars bloquea el acceso a props que no son "own" del
    // objeto, y en un Documento de Mongoose no lo son.
    async getProductById(pid) {
        return await Product.findById(pid).lean();
    }

    // Actualizar producto existente (nunca permite modificar el _id)
    async updateProduct(pid, updateData) {
        const data = { ...updateData };
        delete data._id;
        delete data.id;

        return await Product.findByIdAndUpdate(pid, data, { new: true, runValidators: true });
    }

    // Eliminar producto
    async deleteProduct(pid) {
        return await Product.findByIdAndDelete(pid);
    }
}