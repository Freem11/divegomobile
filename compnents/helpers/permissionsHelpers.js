import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("error", error);
    return;
  }
});

const requestPermissions = async () => {
  try {
    const forground = await Location.requestForegroundPermissionsAsync();
    return forground.status
  } catch (e) {
    console.log({ title: "Error76", message: e.message });
  }
};

const requestHighAccuracy = async () => {
  try {
    const accurate = await Location.enableNetworkProviderAsync();
    return accurate.status
  } catch (e) {
    console.log({ title: "Error87", message: e.message });
  }
};

const getCurrentCoordinates = async() => {
  
  const { granted } = await Location.getForegroundPermissionsAsync();

  if (!granted) {
    requestPermissions();
    requestHighAccuracy();
    console.warn("location tracking denied");
  }
  foregroundSubscription?.remove();

  try {
   const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, maximumAge: 10000 });
  //  console.log("accurate to:", location)
   return location;
  } catch (e) {
    console.warn("Location tracking error");
  }
};

export { getCurrentCoordinates };
