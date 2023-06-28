function setupClusters(diveSiteData) {
  let points = diveSiteData.map((site) => ({
    type: "Feature",
    properties: {
      cluster: false,
      siteID: site.name,
      category: "Dive Site",
    },
    geometry: { type: "Point", coordinates: [site.lng, site.lat] },
  }));

  return points;
}

export { setupClusters };
