document.addEventListener('DOMContentLoaded', function () {
    const footerContainer = document.createElement('div'); // Create a container for the footer

    fetch('../../templates/html_templates/footer_template.html') // Load the template file
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load footer template.');
            }
            return response.text();
        })
        .then(data => {
            footerContainer.innerHTML = data; // Insert the template content
            document.body.insertAdjacentElement('beforeend', footerContainer); // Add the footer to the bottom of the body
        })
        .catch(error => {
            console.error(error);
        });
});
