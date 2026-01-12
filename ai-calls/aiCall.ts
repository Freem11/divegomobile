import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.hostUri
    ? `http://${Constants.expoConfig.hostUri.split(":").shift()}:8081`
    : "";

export const fetchAiBlurb = async (
    name: string,
    type: "species" | "dive_site",
    location?: string
) => {
    try {
        console.log(`[Frontend] Fetching ${type}: ${name}...`);
        const response = await fetch(`${BASE_URL}/api/ai-info`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, type, location }),
        });

        const data = await response.json();
        return data.blurb || null;
    } catch (error) {
        console.error("Network Error:", error);
        return null;
    }
};

export const loadSeaLifeInfo = async (speciesName: string) => {
    const fact = await fetchAiBlurb(speciesName, "species");

    if (fact) {
        console.log(`[Success] ${speciesName} fact received.`);
        return fact;
    }

    console.warn(`[Fail] No info returned for ${speciesName}`);
    return "No fun facts found for this species.";
};

export const loadDiveSiteInfo = async (siteName: string, siteLocation: string) => {
    const description = await fetchAiBlurb(siteName, "dive_site", siteLocation);

    if (description) {
        console.log(`[Success] ${siteName} info received.`);
        return description;
    }

    console.warn(`[Fail] No info returned for site: ${siteName}`);
    return "Description currently unavailable for this site.";
};