import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { getDiveShopById } from "../../../../supabaseCalls/shopsSupabaseCalls";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useAppNavigation } from "../../../mapPage/types";
import { useDiveSiteNavigation } from "../../../screens/diveSite/types";

const styles = StyleSheet.create({
  lowerButtonText: buttonTextAlt,
  lowerButtonWrapper: [
    primaryButtonAlt,
    {
      alignItems: "center",
      textAlign: "center",
      zIndex: 2,
    },
  ],
});

export function ReturnToShopButton() {
  const navigation = useAppNavigation();
  const diveSiteNavigation = useDiveSiteNavigation();
  const mapRef = useMapStore((state) => state.mapRef);
  const navProps = useMapStore((state) => state.navProps);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);

  const onPress = async () => {
    if (navProps.pageName === "DiveSite") {
      diveSiteNavigation.goBack();
    } else {
      const diveCentreinfo = await getDiveShopById(navProps.itemId);
      // setLevelOneScreen(true);
      navigation.navigate("DiveCentre", { id: navProps.itemId });
      // setActiveScreen("DiveShopScreen", navProps.itemId);
      mapRef.animateCamera({
        center: { latitude: diveCentreinfo[0].lat, longitude: diveCentreinfo[0].lng },
        zoom: 12,
      });
    }

    setMapConfig(0, { pageName: "", itemId: 0 });
    setSitesArray([]);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.lowerButtonWrapper}>
        <Text style={styles.lowerButtonText}>
          {navProps.pageName === "DiveSite" ? "Return to Dive Site" : "Return to Dive Centre"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
