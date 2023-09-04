import {
  Text,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import ImagePicker from "../../components/ImagePicker";

import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../store/context";

function EditFarmerDetails({ route, navigation }) {
  const AppCtx = useContext(AppContext);

  const { infoId } = route.params;

  const [ophoto, setOPhoto] = useState({
    value: undefined,
    isValid: true,
  });

  const [ophone, setOphone] = useState({
    value: "",
    isValid: true,
  });

  const [oname, setOName] = useState({
    value: "",
    isValid: true,
  });

  const [oage, setOAge] = useState({
    value: "",
    isValid: true,
  });

  const [ogender, setOGender] = useState({
    value: "",
    isValid: true,
  });

  const [onida, setONida] = useState({
    value: "",
    isValid: true,
  });

  const [genderIcon, setGenderIcon] = useState("chevron-down");
  const [toggleGender, setToggleGender] = useState("none");
  const [imageUrl, setImageUrl] = useState();
  const [isOnEditing, setIsOnEditing] = useState(false);
  const [nextLoader, setNextLoader] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState();

  useEffect(() => {
    if (Platform.OS === "android") {
      setOGender((prevState) => {
        return {
          ...prevState,
          value: "MALE",
        };
      });
    }
  }, []);

  useEffect(() => {
    if (infoId) {
      AppCtx.gatheredData.forEach((data) => {
        if (+data.id === +infoId) {
          setDataToUpdate(data);
          setOName((prevState) => {
            return {
              ...prevState,
              value: data.get_owner_info.full_name,
            };
          });
          setOAge((prevState) => {
            return {
              ...prevState,
              value: data.get_owner_info.age.toString(),
            };
          });

          setOGender((prevState) => {
            return {
              ...prevState,
              value: data.get_owner_info.gender,
            };
          });

          setONida((prevState) => {
            return {
              ...prevState,
              value: data.get_owner_info.nationalID,
            };
          });

          setOphone((prevState) => {
            return {
              ...prevState,
              value: data.get_owner_info.phone,
            };
          });

          setOPhoto((prevState) => {
            return {
              ...prevState,
              value: "Use Old",
            };
          });

          console.log("image url ", data.get_owner_info.photo);
          setImageUrl(data.get_owner_info.photo);
          setIsOnEditing(true);
        }
      });
    }
  }, [infoId, AppCtx.gatheredData]);

  function goToNextScreen() {
    setNextLoader(true);

    const nameValid = oname.value.trim().length > 0;
    const ageValid = oage.value.trim().length > 0;
    const genderValid = ogender.value.trim().length > 0;

    let nidaValid = true;
    if (onida.value !== null) {
      if (onida.value.trim().length > 0) {
        nidaValid =
          onida.value.trim().length > 0 &&
          !isNaN(+onida.value) &&
          !onida.value.includes("+") &&
          !onida.value.includes(".") &&
          !onida.value.includes("-");
      }
    }

    const phoneValid =
      !isNaN(+ophone.value) &&
      ophone.value.length === 10 &&
      !ophone.value.includes("+") &&
      !ophone.value.includes(".") &&
      !ophone.value.includes("-");

    const photoValid = ophoto.value !== undefined;

    if (
      !nameValid ||
      !ageValid ||
      !genderValid ||
      !nidaValid ||
      !phoneValid ||
      !photoValid
    ) {
      alert("Please make sure you filled all the fields correctly");
      setOName((prevState) => {
        return {
          ...prevState,
          isValid: nameValid,
        };
      });

      setOAge((prevState) => {
        return {
          ...prevState,
          isValid: ageValid,
        };
      });

      setOGender((prevState) => {
        return {
          ...prevState,
          isValid: genderValid,
        };
      });

      setONida((prevState) => {
        return {
          ...prevState,
          isValid: nidaValid,
        };
      });

      setOphone((prevState) => {
        return {
          ...prevState,
          isValid: phoneValid,
        };
      });

      setOPhoto((prevState) => {
        return {
          ...prevState,
          isValid: photoValid,
        };
      });
      setNextLoader(false);
      return;
    }
    console.log("all valid");
    const metadata = {
      page1: {
        oname: oname.value,
        oage: oage.value,
        ogender: ogender.value,
        onida: onida.value,
        ophone: ophone.value,
        ophoto: ophoto.value,
      },
    };
    AppCtx.manipulateUpdatedDataRecord(metadata);

    setNextLoader(false);
    navigation.navigate("EditRecords2", {
      data: dataToUpdate,
    });
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
          <Text style={[styles.sub, { fontFamily: "overpass-reg" }]}>
            Farm Owner Details
          </Text>
          <View style={{ marginTop: "2%" }}>
            {imageUrl && (
              <ImagePicker
                isValid={ophoto.isValid}
                isOnEditing={true}
                imageUrl={imageUrl}
                fileHandler={(image) => {
                  setOPhoto((prevState) => {
                    return {
                      ...prevState,
                      value: image,
                      isValid: true,
                    };
                  });
                }}
              />
            )}
          </View>
          <View>
            <TextInput
              label="Full name"
              placeholder="Full name"
              autoCorrect={false}
              mode="outlined"
              value={oname.value}
              style={styles.tinput}
              onChangeText={(text) => {
                setOName((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                });
              }}
              activeOutlineColor={oname.isValid ? "black" : "#EF233C"}
              outlineColor={oname.isValid ? "black" : "#EF233C"}
            />
            <TextInput
              label="Age"
              mode="outlined"
              maxLength={3}
              placeholder="Age"
              keyboardType="numeric"
              inputMode="numeric"
              style={styles.tinput}
              value={oage.value}
              onChangeText={(text) => {
                setOAge((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                });
              }}
              activeOutlineColor={oage.isValid ? "black" : "#EF233C"}
              outlineColor={oage.isValid ? "black" : "#EF233C"}
            />
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (toggleGender === "none") {
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
                      value={ogender.value}
                      activeOutlineColor={ogender.isValid ? "black" : "#EF233C"}
                      outlineColor={ogender.isValid ? "black" : "#EF233C"}
                      right={<TextInput.Icon icon={genderIcon} />}
                    />
                  </View>
                </Pressable>
                <Picker
                  name="dropdown"
                  selectedValue={ogender.value}
                  onValueChange={(gender) => {
                    setOGender((prevState) => {
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
                      selectedValue={ogender.value}
                      onValueChange={(gender) => {
                        setOGender((prevState) => {
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
              label="NIDA number"
              mode="outlined"
              placeholder="NIDA number"
              maxLength={20}
              style={styles.tinput}
              value={onida.value}
              keyboardType="numeric"
              onChangeText={(text) => {
                setONida((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                });
              }}
              activeOutlineColor={onida.isValid ? "black" : "#EF233C"}
              outlineColor={onida.isValid ? "black" : "#EF233C"}
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
              label="Phone number"
              mode="outlined"
              maxLength={10}
              placeholder="Phone number"
              style={[styles.tinput]}
              value={ophone.value}
              keyboardType="numeric"
              onChangeText={(text) => {
                setOphone((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                });
              }}
              activeOutlineColor={ophone.isValid ? "black" : "#EF233C"}
              outlineColor={ophone.isValid ? "black" : "#EF233C"}
            />
          </View>
          <View style={{ marginVertical: "10%" }}>
            <Button
              mode="contained"
              style={{ backgroundColor: "#55A630" }}
              onPress={goToNextScreen}
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

export default EditFarmerDetails;

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
    backgroundColor: "white",
  },
});
