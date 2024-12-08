const CheckoutCart = {
    productImages: {
        "Sleep Tape": "images/mundtape.PNG",
        "Nasal Strips": "images/næsetape.PNG",
        "Sleep & Nasal Tape Package": "images/combopack.png"
    },

    displayCartCheckOut() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartList = document.getElementById('cart-list-checkout');
        const totalPriceElement = document.getElementById('total-price-checkout');

        if (!cartList || !totalPriceElement) {
            console.error("Cart list or total price element is missing in the DOM.");
            return;
        }

        const totalPrice = cart.reduce((total, item) => total + (item.quantity > 0 ? item.price * item.quantity : 0), 0);

        cartList.innerHTML = cart
            .map((item, index) => `
                <li class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="flex: 2;">
                        <h3>${item.name}</h3>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button onclick="CheckoutCart.updateQuantity(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="CheckoutCart.updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <img src="${this.productImages[item.name]}" alt="${item.name}" class="cart-item-image" style="width: 180px; height: auto; margin-bottom: 10px;">
                    </div>
                </li>
            `)
            .join('');

        totalPriceElement.innerText = `Total: $${totalPrice.toFixed(2)}`;
    },

    updateQuantity(index, delta) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart[index]) {
            cart[index].quantity = Math.max(0, cart[index].quantity + delta);
            localStorage.setItem('cart', JSON.stringify(cart));
            this.displayCartCheckOut();
        }
    },

    clearCart() {
        localStorage.removeItem('cart');
        this.displayCartCheckOut();
        alert('Cart cleared!');
    }
};

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => CheckoutCart.displayCartCheckOut());
