import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { TextInput, HelperText, Button } from "react-native-paper";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import CoordinateItem from "../CoordinateItem";
import * as Location from "expo-location";

function OwnerPage4({
  disappear,
  prevHandler,
  finishHandler,
  loading,
  needupdate,
  focusHandler,
  accessmetadata,
}) {
  const [toggleCurrentUse, setToggleCurrentUse] = useState("none");
  const [currentUseIcon, setCurrentUseIcon] = useState("chevron-down");
  const [fetchingLocation, setFetchingLocation] = useState("none");
  const [addrecordloader, setAddRecordLoader] = useState(false);
  const [inputCoordinate, setInputCoordinate] = useState({
    value: "",
    isValid: true,
  });

  const [allCoords, setAllCoords] = useState({
    value: [],
    isValid: true,
  });

  const [currentUse, setCurrentUse] = useState({
    value: "",
    isValid: true,
  });
  const [currentCrop, setCurrentCrop] = useState({
    value: "",
    isValid: true,
  });
  const [averageYield, setAverageYield] = useState({
    value: "",
    isValid: true,
  });

  function removeCoordinate(index) {
    console.log("index to remove ", index);
    setAllCoords((prevState) => {
      return {
        ...prevState,
        value: prevState.value.filter((_, i) => i !== index),
      };
    });
  }
  {
    /*
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("location ", location);
    })();
  }, []);
*/
  }

  async function fetchUserLocation() {
    setFetchingLocation("flex");

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      setFetchingLocation("none");
      return;
    }

    //  Location.Accuracy.Lowest, lowers ndo good accuracy... HIGH(5) LOWEST(2) HIGH ACCURACY NI 0... INITIALLY ILIKUWA NI .HIGH(5) LETS TRY LOWERST
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
      distanceInterval: 1,
    });

    // console.log("location ", location);
    setInputCoordinate((prevState) => {
      return {
        ...prevState,
        value: `${location.coords.latitude}, ${location.coords.longitude}`,
        isValid: true,
      };
    });
    setFetchingLocation("none");
  }

  function submitRecords() {
    const currentUseValid = currentUse.value.trim().length > 0;
    const allCoordsValid = allCoords.value.length > 2;

    if (!currentUseValid || !allCoordsValid) {
      alert(
        "Please fill all required fields, make sure you have added at least 3 coordinates"
      );
      setAddRecordLoader(false);
      setCurrentUse((prevState) => {
        return {
          ...prevState,
          isValid: currentUseValid,
        };
      });
      setInputCoordinate((prevState) => {
        return {
          ...prevState,
          isValid: allCoordsValid,
        };
      });

      return;
    }
    accessmetadata((prevState) => {
      return {
        ...prevState,
        currentuse: currentUse.value,
        currentcrop: currentCrop.value,
        averageyield: averageYield.value,
        addedcoords: allCoords.value,
      };
    });
    finishHandler();
    setAddRecordLoader(false);
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        display: disappear,
      }}
    >
      <Text style={[styles.sub]}>Farm Other Informations</Text>
      <View>
        {Platform.OS === "ios" ? (
          <>
            <Pressable
              onPress={() => {
                if (toggleCurrentUse === "none") {
                  setToggleCurrentUse("flex");
                  setCurrentUseIcon("chevron-up");
                } else if (toggleCurrentUse === "flex") {
                  setToggleCurrentUse("none");
                  setCurrentUseIcon("chevron-down");
                }
              }}
            >
              <View pointerEvents="none">
                <TextInput
                  label="Current Use"
                  mode="outlined"
                  style={styles.tinput}
                  editable={false}
                  value={currentUse.value}
                  activeOutlineColor={currentUse.isValid ? "black" : "#EF233C"}
                  outlineColor={currentUse.isValid ? "black" : "#EF233C"}
                  right={<TextInput.Icon icon={currentUseIcon} />}
                />
              </View>
            </Pressable>
            <Picker
              name="dropdown"
              selectedValue={currentUse.value}
              onValueChange={(text) => {
                setCurrentUse((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                });
              }}
              style={[styles.pickedStyling, { display: toggleCurrentUse }]}
            >
              <Picker.Item label="LEFT OVER" value="LEFT OVER" />
              <Picker.Item label="FARMING" value="FARMING" />
            </Picker>
          </>
        ) : (
          <>
            <View style={{ marginTop: "2%" }}>
              <Text style={{ marginLeft: "3%" }}>Current Use</Text>
              <View
                style={{
                  borderColor: "black",
                  borderRadius: 5,
                  borderWidth: 1,
                }}
              >
                <Picker
                  name="dropdown"
                  selectedValue={currentUse.value}
                  onValueChange={(text) => {
                    setCurrentUse((prevState) => {
                      return {
                        ...prevState,
                        value: text,
                        isValid: true,
                      };
                    });
                  }}
                  style={[styles.pickedStyling]}
                >
                  <Picker.Item label="LEFT OVER" value="LEFT OVER" />
                  <Picker.Item label="FARMING" value="FARMING" />
                </Picker>
              </View>
            </View>
          </>
        )}
        <TextInput
          mode="outlined"
          label="Current Crop"
          placeholder=""
          onFocus={focusHandler.bind(this, 1)}
          value={currentCrop.value}
          onChangeText={(text) =>
            setCurrentCrop((prevState) => {
              return {
                ...prevState,
                value: text,
                isValid: true,
              };
            })
          }
          activeOutlineColor={currentCrop.isValid ? "black" : "#EF233C"}
          outlineColor={currentCrop.isValid ? "black" : "#EF233C"}
          style={styles.formInput}
        />
        <HelperText
          padding="none"
          style={{
            color: "#55A630",
            fontFamily: "montserrat-17",
          }}
          type="info"
        >
          **optional
        </HelperText>
        <TextInput
          mode="outlined"
          keyboardType="numeric"
          placeholder=""
          label="Current Crop Average Yield (Kg)"
          onFocus={focusHandler.bind(this, 2)}
          value={averageYield.value}
          onChangeText={(text) =>
            setAverageYield((prevState) => {
              return {
                ...prevState,
                value: text,
                isValid: true,
              };
            })
          }
          activeOutlineColor={averageYield.isValid ? "black" : "#EF233C"}
          outlineColor={averageYield.isValid ? "black" : "#EF233C"}
          style={styles.formInput}
        />
        <HelperText
          padding="none"
          style={{
            color: "#55A630",
            fontFamily: "montserrat-17",
          }}
          type="info"
        >
          **optional
        </HelperText>
        <Text style={[styles.sub]}>Farm's Location Coordinates</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            mode="outlined"
            onFocus={focusHandler.bind(this, 3)}
            multiline={true}
            label="Coordinates (Latitude, Longitude)"
            placeholder=""
            value={inputCoordinate.value}
            onChangeText={(text) =>
              setInputCoordinate((prevState) => {
                return {
                  ...prevState,
                  value: text,
                  isValid: true,
                };
              })
            }
            activeOutlineColor={inputCoordinate.isValid ? "black" : "#EF233C"}
            outlineColor={inputCoordinate.isValid ? "black" : "#EF233C"}
            style={[styles.formInput, { width: "80%" }]}
          />
          <TouchableOpacity
            onPress={() => {
              if (inputCoordinate.value.trim().length > 15) {
                setAllCoords((prevState) => {
                  return {
                    ...prevState,
                    value: [...prevState.value, inputCoordinate.value],
                    isValid: true,
                  };
                });

                setInputCoordinate((prevState) => {
                  return {
                    ...prevState,
                    value: "",
                    isValid: true,
                  };
                });
              }
            }}
          >
            <Ionicons name="add-circle-outline" size={50} color="#55A630" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "5%",
          }}
        >
          <Image
            source={require("../../../assets/images/ha.png")}
            style={{
              width: 20,
              height: 20,
              marginRight: "2%",
            }}
          />
          {/* onPress={fetchUserLocation} */}
          <TouchableOpacity onPress={fetchUserLocation}>
            <HelperText
              padding="none"
              style={{
                color: "#00B4D8",
                fontWeight: "bold",
                fontFamily: "montserrat-17",
                textDecorationLine: "underline",
              }}
              type="info"
            >
              fetch coordinates..
            </HelperText>
          </TouchableOpacity>
          <Image
            source={require("../../../assets/images/loader.gif")}
            style={{
              display: fetchingLocation,
              width: 20,
              height: 20,
              marginLeft: "2%",
            }}
          />
        </View>
        <View
          style={{
            minHeight: 100,
            borderWidth: 2,
            borderColor: inputCoordinate.isValid ? "#00B4D8" : "#EF233C",
            borderStyle: "dashed",
            marginTop: "5%",
            paddingBottom: "2%",
          }}
        >
          <Text
            style={[
              styles.sub,
              {
                marginTop: "3%",
                fontSize: 18,
                color: "#6C757D",
                marginLeft: "8%",
              },
            ]}
          >
            Added Coordinates
          </Text>
          <View
            style={{
              marginLeft: "5%",
            }}
          >
            <View style={{ marginTop: "1%" }}>
              {allCoords.value.map((coordinate, index) => {
                return (
                  <CoordinateItem
                    key={index}
                    coordinate={coordinate}
                    index={index}
                    onPressHandler={removeCoordinate}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          marginVertical: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          mode="contained"
          onPress={prevHandler}
          style={{ backgroundColor: "#55A630", width: "48%" }}
        >
          Prev
        </Button>
        <Button
          mode="contained"
          onPress={submitRecords}
          style={{ backgroundColor: "#00B4D8", width: "48%" }}
          loading={loading}
        >
          {needupdate ? "Update Record" : "Add record"}
        </Button>
      </View>
    </Animated.View>
  );
}

export default OwnerPage4;

const styles = StyleSheet.create({
  sub: {
    fontFamily: "overpass-reg",
    fontSize: 20,
    marginTop: "5%",
  },
  tinput: {
    marginTop: "2%",
  },
  formInput: {
    marginTop: "2%",
  },
  subInput: {
    marginTop: "2%",
    width: "40%",
  },
});
