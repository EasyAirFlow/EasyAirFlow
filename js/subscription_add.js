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

        console.log("Validation Passed: Proceeding to save email");

        // API code to save email
        fetch('https://api.github.com/repos/EasyAirFlow/EasyAirFlow/contents/subscription_letter.JSON', {
            headers: {
                'Authorization': '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'
            }
        })
            .then(response => response.json())
            .then(fileData => {
                const existingContent = JSON.parse(atob(fileData.content));
                existingContent.subscribers.push({
                    email: email,
                    date: new Date().toISOString()
                });

                const updatedContent = {
                    message: 'Add new subscriber',
                    content: btoa(JSON.stringify(existingContent)),
                    sha: fileData.sha
                };

                return fetch('https://api.github.com/repos/EasyAirFlow/EasyAirFlow/contents/subscription_letter.JSON', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': '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'
                    },
                    body: JSON.stringify(updatedContent)
                });
            })
            .then(() => {
                alert("Email saved successfully!");
                emailInput.value = ""; // Clear input field
                inputBox.style.display = "none"; // Hide input box after saving
            })
            .catch(error => {
                console.error("Error saving email:", error);
                alert("There was an error saving your email. Please try again later.");
            });
    }
}
