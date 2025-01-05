function initializeRegionPrice() {
  console.log("Script loaded. Initializing price adjustment...");

  const exchangeRates = {
    denmark: 1, // Base price in DKK
    usa: 0.14,  // Exchange rate for USD
    germany: 0.13, // Exchange rate for EUR
    uk: 0.11   // Exchange rate for GBP
  };

  const countryDropdown = document.querySelector(".selected-option");
  const dropdownOptions = document.querySelector(".dropdown-options");
  const products = document.querySelectorAll(".product");

  if (!countryDropdown) {
    console.error("Country dropdown not found!");
    return;
  }

  if (products.length === 0) {
    console.error("No products found!");
    return;
  }

  function adjustPrices(country) {
    console.log(`Adjusting prices for country: ${country}`);
    const rate = exchangeRates[country];
    
    if (rate === undefined) {
      console.warn(`No exchange rate found for country: ${country}. Using default (DKK).`);
    }

    products.forEach(product => {
      const priceElement = product.querySelector(".dynamic-price");
      const addToCartButton = product.querySelector(".add-to-cart");
      const basePrice = parseFloat(addToCartButton.getAttribute("data-product-price"));

      if (isNaN(basePrice)) {
        console.error(`Invalid base price for product: ${product.querySelector("h3").textContent}`);
        return;
      }

      const adjustedPrice = (basePrice * (rate || 1)).toFixed(2);
      const currencySymbol = {
        denmark: " DKK",
        usa: " $",
        germany: " €",
        uk: " £"
      }[country] || " DKK";

      priceElement.textContent = `${adjustedPrice}${currencySymbol}`;
      console.log(`Updated price for "${product.querySelector("h3").textContent}": ${adjustedPrice}${currencySymbol}`);
    });
  }

  // Initial adjustment based on the default country
  adjustPrices("denmark");

  // Adjust prices when a new country is selected
  dropdownOptions.addEventListener("click", (event) => {
    const selectedItem = event.target.closest("li");
    if (selectedItem) {
      const selectedCountry = selectedItem.getAttribute("data-value");
      if (selectedCountry) {
        countryDropdown.setAttribute("data-value", selectedCountry); // Update the selected country
        adjustPrices(selectedCountry);
      } else {
        console.warn("No valid country selected.");
      }
    }
  });
}
