import { heatVals } from "../data/testdata";

function filterSites(newParams, array) {

  let newArr = [];
  array.forEach((diveSite) => {
    if (
      diveSite.lat > newParams.southWest.latitude &&
      diveSite.lat < newParams.northEast.latitude &&
      diveSite.lng > newParams.southWest.longitude &&
      diveSite.lng < newParams.northEast.longitude
    ) {
      newArr.push(diveSite);
    }
  });
  return newArr;
}

function formatHeatVals(heatValues) {

  let newArr = [];
  heatValues.forEach((heatPoint) => {
    let newpt = {
      latitude: heatPoint.lat,
      longitude: heatPoint.lng,
      weight: heatPoint.weight,
    };
    newArr.push(newpt);
  });
  return newArr;
}

function calculateZoom(width, topLongitude, bottomLongitude) {

  let newZoom =
    Math.log2((360 * (width / 256)) / (topLongitude - bottomLongitude)) + 1;
  
    if (isNaN(newZoom)) (
     newZoom = 3
    )
  return newZoom;
}

function newGPSBoundaries(Lat, Lng) {

      let minLat = Lat - 0.005;
      let maxLat = Lat + 0.005;
      let minLng = Lng - 0.005;
      let maxLng = Lng + 0.005;


  return { minLat, maxLat, minLng, maxLng };
}
export { filterSites, formatHeatVals, calculateZoom, newGPSBoundaries };
