import { createClient } from "@supabase/supabase-js";

/**
 * NOTE: For Expo API Routes, ensure these variables are in your root .env file:
 * SUPABASE_URL=https://your-id.supabase.co
 * SUPABASE_SERVICE_ROLE_KEY=your-key
 * GEMINI_API_KEY=your-gemini-key
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

// Initialize Supabase Client
// We use the Service Role key here because this is a secure server-side route
const supabase = createClient(supabaseUrl || "", supabaseKey || "");

export async function POST(request: Request) {
    try {
        const { name, type, location } = await request.json();

        // 1. Health Check for Env Variables
        if (!supabaseUrl || !geminiKey) {
            console.error("[Backend] Missing environment variables");
            return Response.json({ error: "Server configuration missing" }, { status: 500 });
        }

        // 2. Step 1: Check Supabase Cache
        // Matches your 'species' or 'dive_sites' table
        const tableName = type === "species" ? "species" : "dive_sites";

        console.log(`[Backend] Checking cache for ${name} in ${tableName}...`);

        const { data: cachedRow, error: fetchError } = await supabase
            .from(tableName)
            .select("blurb")
            .eq("name", name)
            .single();

        // If we have it, return it and save the Gemini quota!
        if (cachedRow?.blurb) {
            console.log(`[Cache Hit] Found: ${name}`);
            return Response.json({ blurb: cachedRow.blurb });
        }

        // 3. Step 2: Request from Gemini (only if not in cache)
        console.log(`[AI] Cache miss. Requesting Gemini 2.0 for: ${name}`);

        const taskPrompt = type === "dive_site"
            ? `Describe the dive site "${name}" in ${location || "British Columbia"}. Focus on marine life. 2 sentences max.`
            : `Give me a 2-sentence fun fact about the marine animal "${name}". Focus on underwater behavior.`;

        const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: taskPrompt }] }],
                    systemInstruction: {
                        parts: [{ text: "You are a helpful scuba diving guide. Provide facts in plain text only. No introductions." }]
                    }
                })
            }
        );

        const aiData = await aiResponse.json();

        if (aiData.error) {
            console.error("[Gemini Error]", aiData.error.message);
            return Response.json({ blurb: `AI temporarily unavailable: ${aiData.error.message}` });
        }

        const blurb = aiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        // 4. Step 3: Update Supabase with the new fact
        if (blurb) {
            console.log(`[Cache Save] Saving new blurb for ${name}`);
            await supabase
                .from(tableName)
                .update({ blurb: blurb })
                .eq("name", name);

            return Response.json({ blurb });
        }

        return Response.json({ blurb: "No information found." });

    } catch (error) {
        console.error("[Backend Crash]", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}