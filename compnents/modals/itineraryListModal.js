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
import Itinerary from "../itineraries/itinerary";
import { getItinerariesByUserId } from "../../supabaseCalls/itinerarySupabaseCalls";
import { SelectedShopContext } from "../contexts/selectedShopContext";
import { ShopModalContext } from "../contexts/shopModalContext";
import { scale } from "react-native-size-matters";
import { MasterContext } from "../contexts/masterContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { ShopContext } from "../../compnents/contexts/shopContext";
import { EditModeContext } from "../../compnents/contexts/editModeContext";
import { SitesArrayContext } from "../../compnents/contexts/sitesArrayContext";
import { MapConfigContext } from "../../compnents/contexts/mapConfigContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../compnents/contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../compnents/contexts/confirmationModalContext";

import ModalHeader from "../reusables/modalHeader";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import { insertItineraryRequest } from "../../supabaseCalls/itinerarySupabaseCalls";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ItineraryListModal(props) {
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(
    LargeModalSecondContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setShop } = useContext(ShopContext);
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { profile } = useContext(UserProfileContext);
  const { setShopModal } = useContext(ShopModalContext);
  const [itineraryList, setItineraryList] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const { setMapCenter } = useContext(MapCenterContext);
  const { setZoomHelper } = useContext(ZoomHelperContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  useEffect(() => {
    getItineraries(profile[0].UserID);
  }, [largeModal]);

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

  useEffect(() => {
    setShop(itineraryList[0]?.shopID);
  }, [itineraryList]);

  const handleCreateNewButton = () => {
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("TripCreator");
    setLargeModal(false);
    useButtonPressHelper(
      "TripCreator",
      activeButtonID,
      largeModalSecond,
      setLargeModalSecond
    );
  };

  const handleEditButton = (itineraryInfo) => {
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("TripCreator");
    setEditMode({ itineraryInfo, IsEditModeOn: true });
    setLargeModal(false);
    useButtonPressHelper(
      "TripCreator",
      activeButtonID,
      largeModalSecond,
      setLargeModalSecond
    );
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

  const handleShopModalClose = () => {
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("ItineraryListButton");
    setLargeModal(!largeModal);
  };

  return (
    <View
      style={{
        height: "98%",
        // backgroundColor: "orange",
        overflow: "hidden",
      }}
    >
      <ModalHeader
        titleText={"Your Trips"}
        onClose={handleShopModalClose}
        icon={"create-new-folder"}
        altButton={handleCreateNewButton}
      />

      <ScrollView style={{ marginTop: "3%", width: "100%", borderRadius: 15 }}>
        <View style={styles.container3}>
          {itineraryList &&
            itineraryList.map((itinerary) => {
              return (
                <Itinerary
                  key={itinerary.id}
                  itinerary={itinerary}
                  setSelectedID={setSelectedID}
                  selectedID={selectedID}
                  setShopModal={setShopModal}
                  buttonOneText="Edit"
                  buttonOneIcon="calendar-edit"
                  buttonOneAction={() => handleEditButton(itinerary)}
                  buttonTwoText="Delete"
                  buttonTwoIcon="delete-forever"
                  buttonTwoAction={() => handleDeleteButton(itinerary)}
                />
              );
            })}
          {itineraryList.length === 0 && (
            <View>
              <Text style={styles.noSightings}>
                No Trips are currently being offered.
              </Text>
            </View>
          )}
        </View>
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
