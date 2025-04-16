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
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
} from "../styles";

import { getShopByUserID } from "../../supabaseCalls/shopsSupabaseCalls";
import { getItinerariesByUserId, insertItineraryRequest } from "../../supabaseCalls/itinerarySupabaseCalls";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import Itinerary from "../itineraries/itinerary";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { ShopContext } from "../../compnents/contexts/shopContext";
import { ShopModalContext } from "../contexts/shopModalContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import { EditModeContext } from "../../compnents/contexts/editModeContext";
import { TripDetailContext } from "../../compnents/contexts/tripDetailsContext";
import { SitesArrayContext } from "../../compnents/contexts/sitesArrayContext";
import { useTranslation } from "react-i18next";
import  ItineraryCard  from '../reusables/itineraryCard';

const windowHeight = Dimensions.get("window").height;

export default function TripListPage(props) {
  const { } = props;
  const tripsRef = useRef(null);
  const { profile } = useContext(UserProfileContext);
  const { setShop } = useContext(ShopContext);
  const { setShopModal } = useContext(ShopModalContext);
  const { setEditMode } = useContext(EditModeContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { t } = useTranslation()
  const [itineraryList, setItineraryList] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  useEffect(() => {
    getItineraries(profile[0].UserID);
    getShop(profile[0].UserID)
  }, []);

  useEffect(() => {
    setShop(itineraryList[0]?.shopID);
  }, [itineraryList]);


  const getShop = async (id) => {
    try {
      const shop = await getShopByUserID(id);
      if (shop.length > 0) {
        setFormValues({ ...formValues, shopID: shop[0].id })
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };


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

  const openTripCreatorScreen = () => {
    setLevelOneScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("TripCreatorScreen");
    useButtonPressHelper(
      "TripCreatorScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };


  const handleEditButton = (itineraryInfo) => {
    setPreviousButtonID(activeScreen);
    setActiveScreen("TripCreatorScreen");
    setEditMode({ itineraryInfo, IsEditModeOn: true });
    setFormValues({ ...itineraryInfo, shopID: formValues.shopID, OriginalItineraryID: itineraryInfo.id })
    setSitesArray(itineraryInfo.siteList)
    setLevelOneScreen(false);
    useButtonPressHelper(
      "TripCreatorScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
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



  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={"darkgrey"}
        onPress={() => setLevelOneScreen(false)}
        style={{ marginTop: "15%", alignSelf: "flex-start", marginLeft: "2%" }}
      />

      <TouchableWithoutFeedback onPress={() => openTripCreatorScreen()}>
        <View style={styles.creatNewButton}>
          <Text style={styles.createNewText}>
            {t('TripList.newTrip')}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.content}>
        <Text style={styles.header}>{t('TripList.header')}</Text>
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
            <ItineraryCard  
              itinerary={item}    
              setSelectedID={setSelectedID}
              selectedID={selectedID}
              />
            {/* <Itinerary
              key={item.id}
              itinerary={item}
              setSelectedID={setSelectedID}
              selectedID={selectedID}
              setShopModal={setShopModal}
              buttonOneText={t('Common.edit')}
              buttonOneIcon="pencil"
              buttonOneAction={() => handleEditButton(item)}
              buttonTwoText={t('Common.delete')}
              buttonTwoIcon="delete-forever"
              buttonTwoAction={() => handleDeleteButton(item)}
            /> */}
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
  page: {
    width: '96%'
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
  creatNewButton: [
    screenSecondaryButton,
    { zIndex: 10, position: "absolute", top: "7%", right: "6%" },
  ],
  createNewText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
});
