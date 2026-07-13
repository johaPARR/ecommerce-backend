import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/products.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce';

const products = [
    { title: "Blue Seduction (A. Banderas) 50ml", code: "BSED-001", category: "masculino", price: 45000, stock: 15, status: true, description: "Es muy intuitivo y tan salvaje como las olas que cubren el alma del océano, jamás se rinde.", thumbnails: ["/imágenes/blueseduccion.jpg"] },
    { title: "Armani Code 50ml", code: "ACOD-002", category: "masculino", price: 43000, stock: 5, status: true, description: "Su presencia evoca elegancia, total autonomía y eficacia.", thumbnails: ["/imágenes/armanicode.webp"] },
    { title: "Eros (Versace) 50ml", code: "EROS-003", category: "masculino", price: 54000, stock: 7, status: true, description: "En medio de las montañas el jamás se detiene.", thumbnails: ["/imágenes/eros.avif"] },
    { title: "Acqua di Gio Men 50ml", code: "ACQU-004", category: "masculino", price: 48000, stock: 5, status: true, description: "El se pierde entre el mar, y resurge como un remolino.", thumbnails: ["/imágenes/acqua.webp"] },
    { title: "Sauvage (Dior) 50ml", code: "SAUV-005", category: "masculino", price: 46000, stock: 10, status: true, description: "El es audaz, no hay nada que no pueda vencer.", thumbnails: ["/imágenes/sauvage.jpg"] },
    { title: "La Vie Est Belle (Lancôme) 50ml", code: "LAVI-006", category: "femenino", price: 55000, stock: 12, status: true, description: "Un perfume que celebra la belleza de la vida.", thumbnails: ["/imágenes/lavida.avif"] },
    { title: "J'adore (Dior) 50ml", code: "JADO-007", category: "femenino", price: 58000, stock: 8, status: true, description: "La quintaesencia del lujo.", thumbnails: ["/imágenes/jadore.jpg"] },
    { title: "Light Blue (Dolce & Gabbana) 50ml", code: "LBLU-008", category: "femenino", price: 49000, stock: 10, status: true, description: "La alegría de vivir mediterránea.", thumbnails: ["/imágenes/dolcegabana.webp"] },
    { title: "Black Opium (YSL) 50ml", code: "BOPI-009", category: "femenino", price: 56000, stock: 6, status: true, description: "Una sobredosis de energía.", thumbnails: ["/imágenes/blackopium.jpg"] },
    { title: "Coco Mademoiselle (Chanel) 50ml", code: "COCO-010", category: "femenino", price: 60000, stock: 4, status: true, description: "El espíritu libre de una mujer seductora.", thumbnails: ["/imágenes/cocochanel.webp"] },
    { title: "One Million (Paco Rabanne) 50ml", code: "OMIL-011", category: "masculino", price: 47000, stock: 11, status: true, description: "El perfume del éxito.", thumbnails: ["/imágenes/onemillion.webp"] },
    { title: "Invictus (Paco Rabanne) 50ml", code: "INVI-012", category: "masculino", price: 47500, stock: 9, status: true, description: "La victoria hecha fragancia.", thumbnails: ["/imágenes/invictus.jpg"] },
    { title: "Good Girl (Carolina Herrera) 50ml", code: "GGIR-013", category: "femenino", price: 53000, stock: 13, status: true, description: "Tan buena como sea posible, tan mala como sea necesario.", thumbnails: ["/imágenes/goodgirl.webp"] },
    { title: "Fame (Paco Rabanne) 50ml", code: "FAME-014", category: "femenino", price: 59000, stock: 5, status: true, description: "Un perfume celestial.", thumbnails: ["/imágenes/fame.jpg"] },
    { title: "Hypnotic Poison (Dior) 50ml", code: "HPOI-015", category: "femenino", price: 57000, stock: 7, status: true, description: "Un filtro de seducción magnético.", thumbnails: ["/imágenes/poison.png"] }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado con éxito a MongoDB.");

        // Descomentar si necesitás limpiar la colección antes de insertar
        // await Product.deleteMany({});

        await Product.insertMany(products);
        console.log(`¡${products.length} productos insertados con éxito!`);
    } catch (error) {
        console.error("Error al sembrar la base de datos:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase();