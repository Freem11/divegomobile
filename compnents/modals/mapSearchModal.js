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
import { MapSearchModalContext } from "../../compnents/contexts/mapSearchContext";
import { MapCenterContext } from "../../compnents/contexts/mapCenterContext";
import { getCurrentCoordinates } from "../helpers/permissionsHelpers";
import ModalHeader from "../reusables/modalHeader";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";

export default function MapSearchModal(props) {
  const { setMapSearchBump } = props;
  const { setMapSearchModal } = useContext(MapSearchModalContext);
  const { setMapCenter } = useContext(MapCenterContext);

  const toggleMapSearchModal = () => {
    setMapSearchModal(false);
  };

  const getCurrentLocation = async () => {
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setMapCenter({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        setMapSearchModal(false);
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
    marginTop: moderateScale(-8),
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(14),
    marginTop: moderateScale(15),
    marginRight: moderateScale(-30),
  },
});
