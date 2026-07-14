// public/js/products.js
// Lógica global del carrito: se carga en TODAS las páginas (ver main.handlebars)
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

// Muestra un toast de Bootstrap en la esquina superior derecha (reemplaza al alert())
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1080';
        document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-cart-check-fill me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl, { delay: 2200 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Recalcula cuántas unidades hay en total dentro de un carrito
function sumQuantities(products) {
    return (products || []).reduce((total, item) => total + (item.quantity || 0), 0);
}

// Actualiza el badge rojo del carrito en la navbar y el link al que apunta
async function updateCartUI() {
    const counterEl = document.getElementById('cart-counter');
    const cartLink = document.getElementById('cart-link');

    const cartId = localStorage.getItem(CART_STORAGE_KEY);

    if (cartLink) {
        cartLink.href = cartId ? `/carts/${cartId}` : '/products';
    }

    if (!cartId) {
        if (counterEl) counterEl.textContent = '0';
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}`);
        if (!response.ok) {
            if (counterEl) counterEl.textContent = '0';
            return;
        }
        const data = await response.json();
        const total = sumQuantities(data.payload);
        if (counterEl) counterEl.textContent = total;
    } catch (error) {
        console.error('No se pudo actualizar el contador del carrito:', error);
    }
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

        await updateCartUI();
        showToast('Producto agregado al carrito');
    } catch (error) {
        console.error(error);
        showToast('Hubo un error al agregar el producto al carrito', 'danger');
    }
}

// Lleva al usuario a la vista de su carrito actual
function goToCart() {
    const cartId = localStorage.getItem(CART_STORAGE_KEY);

    if (!cartId) {
        showToast('Todavía no agregaste productos al carrito', 'warning');
        return;
    }

    window.location.href = `/carts/${cartId}`;
}

// Inicializa el contador y el link del carrito apenas carga cualquier página
document.addEventListener('DOMContentLoaded', updateCartUI);