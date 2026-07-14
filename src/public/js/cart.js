// public/js/cart.js
// Lógica exclusiva de la vista /carts/:cid (requiere que products.js ya esté cargado)

function formatMoney(value) {
    return `$${value.toLocaleString('es-AR')}`;
}

// Recalcula subtotal por fila y el total general en base a lo que hay en pantalla
function recalculateTotals() {
    let total = 0;

    document.querySelectorAll('.cart-card').forEach(card => {
        const price = parseFloat(card.dataset.price);
        const qty = parseInt(card.querySelector('.qty-value').textContent, 10);
        const subtotal = price * qty;

        card.querySelector('.subtotal-value').textContent = formatMoney(subtotal);
        total += subtotal;
    });

    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = formatMoney(total);
    if (totalEl) totalEl.textContent = formatMoney(total);
}

// Cambia la cantidad de un producto en el carrito (+1 / -1)
async function changeQuantity(cartId, pid, card, delta) {
    const qtyEl = card.querySelector('.qty-value');
    let newQty = parseInt(qtyEl.textContent, 10) + delta;

    if (newQty < 1) {
        return removeItem(cartId, pid, card);
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQty })
        });

        if (!response.ok) throw new Error('No se pudo actualizar la cantidad');

        qtyEl.textContent = newQty;
        recalculateTotals();
        updateCartUI();
    } catch (error) {
        console.error(error);
        showToast('No se pudo actualizar la cantidad', 'danger');
    }
}

// Elimina un producto puntual del carrito
async function removeItem(cartId, pid, card) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${pid}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('No se pudo eliminar el producto');

        card.remove();
        recalculateTotals();
        updateCartUI();

        if (!document.querySelector('.cart-card')) {
            location.reload();
        }
    } catch (error) {
        console.error(error);
        showToast('No se pudo eliminar el producto', 'danger');
    }
}

// Finaliza la compra: valida medio de pago, vacía el carrito y confirma
async function checkout(cartId) {
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked');

    if (!metodoPago) {
        showToast('Elegí un medio de pago para continuar', 'warning');
        return;
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';

    try {
        const response = await fetch(`/api/carts/${cartId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('No se pudo procesar la compra');

        localStorage.removeItem('araperful_cart_id');
        showToast(`¡Compra confirmada! Pagaste con ${metodoPago.value} 🎉`);

        setTimeout(() => {
            window.location.href = '/products';
        }, 1800);
    } catch (error) {
        console.error(error);
        showToast('Hubo un error al procesar la compra', 'danger');
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = '<i class="bi bi-bag-check-fill"></i> Comprar';
    }
}

// Vacía el carrito manualmente (sin comprar)
async function clearCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('No se pudo vaciar el carrito');

        showToast('Carrito vaciado');
        setTimeout(() => location.reload(), 800);
    } catch (error) {
        console.error(error);
        showToast('No se pudo vaciar el carrito', 'danger');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    recalculateTotals();

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.cart-card');
            const pid = btn.dataset.pid;
            const cartId = document.getElementById('checkout-btn')?.dataset.cartId;
            const delta = btn.dataset.action === 'increase' ? 1 : -1;
            changeQuantity(cartId, pid, card, delta);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.cart-card');
            const pid = btn.dataset.pid;
            const cartId = document.getElementById('checkout-btn')?.dataset.cartId;
            removeItem(cartId, pid, card);
        });
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => checkout(checkoutBtn.dataset.cartId));
    }

    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => clearCart(clearBtn.dataset.cartId));
    }
});