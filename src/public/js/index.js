// public/js/index.js
const socket = io();

// 1. Ya no usamos un ID fijo. Usaremos una variable global.
let cartId = null;

// Función para obtener o crear el carrito al cargar la página
async function initCart() {
    try {
        // Obtenemos los carritos (ajusta esta ruta si tu GET de carritos es diferente)
        const response = await fetch('/api/carts');
        const data = await response.json();
        
        if (data.payload && data.payload.length > 0) {
            cartId = data.payload[0]._id; // Tomamos el primer carrito disponible
        } else {
            // Si no hay ninguno, creamos uno nuevo
            const createRes = await fetch('/api/carts', { method: 'POST' });
            const createData = await createRes.json();
            cartId = createData.payload._id;
        }
        console.log("Carrito activo:", cartId);
    } catch (error) {
        console.error("Error inicializando carrito:", error);
    }
}

// Llamamos a la inicialización al cargar
initCart();

// 2. Escucha de actualizaciones (Mantén lo que ya tenías)
socket.on('updateProducts', (products) => {
    const productList = document.getElementById('products-container');
    if (productList) {
        productList.innerHTML = ''; 
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card';
            const img = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails[0] : '';
            div.innerHTML = `
                <img src="${img}" alt="${product.title}" class="product-img">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p class="price">Precio: $${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart('${product._id}')">Agregar al Carrito</button>
                <button class="buy-now-btn" onclick="buyNow('${product._id}')" style="margin-top: 10px; background-color: #ff9900; color: white; border: none; padding: 10px; cursor: pointer;">Comprar Ahora</button>
            `;
            productList.appendChild(div);
        });
    }
});

// 3. Funciones de compra usando el cartId dinámico
async function addToCart(productId) {
    if (!cartId) return alert("Esperando carrito...");
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    response.ok ? alert("¡Agregado!") : alert("Error: " + data.message);
}

async function buyNow(productId) {
    if (!cartId) return alert("Esperando carrito...");
    const metodoPago = prompt("Selecciona 'Efectivo' o 'Tarjeta'");
    if (!metodoPago) return;
    
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metodo: metodoPago })
    });
    const data = await response.json();
    response.ok ? alert(`Compra exitosa con ${metodoPago}`) : alert("Error: " + data.message);
}