// Utility to get a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null; // Return null if cookie doesn't exist
}

// Function to parse the discount percentage
function getDiscountPercentage(code) {
  const match = code.match(/\d+$/); // Extract digits at the end of the code
  return match ? parseInt(match[0], 10) : 0;
}

// Function to validate the discount code on the server
async function validateDiscountCode(discountCode) {
  try {
    const response = await fetch(
      "https://easyairflow.netlify.app/.netlify/functions/validateDiscountCode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discountCode }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to validate discount code.");
    }

    const data = await response.json();
    return data.valid; // Returns true if valid, false otherwise
  } catch (error) {
    console.error("Error validating discount code:", error);
    return false;
  }
}

// Function to apply discounts
async function applyDiscount() {
  const discountCode = getCookie("discountCode");
  if (!discountCode) {
    console.log("No discount code found.");
    return;
  }

  console.log("Validating discount code:", discountCode);

  const isValid = await validateDiscountCode(discountCode);
  if (!isValid) {
    console.warn("Invalid discount code. Removing cookie.");
    // Delete the invalid cookie
    document.cookie =
      "discountCode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    return;
  }

  console.log("Discount code is valid. Applying discount.");

  // Parse discount percentage
  const discountPercentage = getDiscountPercentage(discountCode);
  if (discountPercentage === 0) {
    console.log("Invalid discount code format. No discount applied.");
    return;
  }

  console.log(`Applying ${discountPercentage}% discount.`);

  // Update all price elements
  document.querySelectorAll(".dynamic-price").forEach((priceElement) => {
    const originalPrice = parseFloat(priceElement.textContent.trim());
    if (!isNaN(originalPrice)) {
        console.log("^^inside the HTML WRITE")
      const discountedPrice =
        originalPrice - (originalPrice * discountPercentage) / 100;
      priceElement.innerHTML = `
    <span class="old-price">$${originalPrice.toFixed(2)}</span>
    <br>
    <span class="showing_discount_customer"> -${discountPercentage}%</span>
    <span class="new-price">$${discountedPrice.toFixed(2)}</span>
    `;
    }
    else return console.log("!isNaN(originalprice) failure")
  });
}

// Run the script when the page loads
document.addEventListener("DOMContentLoaded", applyDiscount);
