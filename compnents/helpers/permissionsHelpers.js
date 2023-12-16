import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log("error", error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      console.log("location", location.coords);
    }
  }
});

const requestPermissions = async () => {
  try {
    const forground = await Location.requestForegroundPermissionsAsync();
    return forground.status
  } catch (e) {
    console.log({ title: "Error", message: e.message });
  }
};

const requestHighAccuracy = async () => {
  try {
    const accurate = await Location.enableNetworkProviderAsync();
    // console.log("que?", accurate)
    return accurate.status
  } catch (e) {
    console.log({ title: "Error", message: e.message });
  }
};

const getCurrentCoordinates = async() => {
  
  const { granted } = await Location.getForegroundPermissionsAsync();

  if (!granted) {
    requestPermissions();
    requestHighAccuracy();
    console.log("location tracking denied");
  }
  foregroundSubscription?.remove();

  try {
   const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, maximumAge: 10000 });
  //  console.log("accurate to:", location)
   return location;
  } catch (e) {
    console.log("Location tracking error");
  }
};

export { getCurrentCoordinates };
