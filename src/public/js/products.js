// public/js/products.js
const CART_STORAGE_KEY = 'araperful_cart_id';

// Obtiene el carrito guardado en localStorage, o crea uno nuevo si no existe
async function getOrCreateCartId() {
    let cartId = localStorage.getItem(CART_STORAGE_KEY);
    if (cartId) return cartId;

    const response = await fetch('/api/carts', { method: 'POST' });
    const data = await response.json();

    cartId = data.payload._id;
    localStorage.setItem(CART_STORAGE_KEY, cartId);
    return cartId;
}

// Agrega un producto al carrito actual (crea el carrito si todavía no existe)
async function addToCart(pid) {
    try {
        const cartId = await getOrCreateCartId();

        const response = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('No se pudo agregar el producto al carrito');
        }

        alert('Producto agregado al carrito ✅');
    } catch (error) {
        console.error(error);
        alert('Hubo un error al agregar el producto al carrito');
    }
}

// Lleva al usuario a la vista de su carrito actual
function goToCart() {
    const cartId = localStorage.getItem(CART_STORAGE_KEY);

    if (!cartId) {
        alert('Todavía no agregaste productos al carrito');
        return;
    }

    window.location.href = `/carts/${cartId}`;
}