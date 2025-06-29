import React, { useContext } from "react";
import { View } from 'react-native';
import { Marker } from "react-native-maps";
import Svg, { Path } from 'react-native-svg';
import { Coordinates } from "../../../../entities/coordinates";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useMapStore } from "../../useMapStore";
import iconConfig from '../../../../icons/_config.json';
import { moderateScale } from "react-native-size-matters";


type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const mapConfig = useMapStore((state) => state.mapConfig);

  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const pathData = iconConfig.anchor?.[1] ?? '';

  const scale = 0.85;
  const center = 256;
  const translate = center * (1 - scale); // 38.4

  const handleScreen = () => {
    setActiveScreen("DiveSiteScreen", {id: props.id})
    setLevelOneScreen(true)
  }

  function handlePress() {
    if (mapConfig !== 3) {
      handleScreen()
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
      coordinate={props.coordinate}
      onPress={handlePress}
    >
      <View style={{ width: moderateScale(30), height: moderateScale(30) }}>
        <Svg width={moderateScale(30)}height={moderateScale(30)} viewBox="0 0 512 512">
          <Path
            d={pathData as string}
            fill={sitesArray.includes(props.id) ? 'gold' : 'skyblue'}
            transform={`translate(${translate}, ${translate}) scale(${scale})`}
          />
        </Svg>
      </View>
    </Marker>
  );
}
