import React, { useState, useContext, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  activeFonts,
  colors,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
} from "../styles";
import screenData from "./screenData.json";
import { getItinerariesByUserId, insertItineraryRequest } from "../../supabaseCalls/itinerarySupabaseCalls";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import Itinerary from "../itineraries/itinerary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { SessionContext } from "../contexts/sessionContext";
import { ShopModalContext } from "../contexts/shopModalContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TripListPage(props) {
  const {} = props;
  const tripsRef = useRef(null);
  const { profile } = useContext(UserProfileContext);
  const { setShopModal } = useContext(ShopModalContext);

  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const [itineraryList, setItineraryList] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  useEffect(() => {
    getItineraries(profile[0].UserID);
  }, []);

  const getItineraries = async (IdNum) => {
    try {
      const itins = await getItinerariesByUserId(IdNum);
      if (itins.length > 0) {
        setItineraryList(itins[0].itineraries);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };
  // const openPartnerAccountScreen = () => {
  //   setLevelOneScreen(false);
  //   setPreviousButtonID(activeScreen);
  //   setActiveScreen("PartnerRequestScreen");
  //   useButtonPressHelper(
  //     "PartnerRequestScreen",
  //     activeScreen,
  //     levelTwoScreen,
  //     setLevelTwoScreen
  //   );
  // };


  const handleEditButton = (itineraryInfo) => {
    // setPreviousButtonID(activeButtonID);
    // setActiveScreen("TripCreator");
    // setEditMode({ itineraryInfo, IsEditModeOn: true });
    // setLevelOneScreen(false);
    // useButtonPressHelper(
    //   "TripCreator",
    //   activeButtonID,
    //   largeModalSecond,
    //   setLargeModalSecond
    // );
  };

  const handleDeleteButton = (itineraryInfo) => {
    insertItineraryRequest(
      {
        BookingLink: itineraryInfo.BookingPage,
        TripName: itineraryInfo.tripName,
        StartDate: itineraryInfo.startDate,
        EndDate: itineraryInfo.endDate,
        Price: itineraryInfo.price,
        TripDesc: itineraryInfo.description,
        DiveSites: itineraryInfo.siteList,
        ShopId: itineraryInfo.shopID,
      },
      "Delete"
    );
    setConfirmationType("Trip Delete");
    setActiveConfirmationID("ConfirmationSuccess");
    setConfirmationModal(true);
  };



  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={"darkgrey"}
        onPress={() => setLevelOneScreen(false)}
        style={{ marginTop: "15%", alignSelf: "flex-start", marginLeft: "2%" }}
      />

      <TouchableWithoutFeedback onPress={null}>
        <View style={styles.creatNewButton}>
          <Text style={styles.createNewText}>
            {screenData.TripList.creatNewTripButton}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.content}>
        <Text style={styles.header}>{screenData.TripList.header}</Text>
      </View>

      <FlatList
        style={styles.page}
        contentContainerStyle={styles.pageContainer}
        ref={tripsRef}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={moderateScale(290)}
        snapToAlignment="center"
        decelerationRate="normal"
        keyExtractor={(item) => item.id}
        data={itineraryList}
        renderItem={({ item }) => (
          <View style={styles.shadowbox}>
            <Itinerary
              key={item.id}
              itinerary={item}
              setSelectedID={setSelectedID}
              selectedID={selectedID}
              setShopModal={setShopModal}
              buttonOneText="Edit"
              buttonOneIcon="pencil"
              buttonOneAction={() => handleEditButton(item)}
              buttonTwoText="Delete"
              buttonTwoIcon="delete-forever"
              buttonTwoAction={() => handleDeleteButton(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    // justifyContent: "center",
    height: windowHeight,
  },
  content: {
    width: "90%",
    marginBottom: "5%"
  },
  header: {
    zIndex: 10,
    marginTop: "5%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Bold,
    color: "darkgrey",
  },
  subHeaders: {
    zIndex: 10,
    marginTop: "10%",
    fontSize: moderateScale(fontSizes.SubHeading),
    fontFamily: activeFonts.Medium,
    color: "darkgrey",
    marginLeft: "5%",
  },
  subHeadersDanger: {
    zIndex: 10,
    position: "absolute",
    bottom: moderateScale(120),
    marginTop: windowHeight / 6,
    fontSize: moderateScale(fontSizes.SubHeading),
    fontFamily: activeFonts.Medium,
    color: "maroon",
    marginLeft: "5%",
  },
  dataHousing: {
    marginTop: "2%",
    borderTopWidth: moderateScale(1),
    borderTopColor: "darkgrey",
    paddingBottom: "2%",
    borderBottomWidth: moderateScale(1),
    borderBottomColor: "darkgrey",
  },
  dataHousingDanger: {
    position: "absolute",
    bottom: moderateScale(40),
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    borderTopWidth: moderateScale(1),
    borderTopColor: "maroon",
    paddingBottom: "4%",
    borderBottomWidth: moderateScale(1),
    borderBottomColor: "maroon",
    width: "90%",
  },
  dataLabels: {
    zIndex: 10,
    marginTop: "2%",
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Bold,
    color: colors.themeBlack,
    marginLeft: "10%",
  },
  dataLabelsDanger: {
    zIndex: 10,
    marginTop: "4%",
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Bold,
    color: "maroon",
  },
  promtBox: {
    position: "absolute",
    bottom: moderateScale(10),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  promptText: {
    fontSize: moderateScale(15),
    fontFamily: activeFonts.Italic,
    color: colors.themeBlack,
  },
  promptLinkText: {
    marginLeft: "15%",
    marginTop: moderateScale(2),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.thin,
    color: colors.primaryBlue,
  },
  buttonBox: {
    zIndex: -1,
    width: "100%",
    alignItems: "flex-end",
    marginTop: moderateScale(-50),
  },
  creatNewButton: [
    screenSecondaryButton,
    { zIndex: 10, position: "absolute", top: "7%", right: "6%" },
  ],
  createNewText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
  erroMsg: {
    minHeight: moderateScale(34),
    marginTop: moderateScale(15),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
  },
  erroMsgEmpty: {
    height: moderateScale(34),
    marginTop: moderateScale(15),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
  },
});
