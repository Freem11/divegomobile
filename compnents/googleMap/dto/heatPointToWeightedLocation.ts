import { HeatPoint } from '../../../entities/heatPoint';

export const heatPointToWeightedLocation = (heatPoint: HeatPoint) => {
  return {
    latitude: heatPoint.lat,
    longitude: heatPoint.lng,
    weight:   heatPoint.weight,
  }
};
