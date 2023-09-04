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
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker2 from "../../components/ImagePicker2";
import { StatusBar } from "expo-status-bar";

function FarmerDetails({ route, navigation }) {
  const AppCtx = useContext(AppContext);
  let { page1 } = route.params ? route.params : { page1: null };

  const [isCompletedFetching, setIsCompletingFetching] = useState(false);
  const [needtogonext, setneedtogonext] = useState(0);

  const [page2, setPage2] = useState();
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

  const [nextLoader, setNextLoader] = useState(false);

  // useEffect(() => {
  //   console.log("belachao belachao 2222..");
  //   async function checkForDrafts() {
  //     const pg2 = await AsyncStorage.getItem("page2");
  //     console.log("page2 ", pg2);
  //     setIsCompletingFetching(true);
  //     setPage2(pg2);
  //   }

  //   checkForDrafts();
  // }, []);

  useEffect(() => {
    // need to submit the data
    console.log("he need to submit data ", needtogonext);
    async function checkForDrafts() {
      setNextLoader(true);
      const pg2 = await AsyncStorage.getItem("page2");
      console.log("hey thsi is pg2 for me before checkig condition ", pg2);
      setNextLoader(false);
      if (pg2) {
        console.log("this is pg2 maetadata for me", pg2);
        navigation.navigate("Records2", {
          page2: pg2,
        });
      } else {
        navigation.navigate("Records2");
      }
    }

    if (needtogonext) {
      console.log("i need to go next..");
      // setneedtogonext(false);

      // call the above async function...
      checkForDrafts();
    }
  }, [needtogonext]);

  useEffect(() => {
    page1 = JSON.parse(page1);
    if (AppCtx.showPage1Draft) {
      // there is no way you show the page1draft and you don't have the page1draft
      // so we can safely assume that page1draft is not null
      console.log("need to show page1draft");
      console.log(
        page1,
        typeof page1,
        page1.page1.ophone,
        typeof page1.page1.ophone
      );
      setOPhoto((prevState) => {
        return {
          ...prevState,
          value: page1.page1.ophoto,
          isValid: true,
        };
      });

      setOphone((prevState) => {
        return {
          ...prevState,
          value: page1.page1.ophone,
          isValid: true,
        };
      });

      setOName((prevState) => {
        return {
          ...prevState,
          value: page1.page1.oname,
          isValid: true,
        };
      });

      setOAge((prevState) => {
        return {
          ...prevState,
          value: page1.page1.oage,
          isValid: true,
        };
      });

      setOGender((prevState) => {
        return {
          ...prevState,
          value: page1.page1.ogender,
          isValid: true,
        };
      });

      setONida((prevState) => {
        return {
          ...prevState,
          value: page1.page1.onida,
          isValid: true,
        };
      });

      // console.log("ophone ", ophone);

      // at the end it set showPageDraft to false why...? hata hapa put isvalid true since it back to its initial point
    } else if (!AppCtx.showPage1Draft) {
      console.log("no need to show page1draft ", AppCtx.showPage1Draft);
      setOPhoto((prevState) => {
        return {
          ...prevState,
          value: undefined,
          isValid: true,
        };
      });

      setOphone((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });

      setOName((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });

      setOAge((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });

      setOGender((prevState) => {
        return {
          ...prevState,
          value: "MALE",
          isValid: true,
        };
      });

      setONida((prevState) => {
        return {
          ...prevState,
          value: "",
          isValid: true,
        };
      });
    }
  }, [AppCtx.showPage1Draft]);

  useEffect(() => {
    return () => {
      // cleanup
      AppCtx.cleanShowPage1Draft();
      AppCtx.defaultingPage1Icon();
    };
  }, []);

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
    AsyncStorage.setItem("page1", JSON.stringify(metadata));
    AppCtx.manipulateAddedDataRecord(metadata);

    setNextLoader(false);
    setneedtogonext((prevState) => prevState + 1);
    // console.log("this is page2 maetadata ", page2);
    // page2
    //   ? navigation.navigate("Records2")
    //   : navigation.navigate("Records2", {
    //       page2,
    //     });
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
            <Text style={[styles.sub, { fontFamily: "overpass-reg" }]}>
              Farm Owner Details
            </Text>
            <View style={{ marginTop: "2%" }}>
              <ImagePicker2
                isValid={ophoto.isValid}
                imageUrl={
                  AppCtx.showPage1Draft
                    ? JSON.parse(page1).page1.ophoto.assets[0].uri
                    : undefined
                }
                isDrafted={AppCtx.showPage1Draft}
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
                label="Enter Full name"
                placeholder="Enter full name"
                autoCorrect={false}
                mode="outlined"
                value={oname.value}
                style={[styles.tinput]}
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
                label="Enter age"
                placeholder="Enter age"
                mode="outlined"
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
                        activeOutlineColor={
                          ogender.isValid ? "black" : "#EF233C"
                        }
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
                label="Enter NIDA number"
                mode="outlined"
                placeholder="Enter NIDA number"
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
                label="Enter phone number"
                mode="outlined"
                maxLength={10}
                placeholder="Enter phone number"
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
            <View style={{ marginVertical: "5%" }}>
              <Button
                mode="contained"
                style={{ backgroundColor: "#55A630" }}
                onPress={goToNextScreen}
              >
                Next
              </Button>
            </View>
            <View style={{ height: 80 }}></View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default FarmerDetails;

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
