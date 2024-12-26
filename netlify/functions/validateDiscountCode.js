const fetch = require("node-fetch");

exports.handler = async (event) => {
    try {
        // Parse the incoming discount code
        const { discountCode } = JSON.parse(event.body);

        if (!discountCode) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No discount code provided." }),
            };
        }

        // Fetch the discount codes (could be from GitHub or another source)
        const response = await fetch("https://raw.githubusercontent.com/your-repo/discounts.json");
        if (!response.ok) {
            throw new Error("Failed to fetch discount codes.");
        }

        const discountData = await response.json();

        // Validate the discount code
        const isValid = discountData.codes.includes(discountCode);

        return {
            statusCode: 200,
            body: JSON.stringify({ valid: isValid }),
        };
    } catch (error) {
        console.error("Error validating discount code:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
