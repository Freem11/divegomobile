import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import Svg, { Path } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";

import { Coordinates } from "../../../../entities/coordinates";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useMapStore } from "../../useMapStore";
import iconConfig from "../../../../icons/_config.json";
import { useAppNavigation } from "../../../mapPage/types";

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  const navigation = useAppNavigation();
  const mapConfig = useMapStore((state) => state.mapConfig);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const pathData = iconConfig.anchor?.[1] ?? "";

  const scale = 0.85;
  const center = 256;
  const translate = center * (1 - scale); // 38.4

  const handleScreen = () => {
    navigation.navigate("DiveSiteNavigator", { id: props.id });
  };

  function handlePress() {
    if (mapConfig !== 3) {
      handleScreen();
    } else {
      if (sitesArray.includes(props.id)) {
        setSitesArray(prev => prev.filter(id => id !== props.id));
      } else {
        setSitesArray(prev => [...prev, props.id]);
      }
    }
  }

  return (
    <Marker
      tracksViewChanges={tracksViewChanges}
      onLayout={() => setTracksViewChanges(false)}
      coordinate={props.coordinate}
      onPress={handlePress}
    >
      <View style={{ width: moderateScale(30), height: moderateScale(30) }}>
        <Svg width={moderateScale(30)} height={moderateScale(30)} viewBox="0 0 512 512">
          <Path
            d={pathData as string}
            fill={sitesArray.includes(props.id) ? "gold" : "skyblue"}
            transform={`translate(${translate}, ${translate}) scale(${scale})`}
          />
        </Svg>
      </View>
    </Marker>
  );
}
