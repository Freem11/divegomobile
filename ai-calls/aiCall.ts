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

export const loadSeaLifeInfo = async (speciesName) => {
    try {
        // We pass only the name; the backend defaults to species logic
        const fact = await fetchAiBlurb(speciesName, "species");

        if (fact) {
            console.log(`Fun Fact for ${speciesName}:`, fact);
            return fact;
        }
    } catch (error) {
        console.error("Error loading species info:", error);
    }
    return "No fun facts found for this species.";
};

export const loadDiveSiteInfo = async (siteName, siteLocation) => {
    try {
        const description = await fetchAiBlurb(siteName, "dive_site", siteLocation);

        if (description) {
            console.log(`Site Info for ${siteName}:`, description);
            return description;
        }
    } catch (error) {
        console.error("Error loading dive site info:", error);
    }
    return "Description currently unavailable for this site.";
};