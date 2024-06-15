import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import email from "react-native-email";
import Map from "./GoogleMap";
import FABMenu from "./FABMenu/bottomBarMenu";
import FABButtons from "./FABset";
import Logo from "./logo/logoButton";
import AnimalTopAutoSuggest from "./animalTags/animalTagContainer";
import {
  grabProfileById,
  updateProfileFeeback,
  updatePushToken,
} from "./../supabaseCalls/accountSupabaseCalls";
import {
  getPhotosforAnchorMulti,
  getPhotosWithUser,
  getPhotosWithUserEmpty,
} from "./../supabaseCalls/photoSupabaseCalls";
import { userCheck } from "./../supabaseCalls/authenticateSupabaseCalls";
import { newGPSBoundaries } from "./helpers/mapHelpers";
import PhotoMenu from "./photoMenu/photoMenu";
import Historgram from "./histogram/histogramBody";
import PhotoFilterer from "./photoMenu/photoFilter";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { PictureAdderContext } from "./contexts/picModalContext";
import { MasterContext } from "./contexts/masterContext";
import { MinorContext } from "./contexts/minorContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { PinContext } from "./contexts/staticPinContext";
import { DiveSpotContext } from "./contexts/diveSpotContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { MonthSelectContext } from "./contexts/monthSelectContext";
import { TutorialModelContext } from "./contexts/tutorialModalContext";
import { ChapterContext } from "./contexts/chapterContext";
import { SecondTutorialModalContext } from "./contexts/secondTutorialModalContext";
import { ThirdTutorialModalContext } from "./contexts/thirdTutorialModalContext";
import { TutorialLaunchPadContext } from "./contexts/tutorialLaunchPadContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { AnchorModalContext } from "./contexts/anchorModalContext";
import { CommentsModalContext } from "./contexts/commentsModalContext";
import { DSAdderContext } from "./contexts/DSModalContext";
import { IterratorContext } from "./contexts/iterratorContext";
import { Iterrator2Context } from "./contexts/iterrator2Context";
import { Iterrator3Context } from "./contexts/iterrator3Context";
import { MapHelperContext } from "./contexts/mapHelperContext";
import { UserProfileContext } from "./contexts/userProfileContext";
import { SessionContext } from "./contexts/sessionContext";
import { TutorialContext } from "./contexts/tutorialContext";
import { AnimalMultiSelectContext } from "./contexts/animalMultiSelectContext";
import { SearchTextContext } from "./contexts/searchTextContext";
import { AreaPicsContext } from "./contexts/areaPicsContext";
import { ModalSelectContext } from "./contexts/modalSelectContext";
import { SelectedShopContext } from "./contexts/selectedShopContext";
import { ShopModalContext } from "./contexts/shopModalContext";
import { ZoomHelperContext } from "./contexts/zoomHelperContext";
import { SitesArrayContext } from "./contexts/sitesArrayContext";
import { DiveSiteSearchModalContext } from "./contexts/diveSiteSearchContext";
import { MapSearchModalContext } from "./contexts/mapSearchContext";
import { PullTabContext } from "./contexts/pullTabContext";
import { scale, moderateScale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  interpolate,
  Easing,
  withSpring,
} from "react-native-reanimated";
import TutorialLaunchPadModal from "./modals/tutorialsModal";
import AnchorModal from "./modals/anchorModal";
import CommentsModal from "./modals/commentsModal";
import PhotoBoxModel from "./modals/photoBoxModal";
import DiveSiteModal from "./modals/diveSiteAdderModal";
import PicUploadModal from "./modals/picUploaderModal";
import IntroTutorial from "./tutorial/introTutorial";
import SecondTutorial from "./tutorial/secondTutorial";
import ThirdTutorial from "./tutorial/thirdTutorial";
import TutorialBar from "./tutorialBar/tutorialBarContainer";
import UserProfileModal from "./modals/userProfileModal";
import SettingsModal from "./modals/settingsModal";
import ShopModal from "./modals/shopModal";
import MapSearchModal from "./modals/mapSearchModal";
import DiveSiteSearchModal from "./modals/diveSiteSearchModal";
import * as ScreenOrientation from "expo-screen-orientation";
import { ProfileModalContext } from "./contexts/profileModalContext";
import { SettingsContext } from "./contexts/gearModalContext";
import { MaterialIcons } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let feedbackRequest = null;
let feedbackRequest2 = null;
let FbWidth = moderateScale(350);


