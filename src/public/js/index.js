// public/js/index.js
// SOLO usado en /realtimeproducts para pintar productos que llegan por Socket.io.
// La lógica del carrito (addToCart, contador, toasts) vive en products.js.
const socket = io();

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('products-container');
    if (!productList) return;

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
        `;
        productList.appendChild(div);
    });
});