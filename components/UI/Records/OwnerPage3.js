import { Text, View, StyleSheet, Pressable, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import { TextInput, Button, HelperText } from "react-native-paper";

function RecordsInfoThirdScreen({
  disappear,
  nextHandler,
  prevHandler,
  accessmetadata,
  needupdate,
  regions,
  focusHandler,
  districts,
}) {
  const [regionDistricts, setRegionDistricts] = useState([]);
  const [toggleGender, setToggleGender] = useState("none");
  const [genderIcon, setGenderIcon] = useState("chevron-down");
  const [toggleFmRegion, setToggleFmRegion] = useState("none");
  const [fmRegionIcon, setFmRegionIcon] = useState("chevron-down");
  const [toggleFmDistrict, setToggleFmDistrict] = useState("none");
  const [fmDistrictIcon, setFmDistrictIcon] = useState("chevron-down");

  const [toLastPageLoader, setToLastPageLoader] = useState(false);

  const [nkname, setNkname] = useState({
    value: needupdate ? needupdate.nextkin_info.name : "",
    isValid: true,
  });
  const [nkage, setNkage] = useState({
    value: needupdate ? needupdate.nextkin_info.age.toString() : "",
    isValid: true,
  });
  const [nkgender, setNkgender] = useState({
    value: needupdate ? needupdate.nextkin_info.gender : "",
    isValid: true,
  });
  const [nknida, setNknida] = useState({
    value:
      needupdate && needupdate.nextkin_info.nationalID
        ? needupdate.nextkin_info.nationalID
        : "",
    isValid: true,
  });
  const [nkphone, setNkphone] = useState({
    value: needupdate ? needupdate.nextkin_info.phone : "",
    isValid: true,
  });

  const [farmregion, setFarmRegion] = useState({
    value: "",
    isValid: true,
  });
  const [farmdistrict, setFarmDistrict] = useState({
    value: needupdate ? needupdate.farm_location.district : "",
    isValid: true,
  });
  const [farmward, setFarmWard] = useState({
    value: needupdate ? needupdate.farm_location.ward : "",
    isValid: true,
  });

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
      alert("Please fill all the fields");
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

    accessmetadata((prevState) => {
      return {
        ...prevState,
        nkname: nkname.value,
        nkage: nkage.value,
        nkgender: nkgender.value,
        nknida: nknida.value,
        nkphone: nkphone.value,
        farmregion: farmregion.value,
        farmdistrict: farmdistrict.value,
        farmward: farmward.value,
      };
    });
    setToLastPageLoader(false);
    nextHandler();
  }

  useEffect(() => {
    if (needupdate) {
      setOregion((prevState) => {
        return {
          ...prevState,
          value: needupdate ? needupdate.get_owner_info.region : "",
          isValid: true,
        };
      });

      const filteredDistricts = districts.filter(
        (district) => district.region === needupdate.farm_location.region
      );
      setRegionDistricts(filteredDistricts);
    }
  }, [needupdate, districts]);

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
    const filteredDistricts = districts.filter(
      (district) => district.region === itemValue
    );

    setRegionDistricts((prevState) => {
      return [...filteredDistricts];
    });
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
      <Text style={[styles.sub]}>Farm Owner's Next Kin Details</Text>
      <View>
        <TextInput
          mode="outlined"
          label="Full name"
          onFocus={focusHandler.bind(this, 1)}
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
          style={styles.formInput}
        />
        <TextInput
          mode="outlined"
          label="Age"
          onFocus={focusHandler.bind(this, 2)}
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
          style={styles.formInput}
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
                  activeOutlineColor={nkgender.isValid ? "black" : "#EF233C"}
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
          onFocus={focusHandler.bind(this, 1)}
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
          style={styles.formInput}
        />
        <TextInput
          mode="outlined"
          label="National ID number"
          keyboardType="numeric"
          onFocus={focusHandler.bind(this, 3)}
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
                  activeOutlineColor={farmregion.isValid ? "black" : "#EF233C"}
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
                }}
              >
                <Picker
                  mode="dropdown"
                  selectedValue={farmregion.value}
                  onValueChange={handlerRegionChange}
                  style={[styles.pickerStyling]}
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
          onFocus={focusHandler.bind(this, 4)}
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
          style={styles.formInput}
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
          onPress={prevHandler}
          style={{ backgroundColor: "#55A630", width: "48%" }}
        >
          Prev
        </Button>
        <Button
          mode="contained"
          loading={toLastPageLoader}
          onPress={goToLastPage}
          style={{ backgroundColor: "#55A630", width: "48%" }}
        >
          Next
        </Button>
      </View>
    </Animated.View>
  );
}

export default RecordsInfoThirdScreen;

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
