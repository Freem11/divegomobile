import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SelectedShopContext } from "../contexts/selectedShopContext";
import { ShopModalContext } from "../contexts/shopModalContext";
import { scale } from "react-native-size-matters";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ShopModal(props) {
  // const {lat, lng, setSelectedPhoto, setPhotoBoxModel } = props
  const { shopModal, setShopModal  } = useContext(ShopModalContext);
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const [siteCloseState, setSiteCloseState] = useState(false);
 

  // useEffect(() => {
  //   getDiveSite(selectedDiveSite.SiteName);
  //   filterAnchorPhotos();
  // }, [selectedDiveSite]);

 
  // const getDiveSite = async (site) => {
  //   try {
  //     const selectedSite = await getDiveSiteByName(site);
  //     if (selectedSite.length > 0) {
  //       setSite(selectedSite[0].userName);
  //     }
  //   } catch (e) {
  //     console.log({ title: "Error", message: e.message });
  //   }
  // };

  const handleShopModalClose = () => {
    setShopModal(false);
  };

  return (
    <View
      style={{
        height: "98%",
        // backgroundColor: "orange",
        overflow: "hidden"
      }}
    >
      <View style={styles.titleAlt}>
        <View style={{ width: scale(250) }}>
          <Text style={styles.headerAlt}>{selectedShop[0].orgName}</Text>
        </View>
        <TouchableWithoutFeedback
          onPress={handleShopModalClose}
          onPressIn={() => setSiteCloseState(true)}
          onPressOut={() => setSiteCloseState(false)}
        >
          <View
            style={
              siteCloseState
                ? styles.closeButtonAltPressed
                : styles.closeButtonAlt
            }
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(28)} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <ScrollView style={{ marginTop: "0%", width: "100%", borderRadius: 15 }}>
        {/* <View style={styles.container3}>
          {anchorPics &&
            anchorPics.map((pic) => {
              return (
                <TouchableWithoutFeedback key={pic.id} onPress={() => togglePhotoBoxModal(pic.photoFile)}>
                <View style={styles.shadowbox}>
                <Picture key={pic.id} pic={pic}></Picture>
                </View>
                </TouchableWithoutFeedback>
              );
            })}
          {anchorPics.length === 0 && (
            <View>
              <Text style={styles.noSightings}>
                No Trips are currnetly being offered.
              </Text>
            </View>
          )}
        </View> */}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container3: {
    // flex: 1,
    // backgroundColor: "blue",
    alignItems: "center",
    // marginTop: "-3%",
    // height: "100%",
    width: scale(300),
    marginRight: scale(10),
    marginLeft: scale(10),
    // marginBottom: scale(16),
    borderRadius: 15,
    // backgroundColor: "green"
  },
  picContainer3: {
    width: "100%",
    // height: scale(200),
    marginBottom: scale(5),
    // backgroundColor: "pink",
    backgroundColor: "538bdb",
    // marginTop: "-0%",
    borderRadius: 15,
  },
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
  titleText: {
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(15),
    marginLeft: scale(-27),
  },
  flagMajor: {
    width: "10%",
    height: scale(30),
    marginRight: "-5%",
    // backgroundColor: 'blue'
  },
  share: {
    left: scale(232),
    top: scale(1),
    opacity: 0.8,
  },
  flag: {
    left: scale(237),
    top: scale(1),
  },
  noSightings: {
    flex: 1,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: "40%",
    fontFamily: "Itim_400Regular",
    fontSize: scale(18),
    color: "#F0EEEB",
    // backgroundColor: "green"
  },
  noSightings2: {
    flex: 1,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: "-6%",
    fontFamily: "Itim_400Regular",
    fontSize: scale(18),
    color: "#F0EEEB",
    // backgroundColor: "green"
  },
  micro: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    backgroundColor: "black",
    opacity: 0.6,
    width: "94%",
    borderRadius: 5,
    zIndex: 2,
    left: "4%",
    top: Platform.OS === "ios" ? "8%" : "9%",
  },
  microLow: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.6,
    // width: "54%",
    borderRadius: 5,
    zIndex: 2,
    right: "3%",
    bottom: Platform.OS === "ios" ? "-7%" : "-7%",
  },
  titleTextLow: {
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(10),
    paddingLeft: scale(5),
    paddingRight: scale(7),
  },
  flagger: {
    height: scale(30),
    width: "10%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    // backgroundColor: 'green'
    // flexDirection: "row",
    // position: "absolute",
    // top: Platform.OS === "ios" ? "-7%" :"-1.5%",
    // left: Platform.OS === "ios" ? "-8%" :"-5%",
  },
  headerAlt: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: scale(22),
    width: "90%",
    height: "120%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: 0,
    marginBottom: -10,
    flexWrap: "wrap",
    // backgroundColor: "pink"
  },
  dsCredit: {
    // backgroundColor: 'pink',
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(9),
    width: scale(200),
    marginLeft: scale(12),
  },
  titleAlt: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "4%",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "3%",
    width: "92%",
    height: scale(30),
    // backgroundColor: 'pink'
  },
  closeButtonAlt: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "-4%",
    // backgroundColor: "green"
  },
  closeButtonAltPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "-4%",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  helpButton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(15),
    marginLeft: scale(-50),
    borderRadius: 40,
    height: scale(30),
    width: scale(30),
    paddingTop: scale(2),
  },
  helpButtonPressed: {
    backgroundColor: "#538dbd",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(15),
    marginLeft: scale(-50),
    borderRadius: 40,
    height: scale(30),
    width: scale(30),
    paddingTop: scale(2),
  },
});
