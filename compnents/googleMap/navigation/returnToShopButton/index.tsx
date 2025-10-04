import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { getDiveShopById } from "../../../../supabaseCalls/shopsSupabaseCalls";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { getDiveSiteById } from "../../../../supabaseCalls/diveSiteSupabaseCalls";
import { useAppNavigation } from "../../../mapPage/types";

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
  const mapRef = useMapStore((state) => state.mapRef);
  const navProps = useMapStore((state) => state.navProps);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const onPress = async () => {
    if (navProps.pageName === "DiveSite") {
      const diveSiteInfo = await getDiveSiteById(navProps.itemId);
      // setLevelOneScreen(true);
      navigation.navigate("DiveSite", { id: navProps.itemId });
      // setActiveScreen("DiveSiteScreen", navProps.itemId);
      mapRef.animateCamera({
        center: { latitude: diveSiteInfo[0].lat, longitude: diveSiteInfo[0].lng },
        zoom: 12,
      });
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
          {"Return to Shop"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
