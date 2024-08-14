import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext } from "react";
import { moderateScale } from "react-native-size-matters";
import GeocodeAutoComplete from "../locationSearch/geocodeAutocomplete";
import { SmallModalContext } from "../contexts/smallModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { MapCenterContext } from "../../compnents/contexts/mapCenterContext";
import { getCurrentCoordinates } from "../tutorial/locationTrackingRegistry";
import ModalHeader from "../reusables/modalHeader";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";

export default function MapSearchModal(props) {
  const { setMapSearchBump } = props;
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(ActiveButtonIDContext);
  const { setMapCenter } = useContext(MapCenterContext);

  const toggleMapSearchModal = () => {
    setPreviousButtonID(activeButtonID)
    setActiveButtonID("MapSearchButton")
    setSmallModal(!smallModal);
  };

  const getCurrentLocation = async () => {
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setMapCenter({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        setPreviousButtonID(activeButtonID)
        setActiveButtonID("MapSearchButton")
        setSmallModal(!smallModal);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ModalHeader
          titleText={"Map Search"}
          onClose={toggleMapSearchModal}
          icon={null}
          altButton={null}
        />
        <View style={styles.content}>
          <Text style={styles.buttonlabel}>My Current Location:</Text>
          <ModalSecondaryButton
            buttonAction={getCurrentLocation}
            icon={"my-location"}
          />
        </View>
        <GeocodeAutoComplete setMapSearchBump={setMapSearchBump} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(15),
    width: "98%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: moderateScale(250),
    // backgroundColor: "pink"
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(14),
    marginTop: moderateScale(5),
    marginLeft: moderateScale(15),
  },
});
