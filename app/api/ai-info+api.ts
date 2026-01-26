import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

export async function POST(request: Request) {
    try {
        const { id, name, type, location, image } = await request.json();

        if (!supabaseUrl || !geminiKey) {
            console.error("[Backend] Environment variables missing");
            return Response.json({ error: "Server configuration missing" }, { status: 500 });
        }

        // --- BRANCH 1: IMAGE IDENTIFICATION ---
        if (type === "identify") {
            if (!image) {
                return Response.json({ error: "No image provided for identification" }, { status: 400 });
            }

            console.log(`[AI] Identifying image at location: ${location || "Unknown"}`);

            // Using 1.5 Flash as it's the stable workhorse for Vision on Free Tier
            const VISION_MODEL = "gemini-2.5-flash";
            const identifyPrompt = `Context: This creature was photographed at GPS (${location || "unknown location"}). 
                                    Identify this sea creature. Return ONLY the specific English common name. 
                                    No Latin names. No extra conversational text.`;

            const aiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL}:generateContent?key=${geminiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: identifyPrompt },
                                { inlineData: { mimeType: "image/jpeg", data: image } }
                            ]
                        }]
                    })
                }
            );

            const aiData = await aiResponse.json();

            if (aiData.error) {
                console.error("[Gemini Vision Error]", aiData.error.message);
                return Response.json({ error: aiData.error.message }, { status: 400 });
            }

            const identifiedName = aiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            return Response.json({ name: identifiedName || "Unknown Species" });
        }

        // --- BRANCH 2: TEXT BLURBS (DIVE SITES & SPECIES FACTS) ---
        const isSpecies = type === "species";
        const tableName = isSpecies ? "species" : "diveSites";
        const lookupField = isSpecies ? "name" : "id";
        const lookupValue = isSpecies ? name : id;
        const columnToUpdate = isSpecies ? "blurb" : "diveSiteBio";

        // 1. Check Cache
        const { data: cachedRow } = await supabase
            .from(tableName)
            .select(columnToUpdate)
            .eq(lookupField, lookupValue)
            .single();

        if (cachedRow && cachedRow[columnToUpdate] && !cachedRow[columnToUpdate].startsWith("AI Error:")) {
            console.log(`[Cache Hit] Returning saved info for ${name || id}`);
            return Response.json({ blurb: cachedRow[columnToUpdate] });
        }

        // 2. Request from Gemini 2.0
        const MODEL_ID = "gemini-2.0-flash-exp";
        console.log(`[AI] Cache miss. Requesting ${MODEL_ID} for: ${name || id}`);

        const taskPrompt = !isSpecies
            ? `Write a 2-3 sentence description for the dive site "${name}". 
               Use these coordinates only for context: ${location}. 
               Focus on marine life and topography. Do not mention coordinates.`
            : `Provide a 2-sentence fun fact about the marine animal "${name}".`;

        const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${geminiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: taskPrompt }] }],
                    systemInstruction: {
                        parts: [{
                            text: "You are a local scuba diving expert. Speak naturally. No introductions. No coordinates."
                        }]
                    }
                })
            }
        );

        const aiData = await aiResponse.json();

        // 3. Error Handling
        if (aiData.error) {
            console.error("[Gemini Error]", aiData.error.message);
            const isQuota = aiData.error.message?.toLowerCase().includes("quota");
            return Response.json({ error: aiData.error.message }, { status: isQuota ? 429 : 400 });
        }

        const blurb = aiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        // 4. Update Cache
        if (blurb && blurb.length > 5) {
            console.log(`[Cache Save] Updating ${tableName} row ${lookupValue}`);
            await supabase
                .from(tableName)
                .update({ [columnToUpdate]: blurb })
                .eq(lookupField, lookupValue);

            return Response.json({ blurb });
        }

        return Response.json({ error: "No information found." }, { status: 404 });

    } catch (error) {
        console.error("[Backend Crash]", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}