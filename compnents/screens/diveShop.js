import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import WavyHeaderDynamic from "./wavyHeaderDynamic";
import PlainTextInput from "./plaintextInput";
import CloseButton from "../reusables/closeButton";
import { FontAwesome } from "@expo/vector-icons";
import {
  activeFonts,
  colors,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
} from "../styles";
import screenData from "./screenData.json";
import { moderateScale } from "react-native-size-matters";
import { PinContext } from "../contexts/staticPinContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedShopContext } from "../contexts/selectedShopContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";

import { MaterialIcons } from "@expo/vector-icons";
import { chooseImageHandler } from "./imageUploadHelpers";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";
import { itineraries } from "../../supabaseCalls/itinerarySupabaseCalls";
import {
  updateDiveShop,
} from "../../supabaseCalls/shopsSupabaseCalls";
import BottomDrawer from "./animatedBottomDrawer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function DiveShop(props) {
  const {} = props;
  const photosRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const { profile } = useContext(UserProfileContext);
  const [itineraryList, setItineraryList] = useState("");
  const { setMapCenter } = useContext(MapCenterContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const [shop, setShop] = useState("");
  const [diveShopVals, setDiveShopVals] = useState({
    diveShopbio: null,
    diveShopPhoto: null,
  });
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  const drawerUpperBound = "90%";
  const drawerLowerBound = "30%";

  const getItineraries = async (IdNum) => {
    try {
      const itins = await itineraries(IdNum);
      if (itins.length > 0) {
        setItineraryList(itins);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };


  useEffect(() => {
    if (levelOneScreen && zoomHelper) {
      setMapCenter({
        lat: selectedShop[0].lat,
        lng: selectedShop[0].lng,
      });
    }
  }, [levelOneScreen]);


  useEffect(() => {
    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
    }
  }, [selectedShop[0].id]);



  useEffect(() => {
    if (!isEditModeOn && shop) {
      diveShopUpdateUpdate();
    }
  }, [isEditModeOn]);

  const diveShopUpdateUpdate = async () => {
    try {
      const success = await updateDiveShop({
        id: shop.id,
        bio: shop.diveShopBio,
        photo: shop.diveShopProfilePhoto,
      });
    } catch (e) {
      console.log({ title: "Error19", message: e.message });
    }
  };

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {
        let uri = image.assets[0].uri;
        let extension = image.assets[0].uri.split(".").pop();
        const fileName = Date.now() + "." + extension;

        //create new photo file and upload
        let picture = await fetch(uri);
        picture = await picture.blob();
        await uploadphoto(picture, fileName);
        if (
          shop.diveshopprofilephoto !== null ||
          shop.diveshopprofilephoto === ""
        ) {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: shop.diveshopprofilephoto.split("/").pop(),
          });
        }

        setShop({
          ...shop,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveShop({
          id: shop.id,
          bio: shop.diveshopbio,
          photo: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  const onClose = () => {
    setLevelOneScreen(false);
  };

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={colors.themeWhite}
        onPress={() => onClose()}
        style={styles.backButton}
      />

      <View style={styles.addPhotoButton}>
        <MaterialIcons
          name="add-a-photo"
          size={moderateScale(30)}
          color={colors.themeWhite}
          onPress={() => handleImageUpload()}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.shopNameContainer}>
          <Text style={styles.header}>{selectedShop[0].orgName}</Text>
        </View>
        <MaskedView
          maskElement={
            <LinearGradient
              style={{ flex: 1 }}
              colors={["white", "transparent"]}
              start={{ x: 0.5, y: 0.7 }}
            ></LinearGradient>
          }
        >
          <View style={styles.scrollViewBox}>
            <ScrollView>
              {selectedShop && (
                <PlainTextInput
                  placeHolder={`A little about ${selectedShop[0].orgName}`}
                  content={shop.diveshopbio}
                  fontSz={fontSizes.StandardText}
                  isEditModeOn={isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  onChangeText={(bioText) =>
                    setShop({ ...shop, diveshopbio: bioText })
                  }
                />
              )}
            </ScrollView>
          </View>
        </MaskedView>
      </View>

      <WavyHeaderDynamic
        customStyles={styles.svgCurve}
        image={shop && shop.diveshopprofilephoto}
      ></WavyHeaderDynamic>

      <BottomDrawer
        dataSet={itineraryList}
        dataSetType={"DiveShopTrips"}
        lowerBound={drawerLowerBound}
        upperBound={drawerUpperBound}
        drawerHeader={screenData.DiveShop.drawerHeader}
        emptyDrawer={selectedShop[0].orgName + screenData.DiveShop.emptyDrawer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight,
  },
  contentContainer: {
    alignItems: "left",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    marginTop: Platform.OS === "ios" ? windowHeight / 2.4 : windowHeight / 2.2,
    width: "100%",
    height: 300,
    // backgroundColor: "pink",
  },
  shopNameContainer: {
    // zIndex: 1,
    flexDirection: "row",
    width: "auto",
    marginTop: Platform.OS === "ios" ? windowHeight / 50 : windowHeight / 50,
    marginHorizontal: "8%",
  },
  header: {
    // zIndex: 50,
    marginTop: "5%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Regular,
    color: colors.themeBlack,
  },
  contributor: {
    // zIndex: 50,
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
    marginLeft: "12%",
  },
  scrollViewBox: {
    // zIndex: 5,
    marginTop: "3%",
    marginLeft: "2%",
    height: windowHeight / 6,
    // backgroundColor: "green"
  },
  screenCloseButton: [
    { zIndex: 1, position: "absolute", top: "6%", right: "5%" },
  ],
  contributeButton: [
    { zIndex: 10, position: "absolute", top: "6%", right: "3%" },
    screenSecondaryButton,
  ],
  backButton: [{ zIndex: 10, position: "absolute", top: "5.5%", left: "2%" }],
  contributeButtonText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
  addPhotoButton: [
    { zIndex: 10, position: "absolute", top: "32%", right: "5%" },
  ],
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
  page: {
    position: "absolute",
    zIndex: 1,
    // bottom: -200,
    width: "100%",
    // marginLeft: "1%",
    // marginTop: -windowHeight,
    height: "100%",
  },
  pageContainer: {
    // pointerEvents: "none",
    // justifyContent: "center",
    position: "absolute",
    // top: 0,
    // left: "5%",
    // backgroundColor: "yellow",
  },
  gapBox: { pointerEvents: "none", height: windowHeight * 0.75 },
  shadowbox: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
  },
});
