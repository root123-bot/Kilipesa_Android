import { Text, View, StyleSheet, Pressable, Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { TextInput, HelperText, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

function OwnerResidence({
  disappear,
  nextHandler,
  prevHandler,
  focusHandler,
  accessmetadata,
  regions,
  needupdate,
  districts,
}) {
  const [toggleORegion, setToggleORegion] = useState("none");
  const [toggleODistrict, setToggleODistrict] = useState("none");
  const [toggleMarital, setToggleMarital] = useState("none");
  const [toggleHouse, setToggleHouse] = useState("none");
  const [goNextLoader, setGoNextLoader] = useState(false);
  const [regionIcon, setRegionIcon] = useState("chevron-down");
  const [districtIcon, setDistrictIcon] = useState("chevron-down");
  const [maritalIcon, setMaritalIcon] = useState("chevron-down");
  const [houseIcon, setHouseIcon] = useState("chevron-down");

  const [regionDistricts, setRegionsDistricts] = useState([]);

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
      alert("Please fill all the fields");
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
    setGoNextLoader(false);
    accessmetadata((prevState) => {
      return {
        ...prevState,
        oregion: oregion.value,
        odistrict: odistrict.value,
        oward: oward.value,
        fmlivestock: fmlivestock.value.trim().length > 0 ? +fmarital.value : 0,
        fmchildren: fmchildren.value.trim().length > 0 ? +fmchildren.value : 0,
        fmwives: fmchildren.value.trim().length > 0 ? +fmwives.value : 0,
        fmarital: fmarital.value,
        fmhouse: fmhouse.value,
      };
    });
    nextHandler();
  }

  const [oregion, setOregion] = useState({
    value: "",
    isValid: true,
  });

  const [odistrict, setODistrict] = useState({
    value: needupdate ? needupdate.get_owner_info.district : "",
    isValid: true,
  });

  const [oward, setOWard] = useState({
    value: needupdate ? needupdate.get_owner_info.ward : "",
    isValid: true,
  });

  const [fmarital, setFmMarital] = useState({
    value: needupdate ? needupdate.family_details.marital_status : "",
    isValid: true,
  });

  const [fmchildren, setFmChildren] = useState({
    value: needupdate ? needupdate.family_details.children.toString() : "",
    isValid: true,
  });

  const [fmwives, setFmWives] = useState({
    value: needupdate ? needupdate.family_details.noWives.toString() : "",
    isValid: true,
  });

  const [fmlivestock, setFmLivestock] = useState({
    value: needupdate ? needupdate.family_details.noLivestock.toString() : "",
    isValid: true,
  });

  const [fmhouse, setFmHouse] = useState({
    value: "",
    isValid: true,
  });

  // HAPA NDO NILIPOISHIA HII IMEKWAMA INASINDWA KUFANYA DROPDOWN YA DISTRICTS KUFANYA KAZI INITIALLY AS WE
  // HAVE THE REGION THEN WE SHOULD HAVE DROPDOWN OF DISTRICT OF THAT REGION...
  useEffect(() => {
    if (needupdate) {
      setOregion((prevState) => {
        return {
          ...prevState,
          value: needupdate ? needupdate.get_owner_info.region : "",
          isValid: true,
        };
      });
      // console.log("districts ", districts);
      // hii oregion inachelewa ku-update so sio kweli ku-filter hapa fetched districts
      // by this oregion since everytime it will say null... so directly put the owner
      // region from our needupdate object...
      // console.log("this is OREGION ", oregion);
      const filteredDistricts = districts.filter(
        (district) => district.region === needupdate.get_owner_info.region
      );
      // console.log("filtered districts ", filteredDistricts);
      setRegionsDistricts(filteredDistricts);
    }
  }, [needupdate, districts]);

  function handlerRegionChange(itemValue) {
    setOregion((prevState) => {
      return {
        ...prevState,
        value: itemValue,
        isValid: true,
      };
    });

    setODistrict((prevState) => {
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

    setRegionsDistricts((prevState) => {
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
      <Text style={[styles.sub]}>Farm Owner Residence</Text>
      <View>
        <TextInput
          mode="outlined"
          label="Country"
          activeOutlineColor="black"
          outlineColor="black"
          value="TANZANIA"
          style={{ paddingLeft: "3%" }}
          disabled
        />
      </View>
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
              }}
            >
              <Picker
                mode="dropdown"
                selectedValue={oregion.value}
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
                activeOutlineColor={odistrict.isValid ? "black" : "#EF233C"}
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
        onFocus={focusHandler.bind(this, 1)}
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
        style={[styles.formInput]}
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
                activeOutlineColor={fmarital.isValid ? "black" : "#EF233C"}
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
        onFocus={focusHandler.bind(this, 3)}
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
        style={[styles.formInput]}
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
        onFocus={focusHandler.bind(this, 4)}
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
        label="Number of Livestock"
        placeholder=""
        value={fmlivestock.value}
        onFocus={focusHandler.bind(this, 5)}
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
                <Picker.Item label="GOOD STANDARD" value="GOOD STANDARD" />
              </Picker>
            </View>
          </View>
        </>
      )}
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
          loading={goNextLoader}
          onPress={goToThirdPage}
          style={{ backgroundColor: "#55A630", width: "48%" }}
        >
          Next
        </Button>
      </View>
    </Animated.View>
  );
}

export default OwnerResidence;

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
