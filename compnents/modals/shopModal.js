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
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import Itinerary from "../itineraries/itinerary";
import { itineraries } from "../../supabaseCalls/itinerarySupabaseCalls";
import { SelectedShopContext } from "../contexts/selectedShopContext";
import { ShopModalContext } from "../contexts/shopModalContext";
import { scale } from "react-native-size-matters";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { MasterContext } from "../contexts/masterContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";
import ModalHeader from "../reusables/modalHeader";

import { shops } from "../../supabaseCalls/shopsSupabaseCalls";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ShopModal(props) {
  // const {lat, lng, setSelectedPhoto, setPhotoBoxModel } = props
  const { shopModal, setShopModal } = useContext(ShopModalContext);
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const [siteCloseState, setSiteCloseState] = useState(false);
  const [itineraryList, setItineraryList] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);
  const { mapCenter, setMapCenter } = useContext(MapCenterContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);

  useEffect(() => {
    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
      setMasterSwitch(true);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (shopModal && zoomHelper) {
      setMapCenter({
        lat: selectedShop[0].lat,
        lng: selectedShop[0].lng,
      });
    }
  }, [shopModal]);

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

  const handleShopModalClose = () => {
    setSelectedShop({ ...selectedShop, id: 0, orgName: "" });
    setItineraryList("");
    setShopModal(false);
  };

  return (
    <View
      style={{
        height: "100%",
        // backgroundColor: "orange",
        overflow: "hidden",
      }}
    >
      <ModalHeader
        titleText={selectedShop[0] && selectedShop[0].orgName}
        onClose={handleShopModalClose}
        icon={null}
        altButton={null}
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
});
