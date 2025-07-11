import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { getDiveShopById } from "../../../../supabaseCalls/shopsSupabaseCalls";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";


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
  const mapRef = useMapStore((state) => state.mapRef);
  const shopId = useMapStore((state) => state.itemId);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  
  const onPress = async() => {
    const diveCentreinfo = await getDiveShopById(shopId)
    setLevelOneScreen(true);
    setActiveScreen("DiveShopScreen", shopId);
   
    mapRef.animateCamera({
      center: {latitude: diveCentreinfo[0].lat, longitude: diveCentreinfo[0].lng},
      zoom: 12,
    });
    setMapConfig(0, 0);
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
