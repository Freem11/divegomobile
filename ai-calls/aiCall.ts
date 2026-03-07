import Constants from "expo-constants";

const BASE_URL = __DEV__
    ? (Constants.expoConfig?.hostUri
        ? `http://${Constants.expoConfig.hostUri.split(":").shift()}:8081`
        : "http://localhost:8081")
    : "https://divegomobile.expo.app";

export const fetchAiBlurb = async (
    name: string,
    type: "species" | "dive_site",
    location?: string,
    id?: number // Added id parameter to support diveSites lookup
) => {
    try {
        console.log(`[Frontend] Fetching ${type}: ${name} (ID: ${id || "N/A"})...`);
        const response = await fetch(`${BASE_URL}/api/ai-info`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, type, location, id }), // Pass id to the backend
        });

        const data = await response.json();
        return data.blurb || null;
    } catch (error) {
        console.error("Network Error:", error);
        return null;
    }
};

export const loadSeaLifeInfo = async (speciesName: string) => {
    // Species still uses name-based lookup
    const fact = await fetchAiBlurb(speciesName, "species");

    if (fact) {
        console.log(`[Success] ${speciesName} fact received.`);
        return fact;
    }

    console.warn(`[Fail] No info returned for ${speciesName}`);
    return "No fun facts found for this species.";
};

export const loadDiveSiteInfo = async (id: number, siteName: string, lat: number, lng: number) => {
    // Combine lat/lng into a string for the backend context
    const locationContext = `${lat}, ${lng}`;

    // Pass the id through to fetchAiBlurb
    const description = await fetchAiBlurb(siteName, "dive_site", locationContext, id);

    if (description) {
        console.log(`[Success] ${siteName} (ID: ${id}) info received.`);
        return description;
    }

    console.warn(`[Fail] No info returned for site: ${siteName}`);
    return "Description currently unavailable for this site.";
};