import  { useEffect, useState } from "react";
import {
  Heatmap,
} from "react-native-maps";
import { moderateScale } from "react-native-size-matters";

import { HeatPoint } from "../../../../entities/heatPoint";
import { heatPointToWeightedLocation } from "../../dto/heatPointToWeightedLocation";
type MarkerHeatPointProps = {
  // map:        google.maps.Map | null
  // options?:   google.maps.visualization.HeatmapLayerOptions
  heatPoints: HeatPoint[]
};

type WeightedLatLng = {
  latitude: number;
  longitude: number;
  weight?: number;
};

export function MarkerHeatPoint(props: MarkerHeatPointProps) {

  const [heatPoints, setHeatPoints] = useState<WeightedLatLng[] | null>([]);

  useEffect(() => {
    if (props.heatPoints) {
      setHeatPoints(props.heatPoints.map(point => heatPointToWeightedLocation(point)));
    }
  }, [props.heatPoints]);

  if (heatPoints?.length > 0) {
    return (
      <Heatmap
        points={heatPoints}
        radius={40}
      />
    );
  } else {
    return null;
  }
}
