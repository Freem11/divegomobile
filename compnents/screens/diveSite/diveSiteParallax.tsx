import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import email from "react-native-email";

import noImage from "../../png/NoImage.png";
import IconWithLabel from "../../reusables/iconWithLabal";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { allMetrics } from "../../../supabaseCalls/monthlyReviewMetrics/gets";
import { MetricItem } from "../../../entities/metricItem";
import { useMapStore } from "../../googleMap/useMapStore";
import { MapConfigurations } from "../../googleMap/types";
import { loadDiveSiteInfo } from "../../../ai-calls/aiCall";
import { updateDiveSiteFact } from "../../../supabaseCalls/diveSiteCalls/updates";
import getImagePublicUrl from "../../helpers/getImagePublicUrl";
import { IMAGE_SIZE } from "../../../entities/image";

import { useDiveSiteNavigation } from "./types";

import DiveSiteScreen from "./index";

type DiveSiteParallaxProps = {
  id: number;
};

export default function DiveSiteParallax(props: DiveSiteParallaxProps) {
  const diveSiteNavigation = useDiveSiteNavigation();
  const { t } = useTranslation();
  const drawerRef = useRef<ParallaxDrawerHandle>(null);

  const { userProfile } = useUserProfile();
  const { selectedDiveSite, setSelectedDiveSite } = useContext(SelectedDiveSiteContext);

  const [isPartnerAccount, setIsPartnerAccount] = useState(false);
  const [metricInfo, setMetricInfo] = useState<MetricItem[]>(null);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);

  // --- AI Rate Limit Shields ---
  const isFetchingAi = useRef(false);
  const hasErrorThisSession = useRef(false); // Blocks retries if API fails once

  // 1. Initial Data Load
  useEffect(() => {
    if (props.id) {
      getInitialData();
      if (userProfile?.partnerAccount) {
        setIsPartnerAccount(true);
      }
    }
    return () => {
      setMetricInfo(null);
    };
  }, [props.id]);

  const getInitialData = async () => {
    try {
      const [diveSiteinfo, monthlyMetrics] = await Promise.all([
        getDiveSiteById(props.id),
        allMetrics(props.id)
      ]);

      console.log("diveSiteinfo", diveSiteinfo);
      if (diveSiteinfo) {
        if (diveSiteinfo.id === props.id) {
          setSelectedDiveSite(diveSiteinfo);
        }
      }
      setMetricInfo(monthlyMetrics);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  // 2. AI Fact Detection & Trigger with Debounce
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    // Condition: Correct site, no bio exists, not currently fetching, and no previous session error
    const shouldAttemptAI =
      selectedDiveSite?.id === props.id &&
      !selectedDiveSite.divesitebio &&
      !isFetchingAi.current &&
      !hasErrorThisSession.current;

    if (shouldAttemptAI) {
      // Shield 1: Debounce. Wait 2.5 seconds before firing.
      // If the user closes the drawer or moves sites, this is cancelled.
      debounceTimer = setTimeout(() => {
        handleGetAiBlurb();
      }, 2500);
    }

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [selectedDiveSite?.id, selectedDiveSite?.divesitebio]);

  const handleGetAiBlurb = async () => {
    if (isFetchingAi.current || hasErrorThisSession.current) return;
    isFetchingAi.current = true;

    try {
      // Shield 2: Development Mock
      // Toggle this to true when you want to test UI without wasting Gemini Quota
      const USE_MOCK_AI = __DEV__ && false;

      if (USE_MOCK_AI) {
        console.log("[AI] Dev Mode: Returning Mock Bio for", selectedDiveSite.name);
        const mockBlurb = `This is a beautiful dive site at ${selectedDiveSite.name}. (Mock AI Description)`;
        setSelectedDiveSite({ ...selectedDiveSite, divesitebio: mockBlurb });
        return;
      }

      console.log(`[AI] Calling Gemini for: ${selectedDiveSite.name}`);
      const blurb = await loadDiveSiteInfo(
        selectedDiveSite.id,
        selectedDiveSite.name,
        selectedDiveSite.lat,
        selectedDiveSite.lng
      );

      // Shield 3: Circuit Breaker for Errors
      if (blurb && (blurb.includes("Quota exceeded") || blurb.startsWith("AI Error:"))) {
        console.warn("[AI] Quota hit or error received. Silencing AI for this session.");
        hasErrorThisSession.current = true;

        // Optionally show the error to the user once
        setSelectedDiveSite({ ...selectedDiveSite, divesitebio: "Description temporarily unavailable." });
        return;
      }

      if (blurb && blurb !== "Description currently unavailable for this site.") {
        // 1. Perform the background update
        await updateDiveSiteFact(selectedDiveSite.id, blurb);

        // 2. Update local state by MERGING so we don't lose the photo
        setSelectedDiveSite((prev) => ({
          ...prev,
          divesitebio: blurb
        }));
      }
    } catch (error) {
      hasErrorThisSession.current = true;
      console.error("AI Update Failed:", error);
    } finally {
      isFetchingAi.current = false;
    }
  };

  console.log("selectedDiveSite", selectedDiveSite);

  const headerImageSource = selectedDiveSite?.profilePhoto?.file_name ? { uri: getImagePublicUrl(selectedDiveSite?.profilePhoto, IMAGE_SIZE.XL) } : noImage;
  const onClose = async () => {
    diveSiteNavigation.goBack();
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapConfig(MapConfigurations.TripView, { pageName: "DiveSite", itemId: selectedDiveSite.id });
  };

  const openDiveSiteReviewer = () => {
    diveSiteNavigation.navigate("SiteReviewCreator", {
      selectedDiveSite: selectedDiveSite.id,
      siteName: selectedDiveSite.name
    });
  };

  const openPicUploader = () => {
    diveSiteNavigation.navigate("AddSighting", {
      selectedDiveSite: selectedDiveSite,
      siteName: selectedDiveSite.name
    });
  };

  const handleReport = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      subject: `Reporting issue with Dive Site: "${selectedDiveSite.name}"`,
      body: `Latitude: ${selectedDiveSite.lat}\nLongitude: ${selectedDiveSite.lng}\n\nIssue Details:`,
      checkCanOpen: false,
    }).catch(console.error);
  };

  const popoverContent = () => (
    <>
      <IconWithLabel label={t("DiveSite.addReview")} iconName="diving-snorkel" buttonAction={openDiveSiteReviewer} />
      <IconWithLabel label={t("DiveSite.addSighting")} iconName="camera-plus" buttonAction={openPicUploader} />
      <IconWithLabel label={t("DiveSite.report")} iconName="flag" buttonAction={handleReport} />
    </>
  );

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={headerImageSource}
      onClose={onClose}
      onMapFlip={onNavigate}
      popoverContent={popoverContent}
      isMyShop={isPartnerAccount}
    >
      {selectedDiveSite ? (
        <DiveSiteScreen
          selectedDiveSite={selectedDiveSite}
          openPicUploader={openPicUploader}
          openDiveSiteReviewer={openDiveSiteReviewer}
          metricInfo={metricInfo}
        />
      ) : null}
    </ParallaxDrawer>
  );
}