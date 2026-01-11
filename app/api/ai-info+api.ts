// root/app/api/ai-info+api.ts

export async function POST(request: Request) {
    try {
        const { name, type, location } = await request.json(); // 👈 Added location here
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return Response.json({ error: "Server API Key missing" }, { status: 500 });

        // Logic switch: Create a dynamic prompt based on type and location
        let taskPrompt = "";

        if (type === "dive_site") {
            // Use location if provided, otherwise fallback to a general search
            const locationContext = location ? `in ${location}` : "globally";
            taskPrompt = `Describe the dive site "${name}" ${locationContext}. Focus on unique marine life, topography, or underwater conditions.`;
        } else {
            taskPrompt = `Provide a 2-sentence fun fact about the ${name} for a scuba diving app. Focus on underwater behavior.`;
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{
                            text: "You are a specialized scuba diving assistant. Output ONLY the facts requested in 2 to 3 sentences. No introductions or conversational filler."
                        }]
                    },
                    contents: [{ parts: [{ text: taskPrompt }] }]
                })
            }
        );

        const data = await response.json();
        const blurb = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No information found.";

        return Response.json({ blurb });

    } catch (error) {
        return Response.json({ error: "Failed to fetch from Gemini" }, { status: 500 });
    }
}