type LatLng = {
  latitude: number;
  longitude: number;
};

const originalLat = 24.250000;
const originalLon = -112.030000;

// Offset in km
const offsetNorthKm = 13;
const offsetWestKm = 5;

// Convert km offsets to degrees
const deltaLat = offsetNorthKm / 111.32;
const deltaLon = offsetWestKm / (111.32 * Math.cos(originalLat * Math.PI / 180));

// New center
const centerLat = originalLat + deltaLat;
const centerLon = originalLon - deltaLon;

// Earth radius in km
const EARTH_RADIUS_KM = 6371;

// Convert desired radii in km
const majorRadiusKm = 34 / 2;      // 17 km semi-major axis
const minorRadiusKm = 14.22 / 2;   // 5.61 km semi-minor axis

// Convert to angular distance (radians)
const R_maj = majorRadiusKm / EARTH_RADIUS_KM;
const R_min = minorRadiusKm / EARTH_RADIUS_KM;

// Rotation in radians
const angleDeg = 143;
const angleRad = angleDeg * Math.PI / 180;
const cosPhi = Math.cos(angleRad);
const sinPhi = Math.sin(angleRad);

const numPoints = 72; // every 5 degrees
const polygonCoords: LatLng[] = [];

for (let i = 0; i < numPoints; i++) {
  const theta = (i / numPoints) * 2 * Math.PI;

  // Point on unrotated ellipse
  const x = R_maj * Math.cos(theta);
  const y = R_min * Math.sin(theta);

  // Rotate point
  const xRot = x * cosPhi - y * sinPhi;
  const yRot = x * sinPhi + y * cosPhi;

  // Convert radians to degrees
  const deltaLat = yRot * (180 / Math.PI);
  const deltaLon = xRot * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180);

  polygonCoords.push({
    latitude: centerLat + deltaLat,
    longitude: centerLon + deltaLon,
  });
}

// Close the loop explicitly by adding the first point to the end
polygonCoords.push({ ...polygonCoords[0] });

export default polygonCoords;