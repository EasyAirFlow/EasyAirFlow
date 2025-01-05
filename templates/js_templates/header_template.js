document.addEventListener('DOMContentLoaded', function () {
    const headerContainer = document.createElement('div'); // Create a container for the header

    fetch('../../templates/html_templates/header_template.html') // Load the template file
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header template.');
            }
            return response.text();
        })
        .then(data => {
            headerContainer.innerHTML = data; // Insert the template content
            document.body.insertAdjacentElement('afterbegin', headerContainer); // Add the header to the top of the body
            initializeCountrySelector(); // Initialize the country selector
            initializeShortCountrySelector();
            initializeRegionPrice();
        })
        .catch(error => {
            console.error(error);
        });
});
