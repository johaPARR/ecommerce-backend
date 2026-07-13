# 🌸 Araperful — E-commerce Backend

API REST y vistas server-side para un e-commerce de perfumes, desarrollada como Proyecto Final de **Backend 1** — Carrera Fullstack Developer, **Coderhouse**.

Permite gestionar un catálogo de productos y carritos de compra con persistencia real en base de datos, paginación, filtros, y actualización de stock en tiempo real vía WebSockets.

---

## 📋 Tabla de contenidos

- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Vistas](#-vistas)
- [Autor](#-autor)

---

## 🚀 Tecnologías

| Categoría | Tecnología |
|---|---|
| Runtime | [Node.js](https://nodejs.org/) |
| Framework web | [Express 5](https://expressjs.com/) |
| Base de datos | [MongoDB](https://www.mongodb.com/) |
| ODM | [Mongoose](https://mongoosejs.com/) + [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2) |
| Motor de plantillas | [Express-Handlebars](https://github.com/express-handlebars/express-handlebars) |
| Tiempo real | [Socket.io](https://socket.io/) |
| Variables de entorno | [dotenv](https://www.npmjs.com/package/dotenv) |
| Desarrollo | [nodemon](https://nodemon.io/) |

---

## ✨ Características

- **CRUD completo de productos**: crear, listar (con paginación, filtro y orden), ver detalle, actualizar y eliminar.
- **CRUD completo de carritos**: crear carrito, agregar/quitar productos, actualizar cantidades, vaciar carrito.
- **Populate de Mongoose**: al consultar un carrito, se traen los datos completos de cada producto (no solo su ID).
- **Actualización en tiempo real**: la vista de productos se actualiza automáticamente vía WebSockets cuando se crea un nuevo producto, sin recargar la página.
- **Vistas server-side** con Handlebars: catálogo paginado, detalle de producto y vista de carrito.
- **Doble capa de persistencia**: implementación en base de datos (MongoDB) y una implementación previa con FileSystem conservada en `dao/fs/`.
- **Arquitectura modular**: separación clara entre rutas, DAOs, modelos y vistas.

---

## 📁 Estructura del proyecto

```
ecommerce-backend/
├── src/
│   ├── app.js                      # Punto de entrada: servidor Express + Socket.io
│   │
│   ├── .config/
│   │   └── dbConfig.js             # Conexión a MongoDB
│   │
│   ├── routes/
│   │   ├── products.router.js      # Endpoints /api/products
│   │   ├── carts.router.js         # Endpoints /api/carts
│   │   └── views.router.js         # Rutas que renderizan vistas Handlebars
│   │
│   ├── dao/
│   │   ├── db/                     # Acceso a datos vía MongoDB (implementación activa)
│   │   │   ├── ProductManager.db.js
│   │   │   └── CartManager.db.js
│   │   └── fs/                     # Implementación previa con FileSystem (conservada)
│   │       ├── ProductManager.js
│   │       └── CartManager.js
│   │
│   ├── models/
│   │   ├── products.model.js       # Schema de Mongoose para productos
│   │   └── carts.model.js          # Schema de Mongoose para carritos
│   │
│   ├── data/                       # Archivos JSON locales (persistencia FileSystem)
│   │   ├── products.json
│   │   └── carts.json
│   │
│   ├── public/                     # Archivos estáticos
│   │   ├── css/styles.css
│   │   └── js/
│   │       ├── index.js            # Cliente de Socket.io (tiempo real)
│   │       └── products.js         # Lógica de "agregar al carrito"
│   │
│   └── views/                      # Plantillas Handlebars
│       ├── layouts/main.handlebars
│       ├── products.handlebars
│       ├── productDetail.handlebars
│       ├── cart.handlebars
│       └── realTimeProducts.handlebars
│
├── scripts/
│   └── seedProducts.js             # Script para poblar la base de datos
│
├── .env                            # Variables de entorno (no versionado)
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Instalación

1. **Cloná el repositorio**

```bash
git clone https://github.com/johaPARR/ecommerce-backend.git
cd ecommerce-backend
```

2. **Instalá las dependencias**

```bash
npm install
```

3. **Configurá las variables de entorno**

Creá un archivo `.env` en la raíz del proyecto (ver sección [Variables de entorno](#-variables-de-entorno)).

4. **(Opcional) Poblá la base de datos con productos de ejemplo**

```bash
node scripts/seedProducts.js
```

5. **Levantá el servidor**

```bash
npm run dev
```

El servidor queda disponible en **http://localhost:8080**.

---

## 🔐 Variables de entorno

Creá un archivo `.env` en la raíz con las siguientes variables:

```env
PORT=8080
MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
```

> ⚠️ El archivo `.env` está incluido en `.gitignore` y **no se sube al repositorio**. Nunca compartas tu connection string con credenciales reales.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor en modo producción |
| `npm run dev` | Inicia el servidor en modo desarrollo con `nodemon` |
| `node scripts/seedProducts.js` | Puebla la colección `products` con datos de ejemplo |

---

## 🔌 Endpoints de la API

### Productos — `/api/products`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/products` | Lista productos con paginación, filtro (`query`) y orden (`sort`) |
| `GET` | `/api/products/:pid` | Obtiene un producto por ID |
| `POST` | `/api/products` | Crea un nuevo producto |
| `PUT` | `/api/products/:pid` | Actualiza un producto existente |
| `DELETE` | `/api/products/:pid` | Elimina un producto |

**Query params de `GET /api/products`:**

| Parámetro | Descripción | Default |
|---|---|---|
| `limit` | Cantidad de resultados por página | `10` |
| `page` | Número de página | `1` |
| `query` | Filtro por `category:valor` o `available` | — |
| `sort` | Orden por precio: `asc` \| `desc` | — |

**Respuesta de `GET /api/products`:**

```json
{
  "status": "success",
  "payload": [],
  "totalPages": 0,
  "prevPage": null,
  "nextPage": null,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevLink": null,
  "nextLink": null
}
```

### Carritos — `/api/carts`

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/carts` | Crea un nuevo carrito |
| `GET` | `/api/carts/:cid` | Lista los productos del carrito (con `populate`) |
| `POST` | `/api/carts/:cid/products/:pid` | Agrega un producto al carrito (incrementa cantidad si ya existe) |
| `PUT` | `/api/carts/:cid` | Actualiza todos los productos del carrito |
| `PUT` | `/api/carts/:cid/products/:pid` | Actualiza la cantidad de un producto puntual |
| `DELETE` | `/api/carts/:cid/products/:pid` | Elimina un producto puntual del carrito |
| `DELETE` | `/api/carts/:cid` | Vacía el carrito completo |

---

## 🖥️ Vistas

| Ruta | Descripción |
|---|---|
| `/products` | Catálogo de productos con paginación |
| `/products/:pid` | Vista de detalle de un producto |
| `/carts/:cid` | Vista de un carrito específico |
| `/realtimeproducts` | Catálogo con actualización en tiempo real vía WebSockets |

---

## 👩‍💻 Autor

**Johana Aylén Parrello**
Proyecto Final — Backend 1 · Carrera Fullstack Developer · Coderhouse

- Portfolio: [johaparrello.wordpress.com](https://johaparrello.wordpress.com)
- GitHub: [@johaPARR](https://github.com/johaPARR)

---

## 📝 Licencia

Proyecto desarrollado con fines educativos para Coderhouse.
