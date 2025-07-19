import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GoogleMap from "../googleMap";
import BottomMenu from '../reusables/bottomMenu';
import ProfileButton from "../reusables/bottomMenu/buttons/profileButton";
import SiteSearchButton from "../reusables/bottomMenu/buttons/siteSearchButton";
import DiveSiteButton from "../reusables/bottomMenu/buttons/diveSiteButton";
import ItineraryListButton from "../reusables/bottomMenu/buttons/itineraryCreatorButton";
import GuidesButton from "../reusables/bottomMenu/buttons/guidesButton";
import AnimalTopAutoSuggest from "../animalTags/animalTagContainer";
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
import { moderateScale } from "react-native-size-matters";
import BottomDrawer from '../screens/bottomDrawer/animatedBottomDrawer';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import { useMapStore } from "../googleMap/useMapStore";
import { EmailFeedback } from "../feed/emailFeedback";
import FeedScreens from "../feed/screens";
import { useTranslation } from "react-i18next";
import SearchTool from '../searchTool';
import * as S from './styles';
import { ActiveProfile } from "../../entities/profile";


const windowWidth = Dimensions.get("window").width;
let feedbackRequest = null;
let FbWidth = moderateScale(350);

export default function MapPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
 
  const mapConfig = useMapStore((state) => state.mapConfig);

  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [anchPhotos, setAnchPhotos] = useState(null);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const { t } = useTranslation();

  useEffect(() => {
    filterAnchorPhotos();
  }, [selectedDiveSite]);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      let photos;
      if (animalMultiSelection.length === 0) {
        photos = await getPhotosWithUserEmpty({
          myCreatures,
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

  const getProfile = async () => {
    let sessionUserId = activeSession.user.id;
    // let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
    try {
      const success: ActiveProfile = await grabProfileByUserId(sessionUserId);
      if (success) {
        let bully = success && success.UserName;
        if (bully == null || bully === "") {
          setTimeout(() => {
            setActiveTutorialID("OnboardingX");
            setFullScreenModal(true);
          }, 500);
        } else {
          setFullScreenModal(false);
          setProfile(success);
        }
        if (success[0].feedbackRequested === false) {
          feedbackRequest = setTimeout(() => {
            startFeedbackAnimations();
            updateProfileFeeback(success[0]);
          }, 180000);
        }
      }
    } catch (e) {
      console.log({ title: "Error43", message: "e.message" });
    }
  };

  useLayoutEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
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

          <S.SafeAreaTop edges={['top']}>
              <SearchTool />
          </S.SafeAreaTop>
      
            {mapConfig === 0 ?
            <S.BottomMenu> 
             <BottomDrawer/> 
              <BottomMenu>
                <ProfileButton />
                <SiteSearchButton />
                <DiveSiteButton />
                {PARTNER_ACCOUNT_STATUS ? <ItineraryListButton /> : <GuidesButton />}
              </BottomMenu>     
          
               </S.BottomMenu>
              : null}

            {mapConfig in [, , 2] || !mapConfig ? (
              <View style={styles.carrousel} pointerEvents={"box-none"}>

                  <View style={styles.animalSelect} pointerEvents={"box-none"}>
                    <AnimalTopAutoSuggest transTagsY={transTagsY} />
                  </View>

              </View>
            ) : null}

            {mapConfig === 0 && <EmailFeedback />}
         
            <FeedScreens />
            <LevelOneScreen />
            <LevelTwoScreen />
            <LevelThreeScreen />
            <AnimatedFullScreenModal />

     
          </S.Container>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  animalSelect: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    zIndex: 1,
    // backgroundColor: "pink"
  },
  carrousel: {
    position: "absolute",
    flexDirection: "column",
    alignContent: "center",
    // backgroundColor: "blue",
    height: 105,
    top: windowWidth > 700 ? moderateScale(90) : Platform.OS === 'android' ? moderateScale(90) : moderateScale(120),
    zIndex: 2,
  },
});
