import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.hostUri
    ? `http://${Constants.expoConfig.hostUri.split(":").shift()}:8081`
    : "";

/**
 * Core helper to communicate with your backend AI endpoint.
 * Supports blurbs (text) and identification (images).
 */
export const fetchAiInfo = async (payload: {
    type: "species" | "dive_site" | "identify";
    name?: string;
    location?: string;
    id?: number;
    image?: string; // base64 string
}) => {
    try {
        console.log(`[Frontend] Requesting AI ${payload.type}...`);

        const response = await fetch(`${BASE_URL}/api/ai-info`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[AI Error] ${data.error || "Unknown error"}`);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Network Error:", error);
        return null;
    }
};

/**
 * Loads fun facts for a known species name.
 */
export const loadSeaLifeInfo = async (speciesName: string) => {
    const data = await fetchAiInfo({
        name: speciesName,
        type: "species"
    });

    if (data?.blurb) {
        console.log(`[Success] ${speciesName} fact received.`);
        return data.blurb;
    }

    console.warn(`[Fail] No info returned for ${speciesName}`);
    return "No fun facts found for this species.";
};

/**
 * Loads the bio/description for a specific dive site.
 */
export const loadDiveSiteInfo = async (id: number, siteName: string, lat: number, lng: number) => {
    const locationContext = `${lat}, ${lng}`;

    const data = await fetchAiInfo({
        id,
        name: siteName,
        type: "dive_site",
        location: locationContext
    });

    if (data?.blurb) {
        console.log(`[Success] ${siteName} (ID: ${id}) info received.`);
        return data.blurb;
    }

    console.warn(`[Fail] No info returned for site: ${siteName}`);
    return "Description currently unavailable for this site.";
};

/**
 * Sends an image to the backend to identify the creature.
 * Now uses your backend instead of an external API key.
 */
export const identifySeaLife = async (base64Image: string, coords?: { lat: number; lng: number }) => {
    const locationContext = coords ? `${coords.lat}, ${coords.lng}` : "unknown";

    const data = await fetchAiInfo({
        type: "identify",
        image: base64Image,
        location: locationContext
    });

    if (data?.name) {
        console.log(`[Success] Identified as: ${data.name}`);
        return data.name;
    }

    console.warn("[Fail] Could not identify sea life.");
    return "Unknown Sea Life";
};