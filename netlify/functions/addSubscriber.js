console.log("GITHUB_TOKEN exists:", !!process.env.GITHUB_TOKEN);

import fetch from "node-fetch";

export async function handler(event) {
  console.log("Event received:", event);

  if (event.httpMethod !== "POST") {
    console.error("Invalid HTTP method:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);
    console.log("Parsed email:", email);

    if (!email) {
      console.error("Email is missing.");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required." }),
      };
    }

    console.log("GITHUB_TOKEN exists:", !!GITHUB_TOKEN); // Checks if the token is defined

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const repo = "EasyAirFlow/EasyAirFlow";
    const filePath = "/client_Information/subscription_letter.JSON";

    // Debugging logs to see if it points to my Json file.
    console.log("Debug Info:");
    console.log("Repository path:", repo);
    console.log("File path:", filePath);

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

    const existingContent = JSON.parse(
      Buffer.from(fileData.content, "base64").toString()
    );
    console.log("Existing file content:", existingContent);

    // Add new subscriber
    existingContent.subscribers.push({
      email,
      date: new Date().toISOString(),
    });

    // Prepare updated content
    const updatedContent = {
      message: "Add new subscriber",
      content: Buffer.from(JSON.stringify(existingContent, null, 2)).toString(
        "base64"
      ),
      sha: fileData.sha,
    };

    console.log("Updating file on GitHub...");
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify(updatedContent),
      }
    );
    console.log("GitHub update status:", updateResponse.status);

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("Error updating file on GitHub:", errorText);
      throw new Error("Failed to update the file on GitHub.");
    }

    console.log("File updated successfully!");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Subscriber added successfully." }),
    };
  } catch (error) {
    console.error("Error in addSubscriber function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error." }),
    };
  }
}
