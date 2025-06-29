import React from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import Svg, { Circle, Path } from 'react-native-svg';
import { useMapStore } from '../../useMapStore';
import { Coordinates } from '../../../../entities/coordinates';
import iconConfig from '../../../../icons/_config.json';
import { colors } from "../../../styles";
import { moderateScale } from "react-native-size-matters";

type MarkerDiveSiteClusterProps = {
  coordinate: Coordinates;
  getExpansionZoom: () => number;
};

export function MarkerDiveSiteCluster(props: MarkerDiveSiteClusterProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const pathData = iconConfig.anchors?.[1] ?? '';

  const scale = 0.85;
  const center = 256;
  const translate = center * (1 - scale); // 38.4

  return (
    <Marker
      coordinate={props.coordinate}
      onPress={() => {
        const expansionZoom = Math.min(props.getExpansionZoom(), 16);
        mapRef?.animateCamera({
          center: props.coordinate,
          zoom: expansionZoom,
        });
      }}
    >
      <View style={{ width: moderateScale(30), height: moderateScale(30) }}>
        <Svg width={moderateScale(30)} height={moderateScale(30)} viewBox="0 0 512 512">
          <Circle fill="gray" cx="256" cy="256" r="256" />
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
