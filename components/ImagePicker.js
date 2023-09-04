import { Button } from "react-native-paper";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import CachedImage from "expo-cached-image";
import { useState } from "react";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { domain } from "../constants/domain";

const { width } = Dimensions.get("window");
function ImagePicker({ fileHandler, isValid, imageUrl, isOnEditing }) {
  console.log("image url is: ", imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState({
    data: isOnEditing
      ? { uri: `${domain}${imageUrl}` }
      : require("../assets/images/add.png"),
    state: "init",
  });

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermission() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to use this feature",
        [{ text: "Okay" }]
      );
      return false;
    }

    return true;
  }

  async function loadImageHandler() {
    try {
      setIsLoading(true);
      const image = await launchImageLibraryAsync({
        quality: 0.2,
      });
      if (!image.canceled) {
        fileHandler(image);
      }

      setImage({ data: image.assets[0].uri, state: "taken" });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function takeImageHandler() {
    try {
      setIsLoading(true);
      // kwenye iOS permission kucheck inahitajika ila kwenye android hawana baya ukiweka hii conditin ya verifyPermission inagoma kwenye android coz default value is DENIED in android..
      if (Platform.OS === "ios") {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
          setIsLoading(false);
          return;
        }
      }
      const image = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
      });
      if (!image.canceled) {
        fileHandler(image);
      }
      setImage({ data: image.assets[0].uri, state: "taken" });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <View
          style={[
            styles.imagePreview,
            isValid ? { borderColor: "#ccc" } : { borderColor: "red" },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator animating={true} color="#55A630" />
          ) : (
            <CachedImage
              source={image.state === "init" ? image.data : { uri: image.data }}
              cacheKey={`${(Math.random() * 100).toString()}`}
              placeholderContent={
                // (optional) -- shows while the image is loading
                <ActivityIndicator // can be any react-native tag
                  color="grey"
                  size="small"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                />
              }
              style={[
                { width: "100%", height: "100%" },
                image.state === "taken" && {
                  borderColor: "#ccc",
                  borderWidth: 2,
                  borderRadius: 10,
                },
              ]}
            />
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            icon="content-save"
            iconColor="#fff"
            mode="contained"
            style={styles.iconBtn}
            buttonColor="#55A630"
            onPress={loadImageHandler}
          >
            Pick Photo
          </Button>
          <Button
            icon="camera"
            iconColor="#fff"
            mode="contained"
            style={styles.iconBtn}
            buttonColor="#55A630"
            onPress={takeImageHandler}
          >
            Take Photo
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "5%",
  },

  iconBtn: {
    marginTop: "10%",
  },
  buttonWrapper: {},
  imagePreview: {
    width: width > 400 ? 200 : 150,
    height: width > 400 ? 200 : 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImagePicker;
