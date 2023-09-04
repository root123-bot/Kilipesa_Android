import Geolocation from "react-native-geolocation-service";
import { Platform, PermissionsAndroid } from "react-native";

export const getCurrentLocation = () => {
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        resolve(cords);
      },
      (error) => {
        reject(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === "ios") {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          "whenInUse"
        );
        if (permissionStatus === "granted") {
          resolve("granted");
        }
        reject("permission not granted");
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSION.ACCESS_FINE_LOCATION
    )
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULT.GRANTED) {
          resolve("granted");
        }
        return reject("Location permission denied");
      })
      .catch((error) => {
        console.log("Ask location permssion error: ", error);
        return reject;
      });
  });
