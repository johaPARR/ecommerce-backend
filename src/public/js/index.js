// public/js/index.js
const socket = io();

socket.on('updateProducts', (products) => {
    // Usamos el ID correcto que definiste en el handlebars
    const productList = document.getElementById('products-container');
    
    if (productList) {
        productList.innerHTML = ''; 
        
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card';
            
            // Nota: Asegúrate de que el campo sea 'thumbnails' y no 'image'
            const img = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails[0] : '';
            
            div.innerHTML = `
                <img src="${img}" alt="${product.title}" class="product-img">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p class="price">Precio: $${product.price}</p>
                <p class="stock">Stock: ${product.stock}</p>
            `;
            productList.appendChild(div);
        });
    }
});