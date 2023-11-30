export const convertCoordinatesToList = (parkMarkers) => {
  const modifiedMarkers = parkMarkers.map((marker) => ({
    ...marker,
    geocode: [parseFloat(marker.latitude), parseFloat(marker.longitude)],
  }));

  return modifiedMarkers;
};
