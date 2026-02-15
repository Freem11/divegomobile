import React, { useMemo, memo } from "react";
import { Heatmap } from "react-native-maps";

import { HeatPoint } from "../../../../entities/heatPoint";
import { heatPointToWeightedLocation } from "../../dto/heatPointToWeightedLocation";

type MarkerHeatPointProps = {
  heatPoints: HeatPoint[];
};

const MarkerHeatPoint = (props: MarkerHeatPointProps) => {
  const weightedPoints = useMemo(() => {
    if (!props.heatPoints || props.heatPoints.length === 0) return [];
    return props.heatPoints.map(point => heatPointToWeightedLocation(point));
  }, [props.heatPoints]);

  // Never return null — AIRGoogleMap insertReactSubview throws for nil
  const points = weightedPoints.length > 0
    ? weightedPoints
    : [{ latitude: 0, longitude: 0, weight: 0 }];

  return (
    <Heatmap
      points={points}
      radius={weightedPoints.length > 0 ? 40 : 0}
      opacity={weightedPoints.length > 0 ? 1 : 0}
    />
  );
};

export default memo(MarkerHeatPoint);