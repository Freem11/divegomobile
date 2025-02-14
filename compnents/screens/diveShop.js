import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import WavyHeaderDynamic from "./wavyHeaderDynamic";
import PlainTextInput from "./plaintextInput";
import {
  activeFonts,
  colors,
  fontSizes,
} from "../styles";
import screenData from "./screenData.json";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedShopContext } from "../contexts/selectedShopContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";
import { MaterialIcons } from "@expo/vector-icons";
import { chooseImageHandler } from "./imageUploadHelpers";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";
import { itineraries } from "../../supabaseCalls/itinerarySupabaseCalls";
import { updateDiveShop } from "../../supabaseCalls/shopsSupabaseCalls";
import BottomDrawer from "./animatedBottomDrawer";

const windowHeight = Dimensions.get("window").height;

export default function DiveShop() {
  const { profile } = useContext(UserProfileContext);
  const [itineraryList, setItineraryList] = useState("");
  const { setMapCenter } = useContext(MapCenterContext);
  const { zoomHelper } = useContext(ZoomHelperContext);
  const { selectedShop } = useContext(SelectedShopContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const [diveShopVals, setDiveShopVals] = useState(null);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [isMyShop, setIsMyShop] = useState(false);

  const drawerUpperBound = "90%";
  const drawerLowerBound = "30%";

  const getItineraries = async (IdNum) => {
    try {
      const itins = await itineraries(IdNum);
        setItineraryList(itins);
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
    if (
      profile[0].partnerAccount &
      (selectedShop[0].userId === profile[0].UserID)
    ) {
      setIsMyShop(true);
    }

    setDiveShopVals({
      id: selectedShop[0].id,
      bio: selectedShop[0].diveShopBio,
      photo: selectedShop[0].diveShopProfilePhoto,
    });

    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
    }
  }, [selectedShop[0].id]);

  useEffect(() => {
    if (!isEditModeOn && diveShopVals) {
      diveShopUpdateUpdate();
    }
  }, [isEditModeOn]);

  const diveShopUpdateUpdate = async () => {
    try {
      const success = await updateDiveShop({
        id: diveShopVals.id,
        bio: diveShopVals.bio,
        photo: diveShopVals.photo,
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
        if (diveShopVals.photo !== null || diveShopVals.photo === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: diveShopVals.photo.split("/").pop(),
          });
        }

        setDiveShopVals({
          ...diveShopVals,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveShop({
          id: diveShopVals.id,
          bio: diveShopVals.bio,
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

      {isMyShop && (
        <View style={styles.addPhotoButton}>
          <MaterialIcons
            name="add-a-photo"
            size={moderateScale(30)}
            color={colors.themeWhite}
            onPress={() => handleImageUpload()}
          />
        </View>
      )}

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
                  content={diveShopVals && diveShopVals.bio}
                  fontSz={fontSizes.StandardText}
                  isMyShop={isMyShop}
                  isEditModeOn={isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  onChangeText={(bioText) =>
                    setDiveShopVals({ ...diveShopVals, bio: bioText })
                  }
                />
              )}
            </ScrollView>
          </View>
        </MaskedView>
      </View>

      <WavyHeaderDynamic
        customStyles={styles.svgCurve}
        image={diveShopVals && diveShopVals.photo}
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
  scrollViewBox: {
    // zIndex: 5,
    marginTop: "3%",
    marginLeft: "2%",
    height: windowHeight / 6,
    // backgroundColor: "green"
  },
  backButton: [{ zIndex: 10, position: "absolute", top: "5.5%", left: "2%" }],
  addPhotoButton: [
    { zIndex: 10, position: "absolute", top: "32%", right: "5%" },
  ],
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
});
