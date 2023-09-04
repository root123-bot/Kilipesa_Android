import { Text, View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import ImagePicker from "../../../components/ImagePicker";
// import { Button } from "@muratoner/semantic-ui-react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

function FarmOwnerDetails({
  disappear,
  nextHandler,
  focusHandler,
  needupdate,
  accessmetadata,
}) {
  console.log("need update first page ", needupdate);
  const [genderIcon, setGenderIcon] = useState("chevron-down");
  const [toggleGender, setToggleGender] = useState("none");
  const [nextLoader, setNextLoader] = useState(false);

  const [oname, setOName] = useState({
    value: needupdate ? needupdate.get_owner_info.full_name : "",
    isValid: true,
  });
  const [oage, setOAge] = useState({
    value: needupdate ? needupdate.get_owner_info.age.toString() : "",
    isValid: true,
  });
  const [ogender, setOGender] = useState({
    value: needupdate ? needupdate.get_owner_info.gender : "",
    isValid: true,
  });
  const [onida, setONida] = useState({
    value: needupdate ? needupdate.get_owner_info.nationalID : "",
    isValid: true,
  });
  const [ophoto, setOPhoto] = useState({
    value: needupdate ? "Use Old" : undefined,
    isValid: true,
  });

  const [ophone, setOphone] = useState({
    value: needupdate ? needupdate.get_owner_info.phone : "",
    isValid: true,
  });

  function gotoNextPage() {
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
      alert("Please fill all the fields");
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
    setNextLoader(false);
    accessmetadata((prevState) => {
      return {
        ...prevState,
        oname: oname.value,
        oage: oage.value,
        ogender: ogender.value,
        onida: onida.value,
        ophone: ophone.value,
        ophoto: ophoto.value,
      };
    });
    nextHandler();
  }

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={[{ flex: 1, display: disappear }]}
    >
      <Text style={[styles.sub, { fontFamily: "overpass-reg" }]}>
        Farm Owner Details
      </Text>
      <View style={{ marginTop: "2%" }}>
        {/* <Text style={{ fontFamily: "overpass-reg" }}>Profile picture.</Text> */}
        <ImagePicker
          isValid={ophoto.isValid}
          isOnEditing={needupdate ? true : false}
          imageUrl={needupdate ? needupdate.get_owner_info.photo : undefined}
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
      </View>
      <View>
        <TextInput
          label="Full name"
          autoCorrect={false}
          placeholder=""
          mode="outlined"
          value={oname.value}
          onFocus={focusHandler.bind(this, 1)}
          style={styles.tinput}
          onChangeText={(text) => {
            setOName((prevState) => {
              return {
                ...prevState,
                value: text,
                isValid: true,
              };
            });
            // push that data to our accessmetadata..
            // accessmetadata((prevState) => {
            //   return {
            //     ...prevState,
            //     oname: text,
            //   };
            // });
          }}
          activeOutlineColor={oname.isValid ? "black" : "#EF233C"}
          outlineColor={oname.isValid ? "black" : "#EF233C"}
        />
        <TextInput
          label="Age"
          mode="outlined"
          onFocus={focusHandler.bind(this, 2)}
          placeholder=""
          maxLength={3}
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
            // push that data to our accessmetadata..
            // accessmetadata((prevState) => {
            //   return {
            //     ...prevState,
            //     oage: text,
            //   };
            // });
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
                  onFocus={focusHandler.bind(this, 3)}
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
                // push that data to our accessmetadata..
                // accessmetadata((prevState) => {
                //   return {
                //     ...prevState,
                //     ogender: gender,
                //   };
                // });
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
          label="National ID"
          mode="outlined"
          placeholder=""
          style={styles.tinput}
          value={onida.value}
          onFocus={focusHandler.bind(this, 4)}
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
          placeholder=""
          style={[styles.tinput]}
          value={ophone.value}
          keyboardType="numeric"
          onFocus={focusHandler.bind(this, 5)}
          onChangeText={(text) => {
            setOphone((prevState) => {
              return {
                ...prevState,
                value: text,
                isValid: true,
              };
            });

            // push that data to our accessmetadata..
            // accessmetadata((prevState) => {
            //   return {
            //     ...prevState,
            //     ophone: text,
            //   };
            // });
          }}
          activeOutlineColor={ophone.isValid ? "black" : "#EF233C"}
          outlineColor={ophone.isValid ? "black" : "#EF233C"}
        />
      </View>
      <View style={{ marginVertical: "5%" }}>
        <Button
          mode="contained"
          loading={nextLoader}
          onPress={gotoNextPage}
          style={{ backgroundColor: "#55A630" }}
        >
          Next
        </Button>
      </View>
    </Animated.View>
  );
}

export default FarmOwnerDetails;

const styles = StyleSheet.create({
  sub: {
    fontFamily: "montserrat-14",
    fontSize: 20,
    marginTop: "5%",
  },
  tinput: {
    marginTop: "2%",
  },
});
