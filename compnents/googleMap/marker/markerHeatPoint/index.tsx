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

  if (weightedPoints.length === 0) {
    return null;
  }

  return (
    <Heatmap
      points={weightedPoints}
      radius={40}
      opacity={1}
    />
  );
};

export default memo(MarkerHeatPoint);