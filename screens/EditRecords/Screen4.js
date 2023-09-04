import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { TextInput, HelperText, Button } from "react-native-paper";
import { useState, useEffect, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import CoordinateItem from "../../components/UI/CoordinateItem";
import * as Location from "expo-location";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../store/context";
import { TransparentPopUpIconMessage } from "../../components/Message";
import { CROPS } from "../../constants/crops";

function EditCoordinatesFarm({ route, navigation }) {
  const AppCtx = useContext(AppContext);
  const { data } = route.params;
  const [toggleCurrentUse, setToggleCurrentUse] = useState("none");
  const [currentUseIcon, setCurrentUseIcon] = useState("chevron-down");
  const [fetchingLocation, setFetchingLocation] = useState("none");
  const [addrecordloader, setAddRecordLoader] = useState(false);
  const [inputCoordinate, setInputCoordinate] = useState({
    value: "",
    isValid: true,
  });
  const [isFocus, setIsFocus] = useState(false);

  const [allCoords, setAllCoords] = useState({
    value: JSON.parse(data.get_coordinates.coords),
    isValid: true,
  });

  const [currentUse, setCurrentUse] = useState({
    value: data.farm.current_use,
    isValid: true,
  });
  const [currentCrop, setCurrentCrop] = useState({
    value: data.farm.current_crop === null ? "" : data.farm.current_crop,
    isValid: true,
  });
  const [averageYield, setAverageYield] = useState({
    value:
      data.farm.average_yield === null
        ? ""
        : data.farm.average_yield.toString(),
    isValid: true,
  });

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    console.log("record submitted " + AppCtx.alreadySubmitTheRecord);
    if (AppCtx.alreadySubmitTheRecord) {
      AppCtx.alterAlreadySubmitted();
      setShowAnimation(false);
      setTimeout(() => {
        setAddRecordLoader(false);
      }, 1000);
      navigation.navigate("Index");
    }
  }, [AppCtx.alreadySubmitTheRecord]);

  useEffect(() => {
    if (Platform.OS === "android") {
      setCurrentUse((prevState) => {
        return {
          ...prevState,
          value: "LEFT OVER",
        };
      });
    }
  }, []);

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

  function removeCoordinate(index) {
    console.log("index to remove ", index);
    setAllCoords((prevState) => {
      return {
        ...prevState,
        value: prevState.value.filter((_, i) => i !== index),
      };
    });
  }

  function addRecordHandler() {
    setAddRecordLoader(true);
    setShowAnimation(true);

    const currentUseValid = currentUse.value.trim().length > 0;
    const allCoordsValid = allCoords.value.length > 2;

    console.log("Validate ", currentUseValid, allCoordsValid);

    if (!currentUseValid || !allCoordsValid) {
      alert("Please make sure you have filled all required fields correctly");
      setAddRecordLoader(false);
      setShowAnimation(false);
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

    // all is valid here check if the last coordinate is not equal to the first one then add the new one..
    const lastCoordinate = allCoords.value[allCoords.value.length - 1];
    const firstCoordinate = allCoords.value[0];
    // hii condition imezingua...
    if (lastCoordinate !== firstCoordinate) {
      setAllCoords((prevState) => {
        return {
          ...prevState,
          value: [...prevState.value, firstCoordinate],
        };
      });
    }
    // then we have the perfect data lets update our context and call context method to'
    // submit the record..... there in our context we should have the submit record method
    // also we should have the way to update the context.. after that we can redirect to
    // the dashboard/index screen.

    const metadata = {
      page4: {
        current_use: currentUse.value,
        current_crop: currentCrop.value,
        average_yield: averageYield.value,
        coordinates: allCoords.value,
        record_id: data.id,
      },
      status: "Save record",
    };

    AppCtx.manipulateUpdatedDataRecord(metadata);
  }

  const renderLabel = () => {
    if (currentCrop.value.trim().length > 0 || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "black" }]}>
          Current Crop
        </Text>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      contentContainerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
      pointerEvents={addrecordloader ? "none" : "auto"}
    >
      {addrecordloader && (
        <View
          style={{
            flex: 1,
            height: 150,
            width: 150,
            alignSelf: "center",
            position: "absolute",
            top: "40%",
            zIndex: 10,
          }}
        >
          <TransparentPopUpIconMessage
            messageHeader="Record Saved, finalizing..."
            icon="check"
            inProcess={showAnimation}
          />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          style={{ flex: 1 }}
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
                      activeOutlineColor={
                        currentUse.isValid ? "black" : "#EF233C"
                      }
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
                      backgroundColor: "white",
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
            {/* <TextInput
              mode="outlined"
              label="Current Crop"
              placeholder=""
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
            /> */}
            <View style={styles.dropdownContainer}>
              {renderLabel()}
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "black" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={CROPS}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select Current Crop" : "..."}
                searchPlaceholder="Search..."
                value={
                  currentCrop.value.trim().length > 0 ? currentCrop.value : null
                }
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setCurrentCrop((prevState) => {
                    return {
                      ...prevState,
                      value: item.value,
                      isValid: true,
                    };
                  });
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color={isFocus ? "black" : "black"}
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </View>

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
              style={[styles.formInput, { backgroundColor: "white" }]}
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
                activeOutlineColor={
                  inputCoordinate.isValid ? "black" : "#EF233C"
                }
                outlineColor={inputCoordinate.isValid ? "black" : "#EF233C"}
                style={[
                  styles.formInput,
                  { width: "80%", backgroundColor: "white" },
                ]}
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
              {/* assets/images/ha.png */}
              <Image
                source={require("../../assets/images/ha.png")}
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
                source={require("../../assets/images/loader.gif")}
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
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                marginVertical: "5%",
                width: "48%",
              }}
            >
              <Button
                mode="contained"
                style={{ backgroundColor: "#55A630" }}
                onPress={() => navigation.navigate("Index")}
              >
                Go Home
              </Button>
            </View>
            <View
              style={{
                marginVertical: "5%",
                width: "48%",
              }}
            >
              <Button
                mode="contained"
                style={{ backgroundColor: "#00B4D8" }}
                loading={addrecordloader}
                onPress={addRecordHandler}
              >
                Update Record
              </Button>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EditCoordinatesFarm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "94%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingVertical: 15,
  },
  dropdownContainer: {
    paddingVertical: 15,
    paddingBottom: 0,
  },
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
  dropdown: {
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 10,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
