function filterSites(newParams, array) {

  const newArr = [];
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

  const newArr = [];
  heatValues.forEach((heatPoint) => {
    const newpt = {
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

  const minLat = Lat - 0.005;
  const maxLat = Lat + 0.005;
  const minLng = Lng - 0.005;
  const maxLng = Lng + 0.005;


  return { minLat, maxLat, minLng, maxLng };
}
export { filterSites, formatHeatVals, calculateZoom, newGPSBoundaries };
