document.addEventListener("DOMContentLoaded", async () => {
    let cartDrawer = document.getElementById("cart-drawer");

    // Create cart drawer dynamically if it doesn't exist
    if (!cartDrawer) {
        cartDrawer = document.createElement("div");
        cartDrawer.id = "cart-drawer";
        cartDrawer.className = "cart-drawer hidden";

        // Fetch HTML content from the file
        try {
            const response = await fetch('../../templates/html_templates/cart_drawer_display.html');
            if (!response.ok) {
                throw new Error("Failed to load cart drawer template.");
            }
            cartDrawer.innerHTML = await response.text();
        } catch (error) {
            console.error("Error loading cart drawer HTML:", error);
            cartDrawer.innerHTML = "<p>Error loading cart drawer. Please try again later.</p>";
        }

        // Append the cart drawer to the body
        document.body.appendChild(cartDrawer);
    }

    // Select elements
    const cartIcon = document.getElementById("cart-icon");
    const cartProducts = document.getElementById("cart-products");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("cart-checkout");

    let cartItems = [];
    let totalPrice = 0;

    // Function to show the cart drawer
    function showCart() {
        cartDrawer.classList.remove("hidden");
        cartDrawer.classList.add("visible");
    }

    // Function to hide the cart drawer
    function hideCart() {
        cartDrawer.classList.remove("visible");
        cartDrawer.classList.add("hidden");
    }

    // Function to add a product to the cart
    function addToCart(productName, productPrice) {
        const existingItem = cartItems.find((item) => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice += productPrice;
        } else {
            cartItems.push({ name: productName, price: productPrice, quantity: 1, totalPrice: productPrice });
        }

        totalPrice += productPrice;

        renderCartItems();
        showCart();
    }

    // Function to render cart items
    function renderCartItems() {
        cartProducts.innerHTML = ""; // Clear previous items
        cartItems.forEach((item) => {
            const productElement = document.createElement("div");
            productElement.classList.add("cart-item");
            productElement.innerHTML = `
                <span id="amount_of_items_in_cart">${item.quantity}x</span>
                <span id="price_of_items_in_cart">${item.totalPrice.toFixed(2)} Euro</span>
                <span id="items_in_cart">${item.name}</span>
                <button class="remove-item" data-product-name="${item.name}">&times;</button>
            `;
            cartProducts.appendChild(productElement);
        });

        cartTotal.textContent = `${totalPrice.toFixed(2)} Euro`;

        const removeButtons = document.querySelectorAll(".remove-item");
        removeButtons.forEach((button) =>
            button.addEventListener("click", () => {
                const productName = button.getAttribute("data-product-name");
                removeFromCart(productName);
            })
        );
    }

    // Function to remove a product from the cart
    function removeFromCart(productName) {
        const itemIndex = cartItems.findIndex((item) => item.name === productName);

        if (itemIndex !== -1) {
            const item = cartItems[itemIndex];
            totalPrice -= item.price;
            item.quantity -= 1;
            item.totalPrice -= item.price;

            if (item.totalPrice === -0) {
                item.totalPrice = 0;
            }

            if (item.quantity === 0) {
                cartItems.splice(itemIndex, 1);
            }

            renderCartItems();
        }
    }

    // Function to proceed to checkout
    function proceedToCheckout() {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const containsSleepTape = cartItems.some(item => item.name === "30x Sleep Tape");
        const containsNasalStrips = cartItems.some(item => item.name === "30x Nasal Strips");
        const containsComboPackage = cartItems.some(item => item.name === "30x Nasal strips + 30x Sleep Tape");

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

    // Attach checkout button event listener
    checkoutButton.addEventListener("click", proceedToCheckout);

    // Add click event listener to the cart icon to show the cart drawer
    cartIcon.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default navigation if inside an <a> tag
        showCart(); // Show the cart drawer
    });

    // Attach the close button event listener dynamically after loading cart drawer
    document.addEventListener("click", (event) => {
        if (event.target.id === "cart-close") {
            hideCart();
        }
    });

    // Add event listeners to "add-to-cart" buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) =>
        button.addEventListener("click", () => {
            const productName = button.getAttribute("data-product-name");
            const productPrice = parseFloat(button.getAttribute("data-product-price"));
            addToCart(productName || "Unnamed Product", productPrice || 0);
        })
    );
});
