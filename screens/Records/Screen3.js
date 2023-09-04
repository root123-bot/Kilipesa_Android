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
import AsyncStorage from "@react-native-async-storage/async-storage";

function RecordsKinInfo({ route, navigation }) {
  const myAppCtx = useContext(AppContext);
  let { page3 } = route.params ? route.params : { page3: null };

  console.log("page3 ", page3);
  //   const [regionDistricts, setRegionDistricts] = useState([]);
  const [toggleGender, setToggleGender] = useState("none");
  const [genderIcon, setGenderIcon] = useState("chevron-down");
  const [toggleFmRegion, setToggleFmRegion] = useState("none");
  const [fmRegionIcon, setFmRegionIcon] = useState("chevron-down");
  const [toggleFmDistrict, setToggleFmDistrict] = useState("none");
  const [fmDistrictIcon, setFmDistrictIcon] = useState("chevron-down");

  const [toLastPageLoader, setToLastPageLoader] = useState(false);

  const [nkname, setNkname] = useState({
    value: "",
    isValid: true,
  });
  const [nkage, setNkage] = useState({
    value: "",
    isValid: true,
  });
  const [nkgender, setNkgender] = useState({
    value: "",
    isValid: true,
  });
  const [nknida, setNknida] = useState({
    value: "",
    isValid: true,
  });
  const [nkphone, setNkphone] = useState({
    value: "",
    isValid: true,
  });

  const [farmregion, setFarmRegion] = useState({
    value: "",
    isValid: true,
  });
  const [farmdistrict, setFarmDistrict] = useState({
    value: "",
    isValid: true,
  });
  const [farmward, setFarmWard] = useState({
    value: "",
    isValid: true,
  });

  const [fetchedRegions, setFetchedRegions] = useState([]);
  const [fetchedDistricts, setFetchedDistricts] = useState([]);
  const [needtogonext, setneedtogonext] = useState(0);
  const [regionDistricts, setRegionDistricts] = useState();

  const [displaySpinner, setDisplaySpinner] = useState(true);
  const [goNextLoader, setGoNextLoader] = useState(false);

  useEffect(() => {
    console.log("he need to submit data ", needtogonext);
    async function checkForDrafts() {
      setGoNextLoader(true);
      const pg4 = await AsyncStorage.getItem("page4");
      setGoNextLoader(false);

      if (pg4) {
        navigation.navigate("Records4", {
          page4: pg4,
        });
      } else {
        navigation.navigate("Records4");
      }
    }

    if (needtogonext) {
      console.log("i need to go next...");
      checkForDrafts();
    }
  }, [needtogonext]);

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
        Platform.OS === "android" &&
          setFarmRegion((prevState) => {
            return {
              ...prevState,
              value: data[0].name,
            };
          });
      })
      .catch((err) => {
        console.log(err);
        setDisplaySpinner(true);
      });

    // fetch districts from the server
    fetchDistricts()
      .then((data) => {
        setFetchedDistricts(data);
        Platform.OS === "android" &&
          setFarmDistrict((prevState) => {
            return {
              ...prevState,
              value: data[0].name,
            };
          });
        if (Platform.OS === "android") {
          const filteredDistricts = data.filter(
            (district) => district.region === data[0].region
          );

          setRegionDistricts((prevState) => {
            return [...filteredDistricts];
          });
        }
        setDisplaySpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setDisplaySpinner(true);
      });
  }, []);

  useEffect(() => {
    page3 = JSON.parse(page3);

    if (myAppCtx.showPage3Draft) {
      console.log("i need to show page3draft");
      setNkname((prevState) => {
        return {
          ...prevState,
          value: page3.page3.nkname,
          isValid: true,
        };
      });
      setNkage((prevState) => {
        return {
          ...prevState,
          value: page3.page3.nkage.toString(),
          isValid: true,
        };
      });
      setNkgender((prevState) => {
        return {
          ...prevState,
          value: page3.page3.nkgender,
          isValid: true,
        };
      });
      setNknida((prevState) => {
        return {
          ...prevState,
          value: page3.page3.nknida,
          isValid: true,
        };
      });

      setNkphone((prevState) => {
        return {
          ...prevState,
          value: page3.page3.nkphone,
          isValid: true,
        };
      });

      setFarmRegion((prevState) => {
        return {
          ...prevState,
          value: page3.page3.farmregion,
          isValid: true,
        };
      });

      setFarmDistrict((prevState) => {
        return {
          ...prevState,
          value: page3.page3.farmdistrict,
          isValid: true,
        };
      });

      const filteredDistricts = fetchedDistricts.filter(
        (district) => district.region === page3.page3.farmregion
      );
      setRegionDistricts((prevState) => {
        return [...filteredDistricts];
      });

      setFarmWard((prevState) => {
        return {
          ...prevState,
          value: page3.page3.farmward,
          isValid: true,
        };
      });
    } else if (!myAppCtx.showPage3Draft) {
      console.log("i need to clear page3draft");
      setNkname((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });
      setNkage((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });
      setNkgender((prevState) => {
        return {
          ...prevState,
          value: "MALE",
          isValid: true,
        };
      });
      setNknida((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });

      setNkphone((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });

      if (fetchedRegions.length > 0) {
        setFarmRegion((prevState) => {
          return {
            ...prevState,
            value: fetchedRegions[0].name,
            isValid: true,
          };
        });
      }

      if (fetchedDistricts.length > 0) {
        const filteredDistricts = fetchedDistricts.filter(
          (district) => district.region === fetchedRegions[0].name
        );

        setRegionDistricts((prevState) => {
          return [...filteredDistricts];
        });

        setFarmDistrict((prevState) => {
          return {
            ...prevState,
            value: filteredDistricts[0].name,
            isValid: true,
          };
        });
      }

      setFarmWard((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });
    }
  }, [myAppCtx.showPage3Draft, fetchedRegions, fetchedDistricts]);

  useEffect(() => {
    return () => setneedtogonext(0);
  });

  useEffect(() => {
    return () => {
      // cleanup
      myAppCtx.cleanShowPage3Draft();
      myAppCtx.defaultingPage3Icon();
    };
  }, []);

  function handlerRegionChange(itemValue) {
    setFarmRegion((prevState) => {
      return {
        ...prevState,
        value: itemValue,
        isValid: true,
      };
    });

    setFarmDistrict((prevState) => {
      return {
        ...prevState,
        value: "",
        isValid: true,
      };
    });

    // set the district accordint to selected region..
    const filteredDistricts = fetchedDistricts.filter(
      (district) => district.region === itemValue
    );

    setRegionDistricts((prevState) => {
      return [...filteredDistricts];
    });
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
    AsyncStorage.setItem("page3", JSON.stringify(metadata));
    myAppCtx.manipulateAddedDataRecord(metadata);
    setToLastPageLoader(false);
    setneedtogonext((prevState) => prevState + 1);
    // navigation.navigate("Records4");
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
    <>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={{ flex: 1 }}
          >
            <Text style={[styles.sub]}>Farm Owner's Next Kin Details</Text>
            <View>
              <TextInput
                mode="outlined"
                label="Enter full name"
                placeholder="Enter full name"
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
                label="Enter age"
                keyboardType="numeric"
                placeholder="Enter age"
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
                    <Text style={{ marginLeft: "3%" }}>Select gender</Text>
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
                label="Enter phone number"
                maxLength={10}
                keyboardType="numeric"
                placeholder="Enter phone number"
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
                label="Enter NIDA number"
                placeholder="Enter NIDA number"
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
                    <Text style={{ marginLeft: "3%" }}>Select region</Text>
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
                        outlineColor={
                          farmdistrict.isValid ? "black" : "#EF233C"
                        }
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
                    style={[
                      styles.pickerStyling,
                      { display: toggleFmDistrict },
                    ]}
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
                    <Text style={{ marginLeft: "3%" }}>Select District</Text>
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
                label="Enter ward"
                placeholder="Enter ward"
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
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                mode="contained"
                style={{ backgroundColor: "#55A630", width: "48%" }}
                onPress={() => navigation.navigate("Records2")}
              >
                Prev
              </Button>
              <Button
                mode="contained"
                loading={toLastPageLoader}
                style={{ backgroundColor: "#55A630", width: "48%" }}
                onPress={goToLastPage}
              >
                Next
              </Button>
            </View>
            <View style={{ height: 50 }}></View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default RecordsKinInfo;

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