export default function MapPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { chosenModal, setChosenModal } = useContext(ModalSelectContext);

  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);
  const { minorSwitch, setMinorSwitch } = useContext(MinorContext);
  const { dragPin } = useContext(PinSpotContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const { textvalue, setTextValue } = useContext(SearchTextContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);

  const { animalSelection } = useContext(AnimalSelectContext);
  const [monthVal, setMonthVal] = useState("");
  const { mapHelper, setMapHelper } = useContext(MapHelperContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
  const [anchPhotos, setAnchPhotos] = useState(null);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const [isOpen, setIsOpen] = useState(false);
  const [anchButState, setAnchButState] = useState(false);

  useEffect(() => {
    filterAnchorPhotos();
  }, [selectedDiveSite]);

  // useEffect(() => {
  //   zoomHelper ? setMasterSwitch(false) : setMasterSwitch(true);
  // }, [zoomHelper]);

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
          userId: profile[0].UserID,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      } else {
        photos = await getPhotosWithUser({
          animalMultiSelection,
          userId: profile[0].UserID,
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

  //Tutorial Launch Pad Model Animation
  const tutorialLaunchpadModalY = useSharedValue(windowHeight);
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );

  const tutorialLaunchpadModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorialLaunchpadModalY.value }],
    };
  });

  const startTutorialLaunchPadModalAnimations = () => {
    if (tutorialLaunchpadModal) {
      tutorialLaunchpadModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      tutorialLaunchpadModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startTutorialLaunchPadModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [tutorialLaunchpadModal]);

  //Anchor Modal Animation
  const anchorModalY = useSharedValue(windowHeight);
  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  const { selectedDiveSite, setSelectedDiveSite } = useContext(
    SelectedDiveSiteContext
  );

  const anchorModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: anchorModalY.value }],
    };
  });

  const startAnchorModalAnimations = () => {
    if (siteModal) {
      anchorModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      anchorModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startAnchorModalAnimations();

    if (tutorialRunning && siteModal) {
      if (itterator > 0 && itterator !== 11 && itterator !== 20) {
        setItterator(itterator + 1);
      } else if (itterator === 11 && anchPhotos === 0) {
        setItterator(itterator + 1);
      } else if ((itterator === 18 || itterator === 11) && anchPhotos > 0) {
        setItterator(itterator + 2);
      }
    }
  }, [siteModal]);

  //Comments Modal Animation
  const commentsModalY = useSharedValue(windowHeight);
  const { commentsModal, setCommentsModal } = useContext(CommentsModalContext);

  const commentsModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: commentsModalY.value }],
    };
  });

  const startCommentsModalAnimations = () => {
    if (commentsModal) {
      commentsModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      commentsModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startCommentsModalAnimations();
  }, [commentsModal]);

  //Shop Modal Animation
  const shopModalY = useSharedValue(windowHeight);
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const { shopModal, setShopModal } = useContext(ShopModalContext);

  const shopModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: shopModalY.value }],
    };
  });

  const startShopModalAnimations = () => {
    if (shopModal) {
      shopModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      shopModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startShopModalAnimations();
  }, [shopModal]);

  //PhotoBox Modal Animation
  const photoBoxModalY = useSharedValue(windowHeight);
  const [photoBoxModel, setPhotoBoxModel] = useState(false);
  const photoBoxModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: photoBoxModalY.value }],
    };
  });

  const startPhotoBoxModalAnimations = () => {
    if (photoBoxModel) {
      photoBoxModalY.value = withTiming(-windowHeight);
    } else {
      photoBoxModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    startPhotoBoxModalAnimations();
  }, [photoBoxModel]);

  //Dive Site Modal Animation
  const diveSiteModalY = useSharedValue(windowHeight);
  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );

  const diveSiteModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: diveSiteModalY.value }],
    };
  });

  const startDiveSiteModalAnimations = () => {
    if (diveSiteAdderModal) {
      diveSiteModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      Keyboard.dismiss();
      // console.log(masterSwitch);
      if (masterSwitch) {
        setAddSiteVals({
          ...addSiteVals,
          Site: "",
          Latitude: "",
          Longitude: "",
        });
      }

      diveSiteModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startDiveSiteModalAnimations();
    // if (itterator > 0){
    //   setItterator(itterator + 1);
    // }
  }, [diveSiteAdderModal]);

  //Picture Adder Modal
  const pictureModalY = useSharedValue(windowHeight);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

  const pictureModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: pictureModalY.value }],
    };
  });

  const startPictureModalAnimations = () => {
    if (picAdderModal) {
      pictureModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      // console.log(masterSwitch);
      Keyboard.dismiss();
      if (masterSwitch) {
        setPinValues({
          ...pinValues,
          PicFile: null,
          Animal: "",
          PicDate: "",
          Latitude: "",
          Longitude: "",
          DDVal: "0",
        });
      }

      pictureModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startPictureModalAnimations();
    // if (itterator > 0){
    //   setItterator(itterator + 1);
    // }
  }, [picAdderModal]);

  //Intro Tutorial Animations
  const tutorialModalY = useSharedValue(windowHeight);
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { itterator, setItterator } = useContext(IterratorContext);

  const tutorialModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorialModalY.value }],
    };
  });

  const startGuideModalAnimations = () => {
    if (guideModal) {
      tutorialModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      tutorialModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startGuideModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [guideModal]);

  //Second Tutorial Animations
  const tutorial2ModalY = useSharedValue(windowHeight);
  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);

  const tutorial2ModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorial2ModalY.value }],
    };
  });

  const startSecondGuideModalAnimations = () => {
    if (secondGuideModal) {
      tutorial2ModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      tutorial2ModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startSecondGuideModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [secondGuideModal]);

  //Third Tutorial Animations
  const tutorial3ModalY = useSharedValue(windowHeight);
  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);

  const tutorial3ModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorial3ModalY.value }],
    };
  });

  const startThirdGuideModalAnimations = () => {
    if (thirdGuideModal) {
      tutorial3ModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      tutorial3ModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  useEffect(() => {
    startThirdGuideModalAnimations();
    // if (!itterator && guideModal) {
    //   setItterator(0);
    // }
  }, [thirdGuideModal]);

  //Profile Modal Animation
  const profileModalY = useSharedValue(windowHeight);
  const { profileModal, setProfileModal } = useContext(ProfileModalContext);

  const profileModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: profileModalY.value }],
    };
  });

  const startProfileModalAnimations = () => {
    if (profileModal) {
      profileModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      profileModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  //Settings Modal Animation
  const settingsModalY = useSharedValue(windowHeight);
  const { gearModal, setGearModal } = useContext(SettingsContext);

  const settingsModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: settingsModalY.value }],
    };
  });

  const startSettingsModalAnimations = () => {
    if (gearModal) {
      settingsModalY.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      settingsModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  //MapSearch Modal Animation
  const mapSearchModalY = useSharedValue(windowHeight);
  const [mapSearchBump, setMapSearchBump] = useState(false);
  const { mapSearchModal, setMapSearchModal } = useContext(
    MapSearchModalContext
  );

  const mapSearchModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: mapSearchModalY.value }],
    };
  });

  useEffect(() => {
    if(mapSearchBump){
      mapSearchModalY.value = withTiming(-windowHeight * 0.3, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
    setMapSearchBump(false)
  }, [mapSearchBump]);


  const startMapSearchModalAnimations = () => {
    if (mapSearchModal) {
      mapSearchModalY.value = withTiming(-windowHeight * 0.1, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      Keyboard.dismiss();
      mapSearchModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
  };

  //DiveSiteSearch Modal Animation

  const diveSiteSearchModalY = useSharedValue(windowHeight);
  const [diveSearchBump, setDiveSearchBump] = useState(false);
  const { diveSiteSearchModal, setDiveSiteSearchModal } = useContext(
    DiveSiteSearchModalContext
  );

  const diveSiteSearchModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: diveSiteSearchModalY.value }],
    };
  });

  useEffect(() => {
    if(diveSearchBump){
      diveSiteSearchModalY.value = withTiming(-windowHeight * 0.3, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    }
    setDiveSearchBump(false)
  }, [diveSearchBump]);

  const startdiveSiteSearchModalAnimations = () => {
    if (diveSiteSearchModal) {
      diveSiteSearchModalY.value = withTiming(-windowHeight * 0.1, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
    } else {
      Keyboard.dismiss();
      diveSiteSearchModalY.value = withTiming(windowHeight, {
        duration: 150,
        easing: Easing.out(Easing.linear),
      });
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

  useEffect(() => {
    startProfileModalAnimations();
  }, [profileModal]);

  useEffect(() => {
    startSettingsModalAnimations();
  }, [gearModal]);

  useEffect(() => {
    startMapSearchModalAnimations();
  }, [mapSearchModal]);

  useEffect(() => {
    startdiveSiteSearchModalAnimations();
  }, [diveSiteSearchModal]);

  const [token, setToken] = useState(false);
  const [diveSitesTog, setDiveSitesTog] = useState(true);
  const [mapCenter, setMapCenter] = useState({
    lat: 49.246292,
    lng: -123.116226,
  });

  const transYtags = useSharedValue(0);

  const transTagsY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transYtags.value }],
    };
  });

  const startTagAnimations = () => {
    if (transYtags.value === 0) {
      transYtags.value = -10000;
    } else {
      transYtags.value = 0;
    }
  };

  //Pull tab animations
  const pullTabHeight = useSharedValue(0);
  const { showFilterer, setShowFilterer } = useContext(PullTabContext);
  const toVal = scale(25);

  const tabPullHeigth = useDerivedValue(() => {
    return interpolate(pullTabHeight.value, [0, 1], [0, toVal]);
  });

  const tabPull = useAnimatedStyle(() => {
    return {
      height: tabPullHeigth.value,
    };
  });

  const startPullTabAnimation = () => {
    if (showFilterer) {
      pullTabHeight.value = withTiming(1);
      setIsOpen(true);
      setGearModal(false);
      setProfileModal(false);
      setMapSearchModal(false);
      setDiveSiteSearchModal(false);
      setPicAdderModal(false);
      setDiveSiteAdderModal(false);
      setTutorialLaunchpadModal(false);
      setSiteModal(false);
    } else {
      Keyboard.dismiss();
      pullTabHeight.value = withTiming(0);
      setTextValue("");
      setIsOpen(false);
    }
    // if (pullTabHeight.value === 0) {
    //   pullTabHeight.value = withTiming(1);
    //   setIsOpen(true);
    // } else {
    //   Keyboard.dismiss();
    //   pullTabHeight.value = withTiming(0);
    //   setTextValue("");
    //   setIsOpen(false);
    // }
  };

  useEffect(() => {
    startPullTabAnimation();
  }, [showFilterer]);

  const fTabY = useSharedValue(0);

  const tabFY = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: fTabY.value }],
    };
  });

  const [label, setLabel] = useState("Show Menu");
  const [direction, setDirection] = useState("up");

  const startFTabAnimation = () => {
    if (fTabY.value === 0) {
      fTabY.value =
        windowWidth > 700
          ? withTiming(moderateScale(-80))
          : withTiming(moderateScale(-80));
      setLabel("Hide Menu");
      setDirection("down");
    } else {
      fTabY.value = withTiming(0);
      setLabel("Show Menu");
      setDirection("up");
    }
  };

  const onNavigate = () => {
    if (dragPin) {
      if (chosenModal === "DiveSite") {
        setAddSiteVals({
          ...addSiteVals,
          Latitude: dragPin.lat.toString(),
          Longitude: dragPin.lng.toString(),
        });
        setMapHelper(true);
        setMasterSwitch(true);
        setDiveSiteAdderModal(!diveSiteAdderModal);
        setItterator2(itterator2 + 1);
        setChosenModal(null);
      } else if (chosenModal === "Photos") {
        setPinValues({
          ...pinValues,
          Latitude: dragPin.lat.toString(),
          Longitude: dragPin.lng.toString(),
        });
        setMapHelper(true);
        setMasterSwitch(true);
        setPicAdderModal(!picAdderModal);
        setChosenModal(null);
      }
    }
  };

  const onShopNavigate = () => {
    setSiteModal(false);
    setShopModal(true);
    setMapHelper(true);
    setMasterSwitch(true);
    setMinorSwitch(true);
    setZoomHelper(true);
    setSitesArray([]);
  };

  useEffect(() => {
    if (animalSelection.length > 0) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, [animalSelection]);

  useEffect(() => {
    if (areaPics.length === 0 && !isOpen) {
      pullTabHeight.value = withTiming(0);
    }
  }, [areaPics]);

  const [subButState, setSubButState] = useState(false);

  const getProfile = async () => {
    let sessionUserId = activeSession.user.id;
    // let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
    try {
      const success = await grabProfileById(sessionUserId);
      if (success) {
        let bully = success[0].UserName;
        if (bully == null || bully === "") {
          setGuideModal(true);
          setTutorialRunning(true);
          setItterator(0);
        } else {
          setProfile(success);
          setPinValues({
            ...pinValues,
            UserId: success[0].UserID,
            UserName: success[0].UserName,
          });
          setAddSiteVals({
            ...addSiteVals,
            UserID: success[0].UserID,
            UserName: success[0].UserName,
          });
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

  const registerForPushNotificationsAsync = async (sess) => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    }

    if (finalStatus !== 'granted') {
    return;
    }

    let token
    try {
       token = (await Notifications.getDevicePushTokenAsync({
        'projectId': Constants.expoConfig.extra.eas.projectId,
      })).data;
      
    } catch (err) {
      console.log("error", err);
    }

    let tokenE
    try {
    tokenE = ( await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;
      
    } catch (err) {
      console.log("error", err);
    }
   
    if (activeSession && activeSession.user) {
      const user = (await grabProfileById(activeSession.user.id));
      const activeToken = user[0].expo_push_token;
      if (activeToken === null || !activeToken.includes(token)) {
        updatePushToken({ token: activeToken ? [...activeToken, token] : [token], UserID: activeSession.user.id })
      }
      if (activeToken === null || !activeToken.includes(tokenE)) {
        updatePushToken({ token: activeToken ? [...activeToken, tokenE] : [tokenE], UserID: activeSession.user.id })
      }
    }
  };

  useEffect(() => {
    getProfile();
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    clearTimeout(feedbackRequest2);
    clearTimeout(feedbackRequest);

    if (tutorialRunning === false) {
      if (!profile && profile[0].feedbackRequested === false) {
        feedbackRequest2 = setTimeout(() => {
          startFeedbackAnimations();
          updateProfileFeeback(profile[0]);
        }, 180000);
      }
    }
  }, [tutorialRunning]);

  const handleEmail = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: "Scuba SEAsons Feedback Submission",
      body: "",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const toggleDiveSites = () => {
    setDiveSitesTog(!diveSitesTog);
    setGearModal(false);
    setProfileModal(false);
    setMapSearchModal(false);
    setDiveSiteSearchModal(false);
    setPicAdderModal(false);
    setDiveSiteAdderModal(false);
    setTutorialLaunchpadModal(false);
  };

  return (
    <MonthSelectContext.Provider value={{ monthVal, setMonthVal }}>
      <MapCenterContext.Provider value={{ mapCenter, setMapCenter }}>
        <DiveSitesContext.Provider value={{ diveSitesTog, setDiveSitesTog }}>
          <View style={styles.container}>
            {tutorialRunning && (
              <View style={styles.tutorialBar} pointerEvents={"box-none"}>
                <TutorialBar style={{ zIndex: 55 }} />
              </View>
            )}

            {masterSwitch && (
              <View style={styles.carrousel} pointerEvents={"box-none"}>
                <PhotoMenu style={{ zIndex: 3 }} />
                <View style={styles.filterer} pointerEvents={"box-none"}>
                  {((areaPics && areaPics.length > 0) || isOpen) && (
                    <View style={styles.emptyBox} pointerEvents={"box-none"}>
                      <Animated.View style={[tabPull, styles.closer]}>
                        <PhotoFilterer />
                      </Animated.View>

                      <TouchableWithoutFeedback
                        onPress={() => setShowFilterer(!showFilterer)}
                      >
                        <View style={styles.pullTab}></View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}

                  <View style={styles.animalSelect} pointerEvents={"box-none"}>
                    <AnimalTopAutoSuggest transTagsY={transTagsY} />
                  </View>
                </View>
              </View>
            )}
            {/* 
           {masterSwitch && ( 
               <KeyboardAvoidingView behavior="height" enabled={false}>
           
               </KeyboardAvoidingView>
           )} */}

            {masterSwitch && (
              <TouchableWithoutFeedback onPress={startTagAnimations}>
                <AntDesign
                  name="tags"
                  color="#355D71"
                  size={24}
                  style={{ position: "absolute", left: "87.5%", top: "13%" }}
                />
              </TouchableWithoutFeedback>
            )}

            {/* {masterSwitch && (
             
            )} */}

            {/* {masterSwitch && (
              <View style={styles.Fbuttons}>
                <FABButtons style={{ zIndex: 2 }} />
              </View>
            )} */}

            {masterSwitch && (
              <Animated.View
                style={[styles.FMenuAnimate, tabFY]}
                pointerEvents={"box-none"}
              >
                <TouchableWithoutFeedback onPress={startFTabAnimation}>
                  <View style={styles.FBox}>
                    <Text style={styles.FText}>{label}</Text>
                    <AntDesign
                      name={direction}
                      size={moderateScale(18)}
                      color="white"
                      style={{ marginBottom: 5 }}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.feedback, feedbackReveal]}>
                  <Text
                    style={styles.feedRequest}
                    onPress={() => handleEmail()}
                  >
                    Send Scuba SEAsons feedback
                  </Text>
                  <TouchableWithoutFeedback
                    style={{
                      width: moderateScale(30),
                      height: moderateScale(23),
                      marginTop: moderateScale(3),
                    }}
                    onPress={startFeedbackAnimations}
                  >
                    <Octicons
                      name="paper-airplane"
                      size={moderateScale(24)}
                      color="white"
                      style={{ marginTop: moderateScale(3) }}
                    />
                  </TouchableWithoutFeedback>
                </Animated.View>

                <View
                  style={
                    anchButState
                      ? styles.buttonwrapperPressed
                      : styles.buttonwrapper
                  }
                >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      tutorialRunning ? null : toggleDiveSites();
                    }}
                    onPressIn={() => setAnchButState(true)}
                    onPressOut={() => setAnchButState(false)}
                    style={{
                      alignItems: "center",
                      width: moderateScale(30),
                      height: moderateScale(30),
                    }}
                  >
                    <MaterialIcons
                      name="anchor"
                      color={anchButState ? "gold" : "white"}
                      size={moderateScale(30)}
                    />
                  </TouchableWithoutFeedback>
                </View>

                <View style={styles.FMenu}>
                  <FABMenu style={{ zIndex: 2 }} />
                </View>
              </Animated.View>
            )}

            {!masterSwitch && minorSwitch && (
              <View
                style={subButState ? styles.PinButtonPressed : styles.PinButton}
              >
                <TouchableOpacity
                  style={{
                    // backgroundColor: "orange",
                    width: scale(200),
                    height: scale(30),
                  }}
                  onPress={onNavigate}
                  onPressIn={() => setSubButState(true)}
                  onPressOut={() => setSubButState(false)}
                >
                  <Text
                    style={{
                      color: "gold",
                      fontFamily: "PatrickHand_400Regular",
                      fontSize: scale(22),
                      width: "100%",
                      height: "120%",
                      textAlign: "center",
                      marginTop: -5,
                      borderRadius: scale(15),
                    }}
                  >
                    Set Pin
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!masterSwitch && !minorSwitch && (
              <View
                style={subButState ? styles.PinButtonPressed : styles.PinButton}
              >
                <TouchableOpacity
                  style={{
                    // backgroundColor: "orange",
                    width: scale(200),
                    height: scale(30),
                  }}
                  onPress={onShopNavigate}
                  onPressIn={() => setSubButState(true)}
                  onPressOut={() => setSubButState(false)}
                >
                  <Text
                    style={{
                      color: "gold",
                      fontFamily: "PatrickHand_400Regular",
                      fontSize: scale(22),
                      width: "100%",
                      height: "120%",
                      textAlign: "center",
                      marginTop: -5,
                      borderRadius: scale(15),
                    }}
                  >
                    Return to Shop
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {masterSwitch && (
              <View style={styles.Hist} pointerEvents={"none"}>
                <Historgram style={{ zIndex: 2 }} />
              </View>
            )}

            {/* <Logo style={styles.Logo} pointerEvents={"none"} /> */}

            {/* modals go here? */}

            {tutorialLaunchpadModal && (
              <Animated.View
                style={[styles.anchorModal, tutorialLaunchpadModalReveal]}
              >
                <TutorialLaunchPadModal
                  tutorialLaunchpadModalY={tutorialLaunchpadModalY}
                />
              </Animated.View>
            )}

            {siteModal && (
              <Animated.View style={[styles.anchorModal, anchorModalReveal]}>
                <AnchorModal
                  anchorModalY={anchorModalY}
                  SiteName={selectedDiveSite.SiteName}
                  setSelectedPhoto={setSelectedPhoto}
                  setPhotoBoxModel={setPhotoBoxModel}
                  Lat={selectedDiveSite.Latitude}
                  Lng={selectedDiveSite.Longitude}
                />
              </Animated.View>
            )}

            {commentsModal && (
              <Animated.View
                style={[styles.commentScreen, commentsModalReveal]}
              >
                <View style={styles.commentsModal}>
                  <CommentsModal />
                </View>
              </Animated.View>
            )}

            {shopModal && (
              <Animated.View style={[styles.anchorModal, shopModalReveal]}>
                <ShopModal />
              </Animated.View>
            )}

            {photoBoxModel && (
              <Animated.View
                style={[styles.photoBoxModal, photoBoxModalReveal]}
              >
                <PhotoBoxModel
                  picData={selectedPhoto}
                  photoBoxModel={photoBoxModel}
                  setPhotoBoxModel={setPhotoBoxModel}
                />
              </Animated.View>
            )}

            {diveSiteAdderModal && (
              <Animated.View style={[styles.anchorModal, diveSiteModalReveal]}>
                <DiveSiteModal diveSiteModalY={diveSiteModalY} />
              </Animated.View>
            )}

            <Animated.View style={[styles.anchorModal, pictureModalReveal]}>
              <PicUploadModal pictureModalY={pictureModalY} />
            </Animated.View>

            {/* {guideModal && ( */}
              <Animated.View
                style={[styles.tutorialModal, tutorialModalReveal]}
              >
                <IntroTutorial tutorialModalY={tutorialModalY} />
              </Animated.View>
            {/* )} */}

            {/* {secondGuideModal && ( */}
              <Animated.View
                style={[styles.tutorialModal, tutorial2ModalReveal]}
              >
                <SecondTutorial tutorial2ModalY={tutorial2ModalY} />
              </Animated.View>
            {/* )} */}

            {/* {thirdGuideModal && ( */}
              <Animated.View
                style={[styles.tutorialModal, tutorial3ModalReveal]}
              >
                <ThirdTutorial tutorial3ModalY={tutorial3ModalY} />
              </Animated.View>
            {/* )} */}

            {profileModal && (
              <Animated.View style={[styles.anchorModal, profileModalReveal]}>
                <UserProfileModal />
              </Animated.View>
            )}

            {gearModal && (
              <Animated.View style={[styles.anchorModal, settingsModalReveal]}>
                <SettingsModal />
              </Animated.View>
            )}

            {mapSearchModal && (
              <Animated.View style={[styles.searchModal, mapSearchModalReveal]}>
                <MapSearchModal 
                setMapSearchBump={setMapSearchBump}/>
              </Animated.View>
            )}

            {diveSiteSearchModal && (
              <Animated.View
                style={[styles.diveSearchModal, diveSiteSearchModalReveal]}
              >
                <DiveSiteSearchModal 
                setDiveSearchBump={setDiveSearchBump}/>
              </Animated.View>
            )}

            <Map style={{ zIndex: 1 }} />
          </View>
        </DiveSitesContext.Provider>
      </MapCenterContext.Provider>
    </MonthSelectContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  slider: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    //Constants.statusBarHeight +
    top: scale(0),
    width: "80%",
    height: scale(38),
    zIndex: 2,
    borderRadius: scale(15),
    opacity: 0.8,
    paddingBottom: 0,
    paddingTop: scale(10),
    backgroundColor: "white",
    paddingRight: "2%",
    paddingLeft: "2%",
  },
  monthText: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    //Constants.statusBarHeight +
    top: scale(2),
    width: "10%",
    height: scale(20),
    zIndex: 3,
    borderRadius: scale(15),
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: "transparent",
    opacity: 0.8,
  },
  animalSelect: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    zIndex: 1,
    // backgroundColor: "pink"
  },
  FMenuAnimate: {
    position: "absolute",
    bottom: moderateScale(-65),
    // bottom: windowWidth > 700 ? moderateScale(6) : moderateScale(12),
    // bottom: windowWidth > 700 ? moderateScale(6) : moderateScale(12),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    zIndex: 3,
    // backgroundColor: 'pink'
  },
  FBox: {
    alignItems: "center",
    paddingBottom: "2%",
  },
  FText: {
    color: "white",
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(15),
  },
  FMenu: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#538bdb",
    width: "100%",
    height: moderateScale(65),
    // bottom: windowWidth > 700 ? moderateScale(6) : moderateScale(12),
    zIndex: 3,
  },
  Fbuttons: {
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 5,
    width: 100,
    height: 40,
    zIndex: 2,
    borderRadius: 15,
    opacity: 1,
    paddingTop: -5,
  },
  PinButton: {
    position: "absolute",
    alignItems: "center",
    textAlign: "center",
    bottom: scale(28),
    backgroundColor: "#538dbd",
    borderRadius: scale(10),
    marginBottom: 0,
    width: "50%",
    height: scale(30),
    zIndex: 2,
    paddingTop: 3,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.9,
    shadowRadius: 5,

    elevation: 10,
  },
  PinButtonPressed: {
    position: "absolute",
    alignItems: "center",
    textAlign: "center",
    bottom: scale(28),
    backgroundColor: "#538DBD",
    borderRadius: scale(10),
    marginBottom: 0,
    width: "50%",
    height: scale(30),
    zIndex: 2,
    paddingTop: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,

    elevation: 10,
  },
  carrousel: {
    // flex: 1,
    position: "absolute",
    // justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    // backgroundColor: "blue",
    height: 105,
    top:
      windowWidth > 700 || Platform.OS == "android"
        ? moderateScale(12)
        : moderateScale(40),
    zIndex: 3,
  },
  filterer: {
    flex: 1,
    alignSelf: "center",
    flexDirection: "column",
    position: "absolute",
    // justifyContent: "center",
    flexDirection: "column",
    // alignContent: "center",
    // alignItems: "center",
    // height: 25,
    width: "50%",
    top: moderateScale(105),
    zIndex: 3,
    // backgroundColor: "green"
  },
  emptyBox: {
    // position: "absolute",
    // top: -15,
    alignSelf: "center",
    flexDirection: "column",
    // justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // height: scale(55),
    width: "100%",
    zIndex: 3,
    // backgroundColor: "grey"
  },
  tutorialBar: {
    width: "25%",
    position: "absolute",
    left: "8%",
    // justifyContent: "center",
    // alignItems: "center",
    // alignContent: "space-between",
    top: Platform.OS === "ios" ? "14%" : "14%",
    zIndex: 55,
    // backgroundColor:"pink"
  },
  Hist: {
    alignItems: "center",
    position: "absolute",
    bottom: windowWidth > 700 ? scale(27) : scale(30),
    left: scale(75),
    width: scale(190),
    height: 100,
    zIndex: 2,
    borderRadius: 15,
    opacity: 0.8,
    backgroundColor: "transparent",
  },
  tutorialModal: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
  },
  anchorModal: {
    position: "absolute",
    height: windowHeight - windowHeight * 0.14,
    width: windowWidth - windowWidth * 0.1,
    marginLeft: windowWidth * 0.05,
    backgroundColor: "#538bdb",
    borderRadius: 15,
    zIndex: 25,
    left: 0,
    bottom: windowHeight * 0.09,
    borderWidth: 1,
    borderColor: "darkgrey",
  },
  searchModal: {
    position: "absolute",
    height: moderateScale(160),
    width: "60%",
    marginLeft: "19%",
    backgroundColor: "#538bdb",
    borderRadius: 15,
    zIndex: 25,
    left: 0,
    borderWidth: 1,
    borderColor: "darkgrey",
  },
  diveSearchModal: {
    position: "absolute",
    height: moderateScale(130),
    width: "60%",
    marginLeft: "19%",
    backgroundColor: "#538bdb",
    borderRadius: 15,
    zIndex: 25,
    left: 0,
    borderWidth: 1,
    borderColor: "darkgrey",
  },
  commentScreen: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 25,
    left: 0,
  },
  commentsModal: {
    position: "absolute",
    height: windowHeight - windowHeight * 0.4,
    width: windowWidth - windowWidth * 0.1,
    marginLeft: windowWidth * 0.05,
    backgroundColor: "#538bdb",
    borderRadius: 15,
    zIndex: 27,
    left: 0,
    opacity: 1,
    bottom: windowHeight * 0.04,
    borderWidth: 1,
    borderColor: "darkgrey",
  },
  pullTab: {
    height: windowWidth > 600 ? scale(10) : scale(15),
    width: windowWidth > 600 ? scale(80) : scale(100),
    backgroundColor: "gold",
    borderBottomRightRadius: scale(7),
    borderBottomLeftRadius: scale(7),
    zIndex: 10,
  },
  closer: {
    zIndex: 5,
  },
  feedback: {
    zIndex: 20,
    // opacity: 0.8,
    flexDirection: "row",
    backgroundColor: "#538bdb",
    position: "absolute",
    top: -moderateScale(30),
    left: -0.88 * FbWidth,
    padding: moderateScale(5),
    borderTopRightRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
    width: FbWidth,
    height: moderateScale(39),
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    elevation: 10,
  },
  feedRequest: {
    color: "white",
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(18),
    marginTop: moderateScale(3),
    marginRight: moderateScale(10),
    marginLeft: moderateScale(14),
    paddingLeft: moderateScale(50),
  },
  photoBoxModal: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 55,
    left: "5%",
    top: windowHeight,
    marginTop: "10%",
    backgroundColor: "green",
  },
  buttonwrapper: {
    position: "absolute",
    top: -moderateScale(30),
    right: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    height: moderateScale(39),
    width: moderateScale(39),
    backgroundColor: "#538bdb",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    elevation: 10,
  },
  buttonwrapperPressed: {
    position: "absolute",
    top: windowHeight * 0.83,
    right: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    height: moderateScale(39),
    width: moderateScale(39),
    backgroundColor: "white",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    elevation: 10,
  },
});
