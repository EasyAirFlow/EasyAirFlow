function toggleAndSave() {
    const inputBox = document.querySelector(".hidden-input");
    const emailInput = document.getElementById("subscriber-email");

    // Toggle visibility
    if (inputBox.style.display === "none" || inputBox.style.display === "") {
        inputBox.style.display = "block"; // Show the input box
    } else {
        const email = emailInput.value.trim(); // Trim whitespace
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email
        if (!email || !emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        console.log("Validation Passed: Sending email to backend");

        // Send email to Netlify Function
        fetch(".netlify/functions/addSubscriber", {
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
                    emailInput.value = ""; // Clear input field
                    inputBox.style.display = "none"; // Hide input box after saving
                }
            })
            .catch((error) => {
                console.error("Error saving email:", error);
                alert("There was an error saving your email. Please try again later.");
            });
    }
}
