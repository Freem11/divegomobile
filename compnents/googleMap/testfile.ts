type LatLng = { latitude: number; longitude: number };

// ✅ Chaikin smoothing that preserves start and end points
function chaikinSmoothPreserveEnds(points: LatLng[], iterations: number = 3): LatLng[] {
  let smoothed = points;
  for (let iter = 0; iter < iterations; iter++) {
    const newPoints: LatLng[] = [smoothed[0]]; // keep first point

    for (let i = 0; i < smoothed.length - 1; i++) {
      const p0 = smoothed[i];
      const p1 = smoothed[i + 1];

      const Q = {
        latitude: 0.75 * p0.latitude + 0.25 * p1.latitude,
        longitude: 0.75 * p0.longitude + 0.25 * p1.longitude,
      };
      const R = {
        latitude: 0.25 * p0.latitude + 0.75 * p1.latitude,
        longitude: 0.25 * p0.longitude + 0.75 * p1.longitude,
      };

      newPoints.push(Q, R);
    }

    newPoints.push(smoothed[smoothed.length - 1]); // keep last point
    smoothed = newPoints;
  }

  return smoothed;
}

// ✅ Distance-aware resampler (keeps endpoints exact)
function resample(points: LatLng[], targetCount: number): LatLng[] {
  const result: LatLng[] = [];
  const distances: number[] = [0];
  let totalDist = 0;

  // Compute cumulative distances
  for (let i = 1; i < points.length; i++) {
    const dLat = points[i].latitude - points[i - 1].latitude;
    const dLon = points[i].longitude - points[i - 1].longitude;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    totalDist += dist;
    distances.push(totalDist);
  }

  // Generate evenly spaced samples
  for (let i = 0; i < targetCount; i++) {
    const target = (i / (targetCount - 1)) * totalDist;
    let j = 0;
    while (j < distances.length - 1 && distances[j + 1] < target) j++;

    const ratio = (target - distances[j]) / (distances[j + 1] - distances[j]);
    const p0 = points[j];
    const p1 = points[j + 1];

    result.push({
      latitude: p0.latitude + (p1.latitude - p0.latitude) * ratio,
      longitude: p0.longitude + (p1.longitude - p0.longitude) * ratio,
    });
  }

  return result;
}

// ✅ Combined smoothing pipeline
function smoothLinePreserveEndpoints(points: LatLng[], targetCount = 100): LatLng[] {
  const smoothed = chaikinSmoothPreserveEnds(points, 3);
  return resample(smoothed, targetCount);
}

// --- Your data ---
const coastlineInnerPoints: LatLng[] = [
  { latitude: 24.780, longitude: -112.370 },
  { latitude: 24.775, longitude: -112.350 },
  { latitude: 24.700, longitude: -112.300 },
  { latitude: 24.600, longitude: -112.200 },
  { latitude: 24.500, longitude: -112.120 },
  { latitude: 24.350, longitude: -111.850 },
  { latitude: 24.300, longitude: -111.800 },
  { latitude: 24.230, longitude: -111.750 },
  { latitude: 24.300, longitude: -111.550 },
  { latitude: 24.200, longitude: -111.350 },
  { latitude: 24.100, longitude: -111.150 },
  { latitude: 24.000, longitude: -111.000 },
];

const outerOceanArcPoints: LatLng[] = [
  { latitude: 24.700, longitude: -112.480 },
  { latitude: 24.650, longitude: -112.520 },
  { latitude: 24.600, longitude: -112.530 },
  { latitude: 24.500, longitude: -112.520 },
  { latitude: 24.400, longitude: -112.490 },
  { latitude: 24.300, longitude: -112.450 },
  { latitude: 24.150, longitude: -112.360 },
  { latitude: 24.000, longitude: -112.220 },
  { latitude: 23.900, longitude: -112.100 },
  { latitude: 23.800, longitude: -111.950 },
  { latitude: 23.700, longitude: -111.800 },
  { latitude: 23.650, longitude: -111.600 },
  { latitude: 23.650, longitude: -111.400 },
  { latitude: 23.700, longitude: -111.250 },
  { latitude: 23.775, longitude: -111.100 },
  { latitude: 23.960, longitude: -110.950 },
];

// --- Smooth them (endpoints now align perfectly) ---
const smoothedInner = smoothLinePreserveEndpoints(coastlineInnerPoints, 100);
const smoothedOuter = smoothLinePreserveEndpoints(outerOceanArcPoints, 100);

// Combine if you ever want a closed polygon
const polygonCoords = [...smoothedInner, ...smoothedOuter.reverse()];

// Example usage in React Native Maps:
{/*
<MapView.Polyline coordinates={smoothedInner} strokeColor="#33aaff" strokeWidth={2} />
<MapView.Polyline coordinates={smoothedOuter} strokeColor="#0066cc" strokeWidth={2} />
*/}

// Final Polygon Data
export default polygonCoords;
