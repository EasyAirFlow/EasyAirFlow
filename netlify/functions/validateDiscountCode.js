import fetch from "node-fetch";

export async function handler(event) {
  console.log("Event received:", event);

  // Ensure only POST requests are processed
  if (event.httpMethod !== "POST") {
    console.error("Invalid HTTP method:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { discountCode } = JSON.parse(event.body); // Parse the request body
    console.log("Parsed discount code:", discountCode);

    if (!discountCode) {
      console.error("Discount code is missing.");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Discount code is required." }),
      };
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Securely load the GitHub token from environment variables
    if (!GITHUB_TOKEN) {
      console.error("GITHUB_TOKEN is not defined in environment variables.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfiguration: Missing GITHUB_TOKEN" }),
      };
    }

    const repo = "EasyAirFlow/EasyAirFlow"; // GitHub repository
    const filePath = "client_Information/discounts.json"; // Path to the JSON file containing discount codes

    console.log("Debug Info:");
    console.log("Repository path:", repo);
    console.log("File path:", filePath);

    // Fetch the discount codes file from GitHub
    console.log("Fetching file from GitHub...");
    const fileResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      }
    );
    console.log("GitHub fetch status:", fileResponse.status);

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      console.error("Error fetching file from GitHub:", errorText);
      throw new Error("Failed to fetch the file from GitHub.");
    }

    const fileData = await fileResponse.json();
    console.log("Fetched file data:", fileData);

    // Decode and parse the discount codes
    const discountCodes = JSON.parse(
      Buffer.from(fileData.content, "base64").toString()
    );
    console.log("Existing discount codes:", discountCodes); // should be removed someday.

    // Check if the discount code is valid
    const isValid = discountCodes.codes.includes(discountCode);

    console.log(`Discount code "${discountCode}" validity:`, isValid);

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid }),
    };
  } catch (error) {
    console.error("Error in validateDiscountCode function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error." }),
    };
  }
}
