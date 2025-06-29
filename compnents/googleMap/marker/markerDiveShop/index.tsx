import React, { useContext } from "react";
import { View } from 'react-native';
import { Marker } from "react-native-maps";
import Svg, { Circle, Path } from 'react-native-svg';
import image from "../../../png/mapIcons/DiveCentre60x60.png";
import { Coordinates } from "../../../../entities/coordinates";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";
import iconConfig from '../../../../icons/_config.json';
import { colors } from "../../../styles";
import { moderateScale } from "react-native-size-matters";

type MarkerDiveShopProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveShop(props: MarkerDiveShopProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const pathData = iconConfig["dive-centre"]?.[1] ?? '';

  const scale = 0.85;
  const center = 256;
  const translate = center * (1 - scale); // 38.4

  const handleScreen = () => {
    setActiveScreen("DiveShopScreen", {id: props.id})
    setLevelOneScreen(true)
  }

  return (
    <Marker
      coordinate={props.coordinate}
      image={image}
      onPress={handleScreen}
    >
      <View style={{ width: moderateScale(30), height: moderateScale(30) }}>
        <Svg width={moderateScale(30)} height={moderateScale(30)} viewBox="0 0 512 512">
          <Circle fill={colors.primaryBlue} cx="256" cy="256" r="256" />
          <Path
            d={pathData as string}
            fill="white"
            transform={`translate(${translate}, ${translate}) scale(${scale})`}
          />
        </Svg>
      </View>
    </Marker>
  );
}
