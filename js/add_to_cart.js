function addToCart(productName, productPrice) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} added to cart!`);
    displayCart();
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-list');

    if (!cartList) return;

    cartList.innerHTML = cart
        .map(item => `<li style="list-style: none; padding: 0; margin: 0;">${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</li>`)

        .join('');
}

function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
    alert('Cart cleared!');
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', displayCart);
