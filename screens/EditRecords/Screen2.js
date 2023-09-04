import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useCallback, useEffect, useState, useContext } from "react";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { TextInput, HelperText, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { fetchDistricts, fetchRegions } from "../../utils/requests";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../store/context";

function EditFarmerResidence({ route, navigation }) {
  const AppCtx = useContext(AppContext);
  const { data } = route.params;
  console.log("data to updata ", data);
  const [oregion, setOregion] = useState({
    value: "",
    isValid: true,
  });

  const [fetchedRegions, setFetchedRegions] = useState([]);
  const [fetchedDistricts, setFetchedDistricts] = useState([]);

  const [odistrict, setODistrict] = useState({
    value: data.get_owner_info.district,
    isValid: true,
  });

  const [oward, setOWard] = useState({
    value: data.get_owner_info.ward,
    isValid: true,
  });

  const [fmarital, setFmMarital] = useState({
    value: data.family_details.marital_status,
    isValid: true,
  });

  const [fmchildren, setFmChildren] = useState({
    value:
      data.family_details.children > 0
        ? data.family_details.children.toString()
        : "",
    isValid: true,
  });

  const [fmwives, setFmWives] = useState({
    value:
      data.family_details.noWives > 0
        ? data.family_details.noWives.toString()
        : "",
    isValid: true,
  });

  const [fmlivestock, setFmLivestock] = useState({
    value:
      data.family_details.noLivestock > 0
        ? data.family_details.noLivestock.toString()
        : "",
    isValid: true,
  });

  const [fmhouse, setFmHouse] = useState({
    value: data.family_details.houseType.toUpperCase(),
    isValid: true,
  });

  const [regionDistricts, setRegionDistricts] = useState();

  const [displaySpinner, setDisplaySpinner] = useState(true);
  const [goNextLoader, setGoNextLoader] = useState(false);

  useEffect(() => {
    setDisplaySpinner(true);

    Platform.OS === "android" &&
      setFmMarital((prevState) => {
        return {
          ...prevState,
          value: "SINGLE",
        };
      });
    Platform.OS === "android" &&
      setFmHouse((prevState) => {
        return {
          ...prevState,
          value: "MUD HOUSE",
        };
      });
    fetchRegions()
      .then((data) => {
        setFetchedRegions(data);
        // Platform.OS === "android" &&
        //   setOregion((prevState) => {
        //     return {
        //       ...prevState,
        //       value: data[0].name,
        //     };
        //   });
      })
      .catch((err) => {
        console.log(err);
        setDisplaySpinner(true);
      });

    // fetch districts from the server
    fetchDistricts()
      .then((data) => {
        setFetchedDistricts(data);
        // Platform.OS === "android" &&
        //   setODistrict((prevState) => {
        //     return {
        //       ...prevState,
        //       value: data[0].name,
        //     };
        //   });
        // if (Platform.OS === "android") {
        //   const filteredDistricts = data.filter(
        //     (district) => district.region === data[0].region
        //   );

        //   setRegionDistricts((prevState) => {
        //     return [...filteredDistricts];
        //   });
        // }
        setDisplaySpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setDisplaySpinner(true);
      });
  }, []);

  useEffect(() => {
    setOregion((prevState) => {
      return {
        ...prevState,
        value: data.get_owner_info.region,
      };
    });
    const filteredDistricts = fetchedDistricts.filter(
      (district) => district.region === data.get_owner_info.region
    );
    console.log("filtered districts KATAVI ", filteredDistricts);
    setRegionDistricts(filteredDistricts);
  }, [data, fetchedDistricts]);

  function goToThirdPage() {
    setGoNextLoader(true);
    const regionValid = oregion.value.trim().length > 0;
    const districtValid = odistrict.value.trim().length > 0;
    const wardValid = oward.value.trim().length > 0;
    const maritalValid = fmarital.value.trim().length > 0;
    const houseValid = fmhouse.value.trim().length > 0;

    let childrenValid = true;
    let wivesValid = true;
    let livestockValid = true;

    if (fmchildren.value.trim().length > 0) {
      if (isNaN(+fmchildren.value)) {
        childrenValid = false;
      }
      if (+fmchildren.value < 0) {
        childrenValid = false;
      }
      if (fmchildren.value.includes(".")) {
        childrenValid = false;
      }
    }

    if (fmwives.value.trim().length > 0) {
      if (isNaN(+fmwives.value)) {
        wivesValid = false;
      }
      if (+fmwives.value < 0) {
        wivesValid = false;
      }
      if (fmwives.value.includes(".")) {
        wivesValid = false;
      }
    }

    if (fmlivestock.value.trim().length > 0) {
      if (isNaN(+fmlivestock.value)) {
        livestockValid = false;
      }
      if (+fmlivestock.value < 0) {
        livestockValid = false;
      }
      if (fmlivestock.value.includes(".")) {
        livestockValid = false;
      }
    }

    if (
      !regionValid ||
      !districtValid ||
      !wardValid ||
      !maritalValid ||
      !houseValid ||
      !childrenValid ||
      !wivesValid ||
      !livestockValid
    ) {
      alert("Please fill all the fields correctly");
      setOregion((prevState) => {
        return {
          ...prevState,
          isValid: regionValid,
        };
      });
      setODistrict((prevState) => {
        return {
          ...prevState,
          isValid: districtValid,
        };
      });
      setOWard((prevState) => {
        return {
          ...prevState,
          isValid: wardValid,
        };
      });
      setFmMarital((prevState) => {
        return {
          ...prevState,
          isValid: maritalValid,
        };
      });
      setFmHouse((prevState) => {
        return {
          ...prevState,
          isValid: houseValid,
        };
      });
      setFmChildren((prevState) => {
        return {
          ...prevState,
          isValid: childrenValid,
        };
      });
      setFmWives((prevState) => {
        return {
          ...prevState,
          isValid: wivesValid,
        };
      });
      setFmLivestock((prevState) => {
        return {
          ...prevState,
          isValid: livestockValid,
        };
      });

      setGoNextLoader(false);
      return;
    }

    const metadata = {
      page2: {
        oregion: oregion.value,
        odistrict: odistrict.value,
        oward: oward.value,
        fmarital: fmarital.value,
        fmchildren: fmchildren.value,
        fmwives: fmwives.value,
        fmlivestock: fmlivestock.value,
        fmhouse: fmhouse.value,
      },
    };

    AppCtx.manipulateUpdatedDataRecord(metadata);

    setGoNextLoader(false);
    navigation.navigate("EditRecords3", {
      data,
    });
  }

  function handlerRegionChange(itemValue) {
    setOregion((prevState) => {
      return {
        ...prevState,
        value: itemValue,
        isValid: true,
      };
    });

    if (Platform.OS === "ios") {
      setODistrict((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });
    }

    // set the district accordint to selected region..
    const filteredDistricts = fetchedDistricts.filter(
      (district) => district.region === itemValue
    );

    setRegionDistricts((prevState) => {
      return [...filteredDistricts];
    });

    if (Platform.OS === "android") {
      setODistrict((prevState) => {
        return {
          ...prevState,
          value: filteredDistricts[0].name,
          isValid: true,
        };
      });
    }
  }

  if (displaySpinner) {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      contentContainerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          style={{ flex: 1 }}
        >
          <Text style={[styles.sub]}>Farm Owner Residence</Text>

          <View>
            {/* <TextInput
              mode="outlined"
              label="Country"
              activeOutlineColor="black"
              outlineColor="black"
              value="TANZANIA"
              style={{ paddingLeft: "3%" }}
              disabled
            /> */}
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (toggleORegion === "none") {
                      // district
                      setToggleODistrict("none");
                      setDistrictIcon("chevron-down");
                      // marital
                      setToggleMarital("none");
                      setMaritalIcon("chevron-down");
                      // housetype
                      setToggleHouse("none");
                      setHouseIcon("chevron-down");

                      setToggleORegion("flex");
                      setRegionIcon("chevron-up");
                    } else if (toggleORegion === "flex") {
                      setToggleORegion("none");
                      setRegionIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      label="Region"
                      textColor="black"
                      editable={false}
                      activeOutlineColor={oregion.isValid ? "black" : "#EF233C"}
                      outlineColor={oregion.isValid ? "black" : "#EF233C"}
                      value={oregion.value}
                      style={styles.formInput}
                      right={<TextInput.Icon icon={regionIcon} />}
                    />
                  </View>
                </Pressable>
                <Picker
                  mode="dropdown"
                  selectedValue={oregion.value}
                  onValueChange={handlerRegionChange}
                  style={[styles.pickerStyling, { display: toggleORegion }]}
                >
                  {regions &&
                    regions.map((region, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={region.name}
                          value={region.name}
                        />
                      );
                    })}
                </Picker>
              </>
            ) : (
              <>
                <View style={{ marginTop: "2%" }}>
                  <Text style={{ marginLeft: "3%" }}>Region</Text>
                  <View
                    style={{
                      borderColor: "black",
                      borderRadius: 5,
                      borderWidth: 1,
                      backgroundColor: "white",
                    }}
                  >
                    <Picker
                      mode="dropdown"
                      selectedValue={oregion.value}
                      onValueChange={handlerRegionChange}
                      style={[styles.pickerStyling]}
                    >
                      {fetchedRegions &&
                        fetchedRegions.map((region, index) => {
                          return (
                            <Picker.Item
                              key={index}
                              label={region.name}
                              value={region.name}
                            />
                          );
                        })}
                    </Picker>
                  </View>
                </View>
              </>
            )}

            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (oregion.value === "")
                      return alert("Please select a region first");
                    if (toggleODistrict === "none") {
                      // region
                      setToggleORegion("none");
                      setRegionIcon("chevron-down");
                      // housetype
                      setToggleHouse("none");
                      setHouseIcon("chevron-down");
                      // marital
                      setToggleMarital("none");
                      setMaritalIcon("chevron-down");

                      setToggleODistrict("flex");
                      setDistrictIcon("chevron-up");
                    } else if (toggleODistrict === "flex") {
                      setToggleODistrict("none");
                      setDistrictIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      label="District"
                      textColor="black"
                      editable={false}
                      activeOutlineColor={
                        odistrict.isValid ? "black" : "#EF233C"
                      }
                      outlineColor={odistrict.isValid ? "black" : "#EF233C"}
                      value={odistrict.value}
                      style={styles.formInput}
                      right={<TextInput.Icon icon={districtIcon} />}
                    />
                  </View>
                </Pressable>
                <Picker
                  mode="dropdown"
                  selectedValue={odistrict.value}
                  onValueChange={(district) =>
                    setODistrict((prevState) => {
                      return {
                        ...prevState,
                        value: district,
                        isValid: true,
                      };
                    })
                  }
                  style={[styles.pickerStyling, { display: toggleODistrict }]}
                >
                  {regionDistricts &&
                    regionDistricts.map((district, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={district.name}
                          value={district.name}
                        />
                      );
                    })}
                </Picker>
              </>
            ) : (
              <>
                <View style={{ marginTop: "2%" }}>
                  <Text style={{ marginLeft: "3%" }}>District</Text>
                  <View
                    style={{
                      borderColor: "black",
                      borderRadius: 5,
                      borderWidth: 1,
                      backgroundColor: "white",
                    }}
                  >
                    <Picker
                      mode="dropdown"
                      selectedValue={odistrict.value}
                      onValueChange={(district) =>
                        setODistrict((prevState) => {
                          return {
                            ...prevState,
                            value: district,
                            isValid: true,
                          };
                        })
                      }
                      style={[styles.pickerStyling]}
                    >
                      {regionDistricts.map((district, index) => {
                        return (
                          <Picker.Item
                            key={index}
                            label={district.name}
                            value={district.name}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
              </>
            )}

            <TextInput
              mode="outlined"
              label="Ward"
              placeholder=""
              value={oward.value}
              onChangeText={(text) =>
                setOWard((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={oward.isValid ? "black" : "#EF233C"}
              outlineColor={oward.isValid ? "black" : "#EF233C"}
              style={[
                styles.formInput,
                { marginTop: "4%", backgroundColor: "white" },
              ]}
            />

            <Text style={[styles.sub, { marginTop: "8%" }]}>
              Farm Owner's Family Details
            </Text>

            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (toggleMarital === "none") {
                      // region
                      setToggleORegion("none");
                      setRegionIcon("chevron-down");
                      // district
                      setToggleODistrict("none");
                      setDistrictIcon("chevron-down");
                      // housetype
                      setToggleHouse("none");
                      setHouseIcon("chevron-down");

                      setToggleMarital("flex");
                      setMaritalIcon("chevron-up");
                    } else if (toggleMarital === "flex") {
                      setToggleMarital("none");
                      setMaritalIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      label="Marital Status"
                      textColor="black"
                      editable={false}
                      activeOutlineColor={
                        fmarital.isValid ? "black" : "#EF233C"
                      }
                      outlineColor={fmarital.isValid ? "black" : "#EF233C"}
                      value={fmarital.value}
                      style={styles.formInput}
                      right={<TextInput.Icon icon={maritalIcon} />}
                    />
                  </View>
                </Pressable>

                <Picker
                  name="dropdown"
                  selectedValue={fmarital.value}
                  onValueChange={(marital) => {
                    setFmMarital((prevState) => {
                      return {
                        ...prevState,
                        value: marital,
                        isValid: true,
                      };
                    });
                  }}
                  style={[styles.pickedStyling, { display: toggleMarital }]}
                >
                  <Picker.Item label="SINGLE" value="SINGLE" />
                  <Picker.Item label="MARRIED" value="MARRIED" />
                  <Picker.Item label="WIDOWED" value="WIDOWED" />
                  <Picker.Item label="DIVORCED" value="DIVORCED" />
                </Picker>
              </>
            ) : (
              <>
                <View style={{ marginTop: "2%" }}>
                  <Text style={{ marginLeft: "3%" }}>Marital Status</Text>
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
                      selectedValue={fmarital.value}
                      onValueChange={(marital) => {
                        setFmMarital((prevState) => {
                          return {
                            ...prevState,
                            value: marital,
                            isValid: true,
                          };
                        });
                      }}
                      style={[styles.pickedStyling]}
                    >
                      <Picker.Item label="SINGLE" value="SINGLE" />
                      <Picker.Item label="MARRIED" value="MARRIED" />
                      <Picker.Item label="WIDOWED" value="WIDOWED" />
                      <Picker.Item label="DIVORCED" value="DIVORCED" />
                    </Picker>
                  </View>
                </View>
              </>
            )}

            <TextInput
              mode="outlined"
              keyboardType="numeric"
              label="Number of children"
              placeholder=""
              value={fmchildren.value}
              onChangeText={(text) =>
                setFmChildren((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={fmchildren.isValid ? "black" : "#EF233C"}
              outlineColor={fmchildren.isValid ? "black" : "#EF233C"}
              style={[
                styles.formInput,
                { marginTop: "4%", backgroundColor: "white" },
              ]}
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
              label="Number of Wives/Husbands"
              placeholder=""
              value={fmwives.value}
              onChangeText={(text) =>
                setFmWives((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={fmwives.isValid ? "black" : "#EF233C"}
              outlineColor={fmwives.isValid ? "black" : "#EF233C"}
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
            <TextInput
              mode="outlined"
              keyboardType="numeric"
              label="Number of Livestock"
              placeholder=""
              value={fmlivestock.value}
              onChangeText={(text) =>
                setFmLivestock((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={fmlivestock.isValid ? "black" : "#EF233C"}
              outlineColor={fmlivestock.isValid ? "black" : "#EF233C"}
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
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (toggleHouse === "none") {
                      // region
                      setToggleORegion("none");
                      setRegionIcon("chevron-down");
                      // district
                      setToggleODistrict("none");
                      setDistrictIcon("chevron-down");
                      // marital
                      setToggleMarital("none");
                      setMaritalIcon("chevron-down");

                      setToggleHouse("flex");
                      setHouseIcon("chevron-up");
                    } else if (toggleHouse === "flex") {
                      setToggleHouse("none");
                      setHouseIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      label="House Type"
                      textColor="black"
                      editable={false}
                      activeOutlineColor={fmhouse.isValid ? "black" : "#EF233C"}
                      outlineColor={fmhouse.isValid ? "black" : "#EF233C"}
                      value={fmhouse.value}
                      style={styles.formInput}
                      right={<TextInput.Icon icon={houseIcon} />}
                    />
                  </View>
                </Pressable>
                <Picker
                  name="dropdown"
                  selectedValue={fmhouse.value}
                  onValueChange={(house) => {
                    setFmHouse((prevState) => {
                      return {
                        ...prevState,
                        value: house,
                        isValid: true,
                      };
                    });
                  }}
                  style={[styles.pickedStyling, { display: toggleHouse }]}
                >
                  <Picker.Item label="MUD HOUSE" value="MUD HOUSE" />
                  <Picker.Item label="BLOCK HOUSE" value="BLOCK HOUSE" />
                  <Picker.Item label="GOOD STANDARD" value="GOOD STANDARD" />
                </Picker>
              </>
            ) : (
              <>
                <View style={{ marginTop: "2%" }}>
                  <Text style={{ marginLeft: "3%" }}>House Type</Text>
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
                      selectedValue={fmhouse.value}
                      onValueChange={(house) => {
                        setFmHouse((prevState) => {
                          return {
                            ...prevState,
                            value: house,
                            isValid: true,
                          };
                        });
                      }}
                      style={[styles.pickedStyling]}
                    >
                      <Picker.Item label="MUD HOUSE" value="MUD HOUSE" />
                      <Picker.Item label="BLOCK HOUSE" value="BLOCK HOUSE" />
                      <Picker.Item
                        label="GOOD STANDARD"
                        value="GOOD STANDARD"
                      />
                    </Picker>
                  </View>
                </View>
              </>
            )}
          </View>
          <View
            style={{
              marginVertical: "5%",
            }}
          >
            <Button
              mode="contained"
              style={{ backgroundColor: "#55A630" }}
              onPress={goToThirdPage}
            >
              Next
            </Button>
          </View>
          <View style={{ height: 40 }}></View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EditFarmerResidence;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "94%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingVertical: 15,
  },
  sub: {
    fontFamily: "montserrat-14",
    fontSize: 20,
    marginTop: "5%",
  },
  tinput: {
    marginTop: "2%",
  },
});
