function initializeCountrySelector() {
  const menuLines = document.querySelector(".menu-lines");

  if (menuLines) {
      const customDropdown = document.createElement("div");
      customDropdown.className = "custom-dropdown";
      customDropdown.innerHTML = `
          <div class="selected-option">
              <img src="https://flagcdn.com/w40/dk.png" alt="Denmark Flag" class="flag-icon">
              Denmark (DKK)
          </div>
          <ul class="dropdown-options">
              <li data-value="denmark">
                  <img src="https://flagcdn.com/w40/dk.png" alt="Denmark Flag" class="flag-icon">
                  Denmark (DKK)
              </li>
              <li data-value="usa">
                  <img src="https://flagcdn.com/w40/us.png" alt="USA Flag" class="flag-icon">
                  USA (USD)
              </li>
              <li data-value="germany">
                  <img src="https://flagcdn.com/w40/de.png" alt="Germany Flag" class="flag-icon">
                  Germany (EUR)
              </li>
              <li data-value="uk">
                  <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" class="flag-icon">
                  UK (GBP)
              </li>
          </ul>
      `;

      menuLines.appendChild(customDropdown);

      const selectedOption = customDropdown.querySelector(".selected-option");
      const dropdownOptions = customDropdown.querySelector(".dropdown-options");

      selectedOption.addEventListener("click", (event) => {
          event.stopPropagation();
          dropdownOptions.style.display = dropdownOptions.style.display === "block" ? "none" : "block";
      });

      dropdownOptions.addEventListener("click", (event) => {
          if (event.target.tagName === "LI" || event.target.closest("li")) {
              const selectedItem = event.target.closest("li");
              const flag = selectedItem.querySelector("img").src;
              const text = selectedItem.textContent.trim();

              selectedOption.innerHTML = `
                  <img src="${flag}" alt="Selected Flag" class="flag-icon">
                  ${text}
              `;
              dropdownOptions.style.display = "none";
          }
      });

      document.addEventListener("click", () => {
          dropdownOptions.style.display = "none";
      });
  } else {
      console.warn("The .menu-lines element was not found. Skipping dropdown setup.");
  }
}
function initializeShortCountrySelector() {
  const customDropdown = document.querySelector(".custom-dropdown");
  const selectedOption = customDropdown.querySelector(".selected-option");
  const dropdownOptions = document.querySelector(".dropdown-options");

  if (!dropdownOptions) {
    console.error("Dropdown options not found.");
    return;
  }

  function adjustCountryText() {
    const isMobile = window.innerWidth <= 900;

    // Mapping countries to their display formats
    const countryData = {
      denmark: {
        flag: "https://flagcdn.com/w40/dk.png",
        text: isMobile ? "DKK" : "Denmark (DKK)"
      },
      usa: {
        flag: "https://flagcdn.com/w40/us.png",
        text: isMobile ? "USD" : "USA (USD)"
      },
      germany: {
        flag: "https://flagcdn.com/w40/de.png",
        text: isMobile ? "EUR" : "Germany (EUR)"
      },
      uk: {
        flag: "https://flagcdn.com/w40/gb.png",
        text: isMobile ? "GBP" : "UK (GBP)"
      }
    };

    // Update dropdown content
    dropdownOptions.innerHTML = Object.entries(countryData).map(([key, { flag, text }]) => `
      <li data-value="${key}">
        <img src="${flag}" alt="${key} Flag" class="flag-icon">
        ${text}
      </li>
    `).join('');

    // Update selected option
    const selectedValue = selectedOption.getAttribute('data-value') || 'denmark'; // Default to Denmark
    const { flag, text } = countryData[selectedValue];
    selectedOption.innerHTML = `
      <img src="${flag}" alt="Selected Flag" class="flag-icon">
      ${text}
    `;
  }

  // Adjust on load and on resize
  adjustCountryText();
  window.addEventListener("resize", adjustCountryText);
}
