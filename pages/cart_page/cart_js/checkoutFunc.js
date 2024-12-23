const CheckoutCart = {
    productImages: {
        "Sleep Tape": "../../templates/images_templates/mundtape.PNG",
        "Nasal Strips": "../../templates/images_templates/næsetape.PNG",
        "Sleep & Nasal Tape Package": "../../templates/images_templates/combopack.png"
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
                <li class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 10px; position: relative;">
                    <!-- Remove button -->
                    <button onclick="CheckoutCart.removeProduct(${index})" style="
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        background: none;
                        color: black;
                        border: 0px solid black;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        font-size: 16px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">X</button>
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

    removeProduct(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index]) {
            cart.splice(index, 1); // Remove the product from the cart
            localStorage.setItem('cart', JSON.stringify(cart));
            this.displayCartCheckOut(); // Re-render the cart
        }
    },

    clearCart() {
        localStorage.removeItem('cart');
        this.displayCartCheckOut();
        alert('Cart cleared!');
    },

    proceedToCheckout() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const containsSleepTape = cart.some(item => item.name === "Sleep Tape");
        const containsNasalStrips = cart.some(item => item.name === "Nasal Strips");
        const containsComboPackage = cart.some(item => item.name === "Sleep & Nasal Tape Package");

        if (containsNasalStrips && containsComboPackage && containsSleepTape) {
            window.location.href = "https://buy.stripe.com/7sIbKO5Qh8mb4jmbIJ"; // All three
        } else if (containsNasalStrips && containsComboPackage) {
            window.location.href = "https://buy.stripe.com/aEU6qu4MdfOD2bedQU"; // Combo + Nasal Strips
        } else if (containsComboPackage && containsSleepTape) {
            window.location.href = "https://buy.stripe.com/fZeaGKbaBdGv3fieUZ"; // Combo + Sleep Tape
        } else if (containsComboPackage) {
            window.location.href = "https://buy.stripe.com/7sIbKO5Qh8mb4jmbIJ"; // Combo only
        } else if (containsSleepTape && containsNasalStrips) {
            window.location.href = "https://buy.stripe.com/7sIbKO5Qh8mb4jmbIJ"; // Sleep Tape + Nasal Strips
        } else if (containsSleepTape) {
            window.location.href = "https://buy.stripe.com/cN2aGK5Qh59Z17a8wy"; // Sleep Tape only
        } else if (containsNasalStrips) {
            window.location.href = "https://buy.stripe.com/cN23ei2E58mbeY06or"; // Nasal Strips only
        } else {
            alert("No valid products in the cart!");
        }        
    }
};

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => CheckoutCart.displayCartCheckOut());
