import fetch from "node-fetch";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Email is required." }),
        };
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const repo = "EasyAirFlow/EasyAirFlow";
    const filePath = "subscription_letter.JSON";

    try {
        // Fetch existing file from GitHub
        const fileResponse = await fetch(
            `https://api.github.com/repos/${repo}/contents/${filePath}`,
            {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
            }
        );

        if (!fileResponse.ok) {
            throw new Error("Failed to fetch the file from GitHub.");
        }

        const fileData = await fileResponse.json();
        const existingContent = JSON.parse(
            Buffer.from(fileData.content, "base64").toString()
        );

        // Add new subscriber
        existingContent.subscribers.push({
            email,
            date: new Date().toISOString(),
        });

        // Prepare updated content
        const updatedContent = {
            message: "Add new subscriber",
            content: Buffer.from(JSON.stringify(existingContent, null, 2)).toString("base64"),
            sha: fileData.sha,
        };

        // Update the file on GitHub
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

        if (!updateResponse.ok) {
            throw new Error("Failed to update the file on GitHub.");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Subscriber added successfully." }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error." }),
        };
    }
}
