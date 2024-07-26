import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Itinerary from "../itineraries/itinerary";
import { itineraries } from "../../supabaseCalls/itinerarySupabaseCalls";
import { SelectedShopContext } from "../contexts/selectedShopContext";
import { scale } from "react-native-size-matters";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { MapConfigContext } from "../contexts/mapConfigContext";
import { MasterContext } from "../contexts/masterContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import ModalHeader from "../reusables/modalHeader";
import { useMapFlip } from "../itineraries/hooks";

export default function ShopModal() {
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const [itineraryList, setItineraryList] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const { setMasterSwitch } = useContext(MasterContext);
  const { setMapCenter } = useContext(MapCenterContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setMapConfig } = useContext(MapConfigContext);

  useEffect(() => {
    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
      setMasterSwitch(true);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (largeModal && zoomHelper) {
      setMapCenter({
        lat: selectedShop[0].lat,
        lng: selectedShop[0].lng,
      });
    }
  }, [largeModal]);

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
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("ShopMaskIcon");
    setLargeModal(!largeModal);
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
                  buttonOneText="Map"
                  buttonOneIcon="anchor"
                  buttonOneAction={() =>
                    useMapFlip(
                      itinerary.siteList,
                      setSitesArray,
                      setZoomHelper,
                      setLargeModal,
                      setMapConfig,
                      setMapCenter
                    )
                  }
                  buttonTwoText="Book"
                  buttonTwoIcon="diving-scuba-flag"
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
