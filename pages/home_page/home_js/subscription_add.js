// Utility to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  // Utility to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }
  
  // Function to initialize the newsletter UI
  function initializeNewsletter() {
    const newsletterContainer = document.getElementById("newsletter-container");
    const isSubscribed = getCookie("subscribedEmail");
  
    if (isSubscribed) {
      // Fetch and display the subscription form from a template
      fetch("/pages/home_page/thanksletter_template.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load the thanks template.");
          }
          return response.text();
        })
        .then((html) => {
          newsletterContainer.innerHTML = html;
        })
        .catch((error) => {
          console.error("Error loading thanks template:", error);
        });
    } else {
      // Fetch and display the subscription form from a template
      fetch("/pages/home_page/newsletter_template.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load the newsletter template.");
          }
          return response.text();
        })
        .then((html) => {
          newsletterContainer.innerHTML = html;
        })
        .catch((error) => {
          console.error("Error loading newsletter template:", error);
        });
    }
  }
  
  // Function to toggle and save email subscription
  function toggleAndSave() {
    const inputBox = document.querySelector(".hidden-input news");
    const emailInput = document.getElementById("subscriber-email");

    // Toggle visibility
    if (inputBox.style.display === "none" || inputBox.style.display === "") {
        inputBox.style.display = "block"; // Show the input box
    } else {
        const email = emailInput.value.trim(); // Trim whitespace
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Corrected regex

        // Validate email
        if (!email || !emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        console.log("Validation Passed: Sending email to backend");
  
      // Send email to Netlify Function
      fetch("https://easyairflow.netlify.app/.netlify/functions/addSubscriber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
          } else {
            alert("Email saved successfully!");
            setCookie("subscribedEmail", email, 30); // Save email in cookies for 30 days
  
            // Replace form with thank-you message
            const newsletterContainer = document.getElementById(
              "newsletter-container"
            );
            newsletterContainer.innerHTML = `
              <p>Thank you for subscribing! Check out our <a href="/products">products</a>.</p>
            `;
          }
        })
        .catch((error) => {
          console.error("Error saving email:", error);
          alert("There was an error saving your email. Please try again later.");
        });
    }
  }
  
  // Initialize the newsletter UI after all resources are loaded
  window.addEventListener("load", initializeNewsletter);
  