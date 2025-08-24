import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import { useTranslation } from "react-i18next";

import GoogleMap from "../googleMap";
import BottomMenu from "../reusables/bottomMenu";
import ProfileButton from "../reusables/bottomMenu/buttons/profileButton";
import SiteSearchButton from "../reusables/bottomMenu/buttons/siteSearchButton";
import DiveSiteButton from "../reusables/bottomMenu/buttons/diveSiteButton";
import ItineraryListButton from "../reusables/bottomMenu/buttons/itineraryCreatorButton";
import GuidesButton from "../reusables/bottomMenu/buttons/guidesButton";
import AnimalTagsContainer from "../animalTags/animalTagContainer";
import AnimatedFullScreenModal from "../reusables/animatedFullScreenModal";
import LevelOneScreen from "../reusables/levelOneScreen";
import LevelTwoScreen from "../reusables/levelTwoScreen";
import LevelThreeScreen from "../reusables/levelThreeScreen";
import {
  grabProfileByUserId,
  updateProfileFeeback,
} from "../../supabaseCalls/accountSupabaseCalls";
import {
  getPhotosWithUser,
  getPhotosWithUserEmpty,
} from "../../supabaseCalls/photoSupabaseCalls";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SessionContext } from "../contexts/sessionContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import BottomDrawer from "../screens/bottomDrawer/animatedBottomDrawer";
import { useMapStore } from "../googleMap/useMapStore";
import { EmailFeedback } from "../feed/emailFeedback";
import FeedScreens from "../feed/screens";
import SearchTool from "../searchTool";
import { ActiveProfile } from "../../entities/profile";
import { useUserProfileStore } from "../../store/useUserProfileStore";

import * as S from "./styles";

const windowWidth = Dimensions.get("window").width;
let feedbackRequest = null;
const FbWidth = moderateScale(350);

export default function MapPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  const mapConfig = useMapStore((state) => state.mapConfig);

  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  // const { activeSession } = useContext(SessionContext);
  // const { profile, setProfile } = useContext(UserProfileContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [anchPhotos, setAnchPhotos] = useState(null);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const profile = useUserProfileStore(state => state.profile);

  const { t } = useTranslation();

  useEffect(() => {
    filterAnchorPhotos();
  }, [selectedDiveSite]);

  const filterAnchorPhotos = async() => {
    const { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      let photos;
      if (animalMultiSelection.length === 0) {
        photos = await getPhotosWithUserEmpty({
          myCreatures: profile.UserID,
          userId: profile.UserID,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      } else {
        photos = await getPhotosWithUser({
          animalMultiSelection,
          userId: profile.UserID,
          myCreatures,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      }
      if (photos) {
        let count = 0;
        photos.forEach((obj) => {
          count++;
        });
        setAnchPhotos(count);
      }
    } catch (e) {
      console.log({ title: "Error66", message: e.message });
    }
  };

  const feedbackX = useSharedValue(0);

  const feedbackReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: feedbackX.value }],
    };
  });

  const startFeedbackAnimations = () => {
    if (feedbackX.value === 0) {
      feedbackX.value = withSpring(moderateScale(250));
    } else {
      feedbackX.value = withTiming(0);
    }
  };

  const transYtags = useSharedValue(0);

  const transTagsY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYtags.value }],
    };
  });

  const getProfile = async() => {
    try {
      if (profile) {
        if (profile.UserName == null || profile.UserName === "") {
          setTimeout(() => {
            setActiveTutorialID("OnboardingX");
            setFullScreenModal(true);
          }, 500);
        } else {
          setFullScreenModal(false);
        }
        if (profile.feedbackRequested === false) {
          feedbackRequest = setTimeout(() => {
            startFeedbackAnimations();
            updateProfileFeeback(profile);
          }, 180000);
        }
      }
    } catch (e) {
      console.log({ title: "Error43", message: "e.message" });
    }
  };

  useLayoutEffect(() => {
    console.log("hey!!");
    getProfile();
  }, []);

  useEffect(() => {
    console.log("wtf!!");
    setLevelOneScreen(false);
    setLevelTwoScreen(false);
    getProfile();
  }, []);

  const PARTNER_ACCOUNT_STATUS =
  (profile?.partnerAccount) || false;

  return (
    <SafeAreaProvider>
      <S.Container>

        <GoogleMap style={StyleSheet.absoluteFillObject} />

        <S.SafeAreaTop edges={["top"]}>
          <SearchTool />

          {/* {mapConfig in [, , 2] || !mapConfig ? (
            <AnimalTagsContainer transTagsY={transTagsY} />
          ) : null} */}
        </S.SafeAreaTop>

        {mapConfig === 0 ? (
          <S.SafeAreaBottom edges={["bottom"]}>
            <S.BottomMenu>
              <BottomDrawer/>
              <BottomMenu>
                <ProfileButton />
                <SiteSearchButton />
                <DiveSiteButton />
                {PARTNER_ACCOUNT_STATUS ? <ItineraryListButton /> : <GuidesButton />}
              </BottomMenu>

            </S.BottomMenu>
          </S.SafeAreaBottom>
        )
          : null}

        {/* {mapConfig === 0 && <EmailFeedback />} */}

        <FeedScreens />
        <LevelOneScreen />
        <LevelTwoScreen />
        <LevelThreeScreen />
        <AnimatedFullScreenModal />

      </S.Container>
    </SafeAreaProvider>
  );
}