// public/js/index.js
// public/js/index.js
const socket = io();

// RECUERDA: Reemplaza este ID por uno real de tu base de datos
const cartId = "6690a7863a139a0012345678"; 

// 1. Escucha de actualizaciones en tiempo real
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
                <p class="stock">Stock: ${product.stock}</p>
                
                <button class="add-to-cart-btn" onclick="addToCart('${product._id}')">Agregar al Carrito</button>
                
                <button class="buy-now-btn" onclick="buyNow('${product._id}')" style="margin-top: 10px; background-color: #ff9900; color: white; border: none; padding: 10px; cursor: pointer;">
                    Comprar Ahora
                </button>
            `;
            productList.appendChild(div);
        });
    }
});

// 2. FUNCIÓN: Agregar al Carrito (Básico)
async function addToCart(productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("¡Perfume agregado al carrito con éxito!");
        } else {
            alert("Error al agregar: " + (data.message || "Algo salió mal"));
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

// 3. FUNCIÓN: Comprar Ahora (Incluye método de pago)
async function buyNow(productId) {
    // Preguntar método de pago
    const metodoPago = prompt("Selecciona método de pago:\nEscribe 'Efectivo' o 'Tarjeta'");
    
    if (!metodoPago || (metodoPago.toLowerCase() !== 'efectivo' && metodoPago.toLowerCase() !== 'tarjeta')) {
        alert("Operación cancelada: Debes escribir 'Efectivo' o 'Tarjeta'");
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metodo: metodoPago })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`¡Compra realizada con éxito!\nMétodo seleccionado: ${metodoPago}`);
        } else {
            alert("Error al procesar la compra: " + (data.message || "Algo salió mal"));
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("Error de conexión con el servidor.");
    }
}