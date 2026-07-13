import express from 'express';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io'; // Necesario para WebSockets
import { connectDB } from './.config/dbConfig.js';

// Importación de Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- CONFIGURACIÓN DE HANDLEBARS ---
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middlewares
app.use(express.static('./src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
connectDB();

// --- RUTAS ---
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Ruta de prueba
app.get('/ping', (req, res) => {
  res.send({
    status: "success",
    message: "Servidor Express funcionando de 10!"
  });
});

// --- INICIALIZACIÓN DEL SERVIDOR CON WEBSOCKETS ---
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

// Configuración de eventos de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado por WebSockets');

  // Ejemplo: Puedes emitir un evento a todos los clientes al conectarse
  // socket.emit('updateProducts', datos);
});

// Exportar io para usarlo en los routers si es necesario
app.set('socketio', io);