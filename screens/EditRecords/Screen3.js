import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback, useContext } from "react";
import Animated, { FadeInUp, FadeOutUp, set } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button, HelperText } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { fetchDistricts, fetchRegions } from "../../utils/requests";
import { StatusBar } from "expo-status-bar";
import { AppContext } from "../../store/context";

function EditRecordsKinInfo({ route, navigation }) {
  const myAppCtx = useContext(AppContext);
  const { data } = route.params;
  //   const [regionDistricts, setRegionDistricts] = useState([]);
  const [toggleGender, setToggleGender] = useState("none");
  const [genderIcon, setGenderIcon] = useState("chevron-down");
  const [toggleFmRegion, setToggleFmRegion] = useState("none");
  const [fmRegionIcon, setFmRegionIcon] = useState("chevron-down");
  const [toggleFmDistrict, setToggleFmDistrict] = useState("none");
  const [fmDistrictIcon, setFmDistrictIcon] = useState("chevron-down");

  const [toLastPageLoader, setToLastPageLoader] = useState(false);

  const [nkname, setNkname] = useState({
    value: data.nextkin_info.name,
    isValid: true,
  });
  const [nkage, setNkage] = useState({
    value: data.nextkin_info.age.toString(),
    isValid: true,
  });
  const [nkgender, setNkgender] = useState({
    value: data.nextkin_info.gender.toUpperCase(),
    isValid: true,
  });
  const [nknida, setNknida] = useState({
    value:
      data.nextkin_info.nationalID === null ? "" : data.nextkin_info.nationalID,
    isValid: true,
  });
  const [nkphone, setNkphone] = useState({
    value: data.nextkin_info.phone,
    isValid: true,
  });

  const [farmregion, setFarmRegion] = useState({
    value: "",
    isValid: true,
  });
  const [farmdistrict, setFarmDistrict] = useState({
    value: data.farm_location.district,
    isValid: true,
  });
  const [farmward, setFarmWard] = useState({
    value: data.farm_location.ward,
    isValid: true,
  });

  const [fetchedRegions, setFetchedRegions] = useState([]);
  const [fetchedDistricts, setFetchedDistricts] = useState([]);

  const [regionDistricts, setRegionDistricts] = useState();

  const [displaySpinner, setDisplaySpinner] = useState(true);

  useEffect(() => {
    setDisplaySpinner(true);
    Platform.OS === "android" &&
      setNkgender((prevState) => {
        return {
          ...prevState,
          value: "MALE",
        };
      });

    fetchRegions()
      .then((data) => {
        setFetchedRegions(data);
        // Platform.OS === "android" &&
        //   setFarmRegion((prevState) => {
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
        //   setFarmDistrict((prevState) => {
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
    setFarmRegion((prevState) => {
      return {
        ...prevState,
        value: data.farm_location.region,
      };
    });
    const filteredDistricts = fetchedDistricts.filter(
      (district) => district.region === data.farm_location.region
    );
    setRegionDistricts(filteredDistricts);
  }, [data, fetchedDistricts]);

  function handlerRegionChange(itemValue) {
    setFarmRegion((prevState) => {
      return {
        ...prevState,
        value: itemValue,
        isValid: true,
      };
    });

    if (Platform.OS === "ios") {
      setFarmDistrict((prevState) => {
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
      setFarmDistrict((prevState) => {
        return {
          ...prevState,
          value: filteredDistricts[0].name,
          isValid: true,
        };
      });
    }
  }

  function goToLastPage() {
    setToLastPageLoader(true);

    const nknameValid = nkname.value.trim().length > 0;
    const nkageValid = nkage.value.trim().length > 0;
    const nkgenderValid = nkgender.value.trim().length > 0;

    let nknidaValid = true;
    if (nknida.value.trim().length > 0) {
      nknidaValid =
        !isNaN(+nknida.value) &&
        !nknida.value.includes("+") &&
        !nknida.value.includes(".") &&
        !nknida.value.includes("-");
    }

    const nkphoneValid =
      nkphone.value.trim().length > 0 &&
      !isNaN(+nkphone.value) &&
      nkphone.value.trim().length === 10 &&
      !nkphone.value.includes("+") &&
      !nkphone.value.includes(".") &&
      !nkphone.value.includes("-");
    const farmregionValid = farmregion.value.trim().length > 0;
    const farmdistrictValid = farmdistrict.value.trim().length > 0;
    const farmwardValid = farmward.value.trim().length > 0;

    if (
      !nknameValid ||
      !nkageValid ||
      !nkgenderValid ||
      !nknidaValid ||
      !nkphoneValid ||
      !farmregionValid ||
      !farmdistrictValid ||
      !farmwardValid
    ) {
      alert("Please make sure you have filled all the fields correctly");
      setToLastPageLoader(false);

      setNkname((prevState) => {
        return {
          ...prevState,
          isValid: nknameValid,
        };
      });
      setNkage((prevState) => {
        return {
          ...prevState,
          isValid: nkageValid,
        };
      });
      setNkgender((prevState) => {
        return {
          ...prevState,
          isValid: nkgenderValid,
        };
      });
      setNknida((prevState) => {
        return {
          ...prevState,
          isValid: nknidaValid,
        };
      });
      setNkphone((prevState) => {
        return {
          ...prevState,
          isValid: nkphoneValid,
        };
      });
      setFarmRegion((prevState) => {
        return {
          ...prevState,
          isValid: farmregionValid,
        };
      });
      setFarmDistrict((prevState) => {
        return {
          ...prevState,
          isValid: farmdistrictValid,
        };
      });
      setFarmWard((prevState) => {
        return {
          ...prevState,
          isValid: farmwardValid,
        };
      });

      return;
    }

    console.log("Is valid");
    const metadata = {
      page3: {
        nkname: nkname.value,
        nkage: nkage.value,
        nkgender: nkgender.value,
        nknida: nknida.value,
        nkphone: nkphone.value,
        farmregion: farmregion.value,
        farmdistrict: farmdistrict.value,
        farmward: farmward.value,
      },
    };
    myAppCtx.manipulateUpdatedDataRecord(metadata);
    setToLastPageLoader(false);
    navigation.navigate("EditRecords4", {
      data: data,
    });
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
          <Text style={[styles.sub]}>Farm Owner's Next Kin Details</Text>
          <View>
            <TextInput
              mode="outlined"
              label="Full name"
              placeholder=""
              value={nkname.value}
              onChangeText={(text) =>
                setNkname((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={nkname.isValid ? "black" : "#EF233C"}
              outlineColor={nkname.isValid ? "black" : "#EF233C"}
              style={[styles.formInput, { backgroundColor: "white" }]}
            />
            <TextInput
              mode="outlined"
              label="Age"
              keyboardType="numeric"
              placeholder=""
              value={nkage.value}
              onChangeText={(text) =>
                setNkage((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={nkage.isValid ? "black" : "#EF233C"}
              outlineColor={nkage.isValid ? "black" : "#EF233C"}
              style={[styles.formInput, { backgroundColor: "white" }]}
            />
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (toggleGender === "none") {
                      // region
                      setToggleFmRegion("none");
                      setFmRegionIcon("chevron-down");
                      // district
                      setToggleFmDistrict("none");
                      setFmDistrictIcon("chevron-down");

                      setToggleGender("flex");
                      setGenderIcon("chevron-up");
                    } else if (toggleGender === "flex") {
                      setToggleGender("none");
                      setGenderIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      label="Gender"
                      mode="outlined"
                      style={styles.tinput}
                      editable={false}
                      value={nkgender.value}
                      activeOutlineColor={
                        nkgender.isValid ? "black" : "#EF233C"
                      }
                      outlineColor={nkgender.isValid ? "black" : "#EF233C"}
                      right={<TextInput.Icon icon={genderIcon} />}
                    />
                  </View>
                </Pressable>
                <Picker
                  name="dropdown"
                  selectedValue={nkgender.value}
                  onValueChange={(gender) => {
                    setNkgender((prevState) => {
                      return {
                        ...prevState,
                        value: gender,
                        isValid: true,
                      };
                    });
                  }}
                  style={[styles.pickedStyling, { display: toggleGender }]}
                >
                  <Picker.Item label="MALE" value="MALE" />
                  <Picker.Item label="FEMALE" value="FEMALE" />
                </Picker>
              </>
            ) : (
              <>
                <View style={{ marginTop: "2%" }}>
                  <Text style={{ marginLeft: "3%" }}>Gender</Text>
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
                      selectedValue={nkgender.value}
                      onValueChange={(gender) => {
                        setNkgender((prevState) => {
                          return {
                            ...prevState,
                            value: gender,
                            isValid: true,
                          };
                        });
                      }}
                      style={[styles.pickedStyling]}
                    >
                      <Picker.Item label="MALE" value="MALE" />
                      <Picker.Item label="FEMALE" value="FEMALE" />
                    </Picker>
                  </View>
                </View>
              </>
            )}

            <TextInput
              mode="outlined"
              label="Phone number"
              maxLength={10}
              keyboardType="numeric"
              placeholder=""
              value={nkphone.value}
              onChangeText={(text) =>
                setNkphone((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={nkphone.isValid ? "black" : "#EF233C"}
              outlineColor={nkphone.isValid ? "black" : "#EF233C"}
              style={[
                styles.formInput,
                { marginTop: "4%", backgroundColor: "white" },
              ]}
            />
            <TextInput
              mode="outlined"
              label="National ID number"
              keyboardType="numeric"
              maxLength={20}
              value={nknida.value}
              onChangeText={(text) =>
                setNknida((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={nknida.isValid ? "black" : "#EF233C"}
              outlineColor={nknida.isValid ? "black" : "#EF233C"}
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
            <Text style={[styles.sub]}>Farm Location</Text>
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (toggleFmRegion === "none") {
                      // region
                      setToggleGender("none");
                      setGenderIcon("chevron-down");
                      // district
                      setToggleFmDistrict("none");
                      setFmDistrictIcon("chevron-down");

                      setToggleFmRegion("flex");
                      setFmRegionIcon("chevron-up");
                    } else if (toggleFmRegion === "flex") {
                      setToggleFmRegion("none");
                      setFmRegionIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      label="Region"
                      mode="outlined"
                      style={styles.tinput}
                      editable={false}
                      value={farmregion.value}
                      activeOutlineColor={
                        farmregion.isValid ? "black" : "#EF233C"
                      }
                      outlineColor={farmregion.isValid ? "black" : "#EF233C"}
                      right={<TextInput.Icon icon={fmRegionIcon} />}
                    />
                  </View>
                </Pressable>
                <Picker
                  mode="dropdown"
                  selectedValue={farmregion.value}
                  onValueChange={handlerRegionChange}
                  style={[styles.pickerStyling, { display: toggleFmRegion }]}
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
                      selectedValue={farmregion.value}
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
                    if (farmregion.value.trim().length === 0) {
                      alert("Please select a region first");
                      return;
                    }
                    if (toggleFmDistrict === "none") {
                      // region
                      setToggleGender("none");
                      setGenderIcon("chevron-down");
                      // district
                      setToggleFmRegion("none");
                      setFmRegionIcon("chevron-down");

                      setToggleFmDistrict("flex");
                      setFmDistrictIcon("chevron-up");
                    } else if (toggleFmDistrict === "flex") {
                      setToggleFmDistrict("none");
                      setFmDistrictIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      label="District"
                      mode="outlined"
                      style={styles.tinput}
                      editable={false}
                      value={farmdistrict.value}
                      activeOutlineColor={
                        farmdistrict.isValid ? "black" : "#EF233C"
                      }
                      outlineColor={farmdistrict.isValid ? "black" : "#EF233C"}
                      right={<TextInput.Icon icon={fmDistrictIcon} />}
                    />
                  </View>
                </Pressable>
                <Picker
                  mode="dropdown"
                  selectedValue={farmdistrict.value}
                  onValueChange={(district) =>
                    setFarmDistrict((prevState) => {
                      return {
                        ...prevState,
                        value: district,
                        isValid: true,
                      };
                    })
                  }
                  style={[styles.pickerStyling, { display: toggleFmDistrict }]}
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
                      selectedValue={farmdistrict.value}
                      onValueChange={(district) =>
                        setFarmDistrict((prevState) => {
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
              value={farmward.value}
              onChangeText={(text) =>
                setFarmWard((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={farmward.isValid ? "black" : "#EF233C"}
              outlineColor={farmward.isValid ? "black" : "#EF233C"}
              style={[styles.formInput, { backgroundColor: "white" }]}
            />
          </View>
          <View
            style={{
              marginVertical: "5%",
            }}
          >
            <Button
              mode="contained"
              loading={toLastPageLoader}
              style={{ backgroundColor: "#55A630" }}
              onPress={goToLastPage}
            >
              Next
            </Button>
          </View>
          <View style={{ height: 50 }}></View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EditRecordsKinInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "94%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingVertical: 15,
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
});
