// Function to initialize the discount UI
function initializeDiscount() {
  const discountContainer = document.getElementById("discount-container");

  // Load the discount template
  fetch("/pages/home_page/discount_template.html")
      .then((response) => {
          if (!response.ok) {
              throw new Error("Failed to load the discount template.");
          }
          return response.text();
      })
      .then((html) => {
          discountContainer.innerHTML = html;

          // Add event listener to the discount form submission
          const discountForm = document.getElementById("discount-form");
          discountForm.addEventListener("submit", validateDiscountCode);
      })
      .catch((error) => {
          console.error("Error loading discount template:", error);
      });
}

// Function to validate the discount code
async function validateDiscountCode(event) {
  event.preventDefault(); // Prevent form submission

  const discountInput = document.getElementById("discount-code");
  const discountCode = discountInput.value.trim(); // Get the user input

  if (!discountCode) {
      alert("Please enter a discount code.");
      return;
  }

  try {
      // Send the discount code to the Netlify Function
      const response = await fetch("/.netlify/functions/validateDiscountCode", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ discountCode }),
      });

      if (!response.ok) {
          throw new Error("Failed to validate the discount code.");
      }

      const data = await response.json();

      // Provide feedback to the user
      const feedbackMessage = document.getElementById("discount-feedback");
      if (data.valid) {
          feedbackMessage.textContent = "🎉 Congratulations! Your discount code is valid. Enjoy your discount!";
          feedbackMessage.style.color = "green";
          discountInput.disabled = true; // Optional: Disable input after successful validation
      } else {
          feedbackMessage.textContent = "❌ Sorry, this discount code is not valid. Please try another.";
          feedbackMessage.style.color = "red";
      }
  } catch (error) {
      console.error("Error validating discount code:", error);
      alert("There was an error validating your discount code. Please try again later.");
  }
}

// Initialize the discount UI after all resources are loaded
window.addEventListener("load", initializeDiscount);
