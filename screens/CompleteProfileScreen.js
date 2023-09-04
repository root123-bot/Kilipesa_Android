// This mobile app is only intended to be used by Gatherman..
// in some cases KeyboardAvoidingView is not working https://youtu.be/xZIypoRc4CU
// dropdown like the one of native https://www.npmjs.com/package/react-native-date-picker
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState, useLayoutEffect, useContext, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import {
  completeGathermanProfile,
  editGathermanProfile,
  fetchDistricts,
  fetchRegions,
} from "../utils/requests";
import ImagePicker from "../components/ImagePicker";
import { StatusBar } from "expo-status-bar";
import DocumentPicker from "../components/DocumentPicker";
import { Icon } from "@muratoner/semantic-ui-react-native";
import { TransparentPopUpIconMessage } from "../components/Message";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../store/context";
import ImagePicker3 from "../components/ImagePicker3";

// hii imenisaidia jinsi ya ku-upload "file" in android devices If the solution given by @Anandhu doesn't work then try the above code like this.
// https://stackoverflow.com/questions/65542645/file-upload-from-react-native-expo-to-node-multer
function CompleteProfile({ editprofile }) {
  const myAppCtx = useContext(AppContext);
  const navigation = useNavigation();

  const [pickedRegion, setPickedRegion] = useState({
    value: "",
    isValid: true,
  });
  const [pickedDistrict, setPickedDistrict] = useState({
    value: editprofile
      ? myAppCtx.gathermanInfo.location.split(", ")[1].trim()
      : "",
    isValid: true,
  });
  const [regionDistricts, setRegionsDistricts] = useState([]);
  const [educationLevel, setEducationLevel] = useState({
    value: "",
    isValid: true,
  });
  const [pickedImage, setPickedImage] = useState({
    value: editprofile ? "Use Old" : undefined,
    isValid: true,
  });
  const [pickedCertificate, setPickedCertificate] = useState({
    value: undefined,
    isValid: true,
  });
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [fetchedRegions, setFetchedRegions] = useState([]);
  const [fetchedDistricts, setFetchedDistricts] = useState([]);
  const [togglePicker, setTogglePicker] = useState("none");
  const [toggleDistrictPicker, setDistrictTogglePicker] = useState("none");
  const [toggleEducationLevel, setToggleEducationLevel] = useState("none");
  const [displaySpinner, setDisplaySpinner] = useState(true);
  const [educationIcon, setEducationIcon] = useState("chevron-down");
  const [regionIcon, setRegionIcon] = useState("chevron-down");
  const [districtIcon, setDistrictIcon] = useState("chevron-down");
  const [documentType, setDocumentType] = useState();

  const [fname, setFname] = useState({
    value: editprofile
      ? myAppCtx.gathermanInfo.full_name.split(" ")[0].trim().toUpperCase()
      : "",
    isValid: true,
  });
  const [lname, setLname] = useState({
    value: editprofile
      ? myAppCtx.gathermanInfo.full_name.split(" ")[1].trim().toUpperCase()
      : "",
    isValid: true,
  });
  const [phone, setPhone] = useState({
    value: editprofile ? myAppCtx.gathermanInfo.phone : "",
    isValid: true,
  });
  const [ward, setWard] = useState({
    value: editprofile ? myAppCtx.gathermanInfo.ward.toUpperCase() : "",
    isValid: true,
  });

  const [showAnimation, setShowAnimation] = useState(false);

  useLayoutEffect(() => {
    setDisplaySpinner(true);
    fetchRegions()
      .then((data) => {
        Platform.OS === "android" &&
          setPickedRegion((prevState) => {
            return {
              ...prevState,
              value: data[0].name,
            };
          });
        setFetchedRegions(data);
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
          setPickedDistrict((prevState) => {
            return {
              ...prevState,
              value: data[0].name,
            };
          });

        if (Platform.OS === "android") {
          const filteredDistricts = data.filter(
            (district) => district.region === data[0].region
          );

          setRegionsDistricts((prevState) => {
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
    if (editprofile) {
      setPickedRegion((prevState) => {
        return {
          ...prevState,
          value: editprofile
            ? myAppCtx.gathermanInfo.location.split(", ")[0]
            : "",
          isValid: true,
        };
      });
      const filteredDistricts = fetchedDistricts.filter(
        (district) => district.region === pickedRegion.value
      );
      setRegionsDistricts(filteredDistricts);
    }
  }, [editprofile, fetchedDistricts]);

  useEffect(() => {
    if (Platform.OS === "android") {
      setEducationLevel((prevState) => {
        return {
          ...prevState,
          value: "ORDINARY DIPLOMA",
        };
      });
    }
  }, []);

  function editProfile() {
    console.log("im executed..");
    setFormSubmitLoader(true);
    setShowAnimation(true);
    const phoneValid =
      !isNaN(+phone.value) &&
      phone.value.length === 10 &&
      !phone.value.includes("+") &&
      !phone.value.includes("-");

    const fnameValid = fname.value.trim().length > 0;
    const lnameValid = lname.value.trim().length > 0;
    const wardValid = ward.value.trim().length > 0;
    const regionValid = pickedRegion.value.trim().length > 0;
    const districtValid = pickedDistrict.value.trim().length > 0;
    const imageValid = pickedImage.value !== undefined;

    console.log("which is invalid ", {
      phoneValid,
      fnameValid,
      lnameValid,
      wardValid,
      regionValid,
      districtValid,
      imageValid,
    });

    if (
      !phoneValid ||
      !fnameValid ||
      !lnameValid ||
      !wardValid ||
      !regionValid ||
      !districtValid ||
      !imageValid
    ) {
      console.log("which is invalid ", {
        phoneValid,
        fnameValid,
        lnameValid,
        wardValid,
        regionValid,
        districtValid,
        imageValid,
      });
      alert("Please fill all the fields");
      setPhone((prevState) => {
        return { ...prevState, isValid: phoneValid };
      });
      setFname((prevState) => {
        return { ...prevState, isValid: fnameValid };
      });
      setLname((prevState) => {
        return { ...prevState, isValid: lnameValid };
      });
      setWard((prevState) => {
        return { ...prevState, isValid: wardValid };
      });
      setPickedRegion((prevState) => {
        return { ...prevState, isValid: regionValid };
      });
      setPickedDistrict((prevState) => {
        return { ...prevState, isValid: districtValid };
      });

      setPickedImage((prevState) => {
        return { ...prevState, isValid: imageValid };
      });

      setFormSubmitLoader(false);
      setShowAnimation(false);
      return;
    }

    const formData = new FormData();
    formData.append("fname", fname.value);
    formData.append("lname", lname.value);
    formData.append("phone", phone.value);
    formData.append("region", pickedRegion.value);
    formData.append("district", pickedDistrict.value);
    formData.append("ward", ward.value);
    formData.append("id", myAppCtx.usermetadata.user_id);

    let uri_splited =
      pickedImage.value !== "Use Old" &&
      pickedImage.value.assets[0].uri.split(".");
    let file_type =
      pickedImage.value !== "Use Old" && uri_splited[uri_splited.length - 1];
    if (pickedImage.value !== "Use Old") {
      if (Platform.OS === "ios") {
        formData.append("profile", {
          uri: pickedImage.value.assets[0].uri,
          name: pickedImage.value.assets[0].fileName
            ? pickedImage.value.assets[0].fileName
            : "new_file." + file_type,
          type: pickedImage.value.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = pickedImage.value.assets[0].uri;
        console.log("image file name ", pickedImage.value.assets[0].fileName);

        if (uri[0] === "/") {
          uri = `file://${pickedImage.value.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        formData.append("profile", {
          uri: uri,
          name: "photo." + file_type,
          type: `image/${file_type}`,
        });
      }
    } else {
      formData.append("profile", "Use Old");
    }

    // send the data to the backend...
    editGathermanProfile(formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((data) => {
        // we receive the new gatheman profile...
        myAppCtx.manipulateGathermanInfo(data);
        setTimeout(() => {
          setFormSubmitLoader(false);
          navigation.goBack();
        }, 1000);
        setShowAnimation(false);
      })
      .catch((err) => {
        console.log("err ", err);
        setFormSubmitLoader(false);
        setShowAnimation(false);
      });
  }

  function submitForm() {
    setFormSubmitLoader(true);
    setShowAnimation(true);
    const phoneValid =
      !isNaN(+phone.value) &&
      phone.value.length === 10 &&
      !phone.value.includes("+") &&
      !phone.value.includes("-");

    const fnameValid = fname.value.trim().length > 0;
    const lnameValid = lname.value.trim().length > 0;
    const wardValid = ward.value.trim().length > 0;
    const regionValid = pickedRegion.value.trim().length > 0;
    const districtValid = pickedDistrict.value.trim().length > 0;
    const educationLevelValid = educationLevel.value.trim().length > 0;
    const imageValid = pickedImage.value !== undefined;
    const certificateValid = pickedCertificate.value !== undefined;

    if (
      !phoneValid ||
      !fnameValid ||
      !lnameValid ||
      !wardValid ||
      !regionValid ||
      !districtValid ||
      !educationLevelValid ||
      !imageValid ||
      !certificateValid
    ) {
      console.log("which is invalid ", {
        phoneValid,
        fnameValid,
        lnameValid,
        wardValid,
        regionValid,
        districtValid,
        imageValid,
        educationLevelValid,
      });
      alert("Please fill all the fields");
      setPhone((prevState) => {
        return { ...prevState, isValid: phoneValid };
      });
      setFname((prevState) => {
        return { ...prevState, isValid: fnameValid };
      });
      setLname((prevState) => {
        return { ...prevState, isValid: lnameValid };
      });
      setWard((prevState) => {
        return { ...prevState, isValid: wardValid };
      });
      setPickedRegion((prevState) => {
        return { ...prevState, isValid: regionValid };
      });
      setPickedDistrict((prevState) => {
        return { ...prevState, isValid: districtValid };
      });
      setEducationLevel((prevState) => {
        return { ...prevState, isValid: educationLevelValid };
      });
      setPickedImage((prevState) => {
        return { ...prevState, isValid: imageValid };
      });
      setPickedCertificate((prevState) => {
        return { ...prevState, isValid: certificateValid };
      });
      setFormSubmitLoader(false);
      setShowAnimation(false);
      return;
    }

    const formData = new FormData();
    formData.append("fname", fname.value);
    formData.append("lname", lname.value);
    formData.append("phone", phone.value);
    formData.append("region", pickedRegion.value);
    formData.append("district", pickedDistrict.value);
    formData.append("ward", ward.value);
    formData.append("education", educationLevel.value);
    formData.append("id", myAppCtx.usermetadata.user_id);
    if (documentType === "file") {
      if (Platform.OS === "ios") {
        formData.append("certificate", {
          uri: pickedCertificate.value.uri,
          name: pickedCertificate.value.name,
          type: "file",
        });
      } else if (Platform.OS === "android") {
        let uri = pickedCertificate.value.uri;
        if (uri[0] === "/") {
          uri = `file://${pickedCertificate.value.uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        let filetype = pickedCertificate.value.name.split(".");
        filetype = filetype[filetype.length - 1];
        formData.append("certificate", {
          uri: uri,
          name: pickedCertificate.value.name,
          type: `application/${filetype}`,
        });
      }
    } else if (documentType === "image") {
      let uri_splited = pickedCertificate.value.assets[0].uri.split(".");
      let file_type = uri_splited[uri_splited.length - 1];

      if (Platform.OS === "ios") {
        formData.append("certificate", {
          uri: pickedCertificate.assets[0].value.uri,
          name: pickedCertificate.value.assets[0].fileName
            ? pickedCertificate.value.assets[0].fileName
            : "new_file." + file_type,
          type: pickedCertificate.value.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = pickedCertificate.value.assets[0].uri;
        console.log(
          "image file name ",
          pickedCertificate.value.assets[0].fileName
        );

        if (uri[0] === "/") {
          uri = `file://${pickedCertificate.value.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }

        formData.append("certificate", {
          uri: uri,
          name: `photo.${file_type}`,
          type: `image/${file_type}`,
        });
      }
    }

    let uri_splited = pickedImage.value.assets[0].uri.split(".");
    let file_type = uri_splited[uri_splited.length - 1];

    if (Platform.OS === "ios") {
      formData.append("profile", {
        uri: pickedImage.value.assets[0].uri,
        name: pickedImage.value.assets[0].fileName
          ? pickedImage.value.assets[0].fileName
          : "new_file." + file_type,
        type: pickedImage.value.assets[0].type,
      });
    } else if (Platform.OS === "android") {
      // HII LINK IMENISAIDIA JINSI YA KU-UPLOAD IMAGES IN ANDROID JUST VIEW THE
      // https://medium.com/@aurelie.lebec/uploading-pictures-and-videos-from-your-phone-in-your-app-with-react-native-expo-cloudinary-and-d3ad4358e81a
      // "file_type" it tells me on how to name type to be `images/${file_type} and otehr
      // stuffs thank you!...
      let uri = pickedImage.value.assets[0].uri;
      console.log("image file name ", pickedImage.value.assets[0].fileName);

      if (uri[0] === "/") {
        uri = `file://${pickedImage.value.assets[0].uri}`;
        uri = uri.replace(/%/g, "%25");
      }
      formData.append("profile", {
        uri: uri,
        name: "photo." + file_type,
        type: `image/${file_type}`,
      });
    }

    // formData.append("profile", null);   eti hii ilikuepo daah...

    // send the data to the backend...
    console.log("i need to send the data to the backend ... ");

    completeGathermanProfile(formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((data) => {
        console.log("data i dont know ", data);
        setTimeout(() => {
          setFormSubmitLoader(false);
          myAppCtx.logout();
          navigation.navigate("UnderReviewScreen", {
            status: "Profile Created",
          });
        }, 1000);

        setShowAnimation(false);
      })
      .catch((err) => {
        console.log("err ", err);
        setFormSubmitLoader(false);
        setShowAnimation(false);
      });
  }

  function profileHandler(image) {
    // console.log("image ", image);
    setPickedImage((prevState) => {
      return { ...prevState, value: image, isValid: true };
    });
  }

  function certificateFileHandler(file) {
    // console.log("file ", file);
    if (file.name === "scanned-document") {
      // then our file is image...
      setDocumentType("image");
      setPickedCertificate((prevState) => {
        return { ...prevState, value: file.response, isValid: true };
      });
    } else if (file.name === "attached-document") {
      setDocumentType("file");
      setPickedCertificate((prevState) => {
        return { ...prevState, value: file.response, isValid: true };
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

  function handleRegionOnChange(itemValue) {
    setPickedRegion((prevState) => {
      return { ...prevState, value: itemValue, isValid: true };
    });

    if (Platform.OS === "ios") {
      setPickedDistrict((prevState) => {
        return { ...prevState, value: "" };
      });
    }

    const filteredDistricts = fetchedDistricts.filter(
      (district) => district.region === itemValue
    );
    setRegionsDistricts(filteredDistricts);

    if (Platform.OS === "android") {
      setPickedDistrict((prevState) => {
        return {
          ...prevState,
          value: filteredDistricts[0].name,
          isValid: true,
        };
      });
    }
  }

  return (
    <>
      <SafeAreaView
        style={styles.container}
        pointerEvents={formSubmitLoader ? "none" : "auto"}
      >
        {formSubmitLoader && (
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
              messageHeader="Profile Saved"
              icon="check"
              inProcess={showAnimation}
            />
          </View>
        )}

        <KeyboardAvoidingView
          style={{ flex: 1, marginTop: 15, marginBottom: 25 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.header}>
              {editprofile ? "Edit Profile" : "Complete Profile"}{" "}
            </Text>
            {formSubmitLoader ? (
              <ActivityIndicator style={styles.header} color="#55A630" />
            ) : (
              <TouchableOpacity
                onPress={editprofile ? editProfile : submitForm}
              >
                <Icon name="add" style={styles.header} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.line}></View>
          <ScrollView
            style={styles.innerContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.up}>Personal Information.</Text>
            <TextInput
              mode="outlined"
              label="First name"
              value={fname.value}
              onChangeText={(text) =>
                setFname((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={fname.isValid ? "black" : "#EF233C"}
              outlineColor={fname.isValid ? "black" : "#EF233C"}
            />
            <TextInput
              mode="outlined"
              label="Last name"
              value={lname.value}
              onChangeText={(text) =>
                setLname((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={lname.isValid ? "black" : "#EF233C"}
              outlineColor={lname.isValid ? "black" : "#EF233C"}
              style={styles.formInput}
            />
            <TextInput
              mode="outlined"
              maxLength={10}
              placeholder="07XXXXXXXX"
              label="Phone number"
              value={phone.value}
              onChangeText={(text) =>
                setPhone((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={phone.isValid ? "black" : "#EF233C"}
              outlineColor={phone.isValid ? "black" : "#EF233C"}
              keyboardType="number-pad"
              style={styles.formInput}
            />
            <Text style={styles.sub}>Residence Information.</Text>

            {/* editable={false} will make the "Keyboard" to not being displayed as you can't edit value of textinput... */}

            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (togglePicker === "none") {
                      setDistrictTogglePicker("none");
                      setToggleEducationLevel("none");
                      setDistrictIcon("chevron-down");
                      setEducationIcon("chevron-down");

                      setTogglePicker("flex");
                      setRegionIcon("chevron-up");
                    } else if (togglePicker === "flex") {
                      setTogglePicker("none");
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
                      activeOutlineColor={
                        pickedRegion.isValid ? "black" : "#EF233C"
                      }
                      outlineColor={pickedRegion.isValid ? "black" : "#EF233C"}
                      value={pickedRegion.value}
                      style={styles.formInput}
                      right={
                        <TextInput.Icon name={districtIcon} icon={regionIcon} />
                      }
                    />
                  </View>
                </Pressable>
                <Picker
                  mode="dropdown"
                  selectedValue={pickedRegion.value}
                  onValueChange={handleRegionOnChange}
                  style={[styles.pickerStyling, { display: togglePicker }]}
                >
                  {fetchedRegions.map((region, index) => {
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
                    selectedValue={pickedRegion.value}
                    onValueChange={handleRegionOnChange}
                    style={[
                      styles.pickerStyling,
                      {
                        display: "flex",
                      },
                    ]}
                  >
                    {fetchedRegions.map((region, index) => {
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
            )}
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (pickedRegion.value === "")
                      return alert("Please select a region first");
                    if (toggleDistrictPicker === "none") {
                      setTogglePicker("none");
                      setToggleEducationLevel("none");
                      // if you toggle them off make sure their icons are in good shape
                      setRegionIcon("chevron-down");
                      setEducationIcon("chevron-down");
                      setDistrictTogglePicker("flex");
                      setDistrictIcon("chevron-up");
                    } else if (toggleDistrictPicker === "flex") {
                      setDistrictTogglePicker("none");
                      setDistrictIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      value={pickedDistrict.value}
                      editable={false}
                      label="District"
                      activeOutlineColor={
                        pickedDistrict.isValid ? "black" : "#EF233C"
                      }
                      outlineColor={
                        pickedDistrict.isValid ? "black" : "#EF233C"
                      }
                      style={styles.formInput}
                      right={
                        <TextInput.Icon
                          name={districtIcon}
                          icon={districtIcon}
                        />
                      }
                    />
                  </View>
                </Pressable>

                <Picker
                  mode="dropdown"
                  selectedValue={pickedDistrict.value}
                  onValueChange={(district) =>
                    setPickedDistrict((prevState) => {
                      return {
                        ...prevState,
                        value: district,
                        isValid: true,
                      };
                    })
                  }
                  style={[
                    styles.pickerStyling,
                    { display: toggleDistrictPicker },
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
                      selectedValue={pickedDistrict.value}
                      onValueChange={(district) =>
                        setPickedDistrict((prevState) => {
                          return {
                            ...prevState,
                            value: district,
                            isValid: true,
                          };
                        })
                      }
                      style={[
                        styles.pickerStyling,
                        {
                          display: "flex",
                        },
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
                  </View>
                </View>
              </>
            )}
            <TextInput
              mode="outlined"
              label="Ward"
              value={ward.value}
              onChangeText={(text) =>
                setWard((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              activeOutlineColor={ward.isValid ? "black" : "#EF233C"}
              outlineColor={ward.isValid ? "black" : "#EF233C"}
              style={styles.formInput}
            />
            {/* !editprofile */}
            {!editprofile && (
              <>
                <Text style={styles.sub}>Other Information.</Text>
                {Platform.OS === "ios" ? (
                  <>
                    <Pressable>
                      <View pointerEvents="none">
                        <TextInput
                          mode="outlined"
                          label="Education Level"
                          value={educationLevel.value}
                          editable={false}
                          activeOutlineColor={
                            educationLevel.isValid ? "black" : "#EF233C"
                          }
                          outlineColor={
                            educationLevel.isValid ? "black" : "#EF233C"
                          }
                          style={styles.formInput}
                          right={
                            <TextInput.Icon
                              onPress={() => {
                                if (toggleEducationLevel === "none") {
                                  setTogglePicker("none");
                                  setDistrictTogglePicker("none");
                                  // if you toggle them off make sure their icons are in good shape
                                  setRegionIcon("chevron-down");
                                  setDistrictIcon("chevron-down");

                                  setToggleEducationLevel("flex");
                                  setEducationIcon("chevron-up");
                                } else if (toggleEducationLevel === "flex") {
                                  setToggleEducationLevel("none");
                                  setEducationIcon("chevron-down");
                                }
                              }}
                              icon={educationIcon}
                            />
                          }
                        />
                      </View>
                    </Pressable>
                    <Picker
                      mode="dropdown"
                      selectedValue={educationLevel.value}
                      onValueChange={(level) =>
                        setEducationLevel((prevState) => {
                          return {
                            ...prevState,
                            value: level,
                            isValid: true,
                          };
                        })
                      }
                      style={[
                        styles.pickerStyling,
                        { display: toggleEducationLevel },
                      ]}
                    >
                      <Picker.Item
                        label="ORDINARY DIPLOMA"
                        value="ORDINARY DIPLOMA"
                      />
                      <Picker.Item
                        label="BACHELOR DEGREE"
                        value="BACHELOR DEGREE"
                      />
                      <Picker.Item
                        label="ADVANCED DIPLOMA"
                        value="ADVANCED DIPLOMA"
                      />
                    </Picker>
                  </>
                ) : (
                  <>
                    <View style={{ marginTop: "2%" }}>
                      <Text style={{ marginLeft: "3%" }}>Education Level</Text>
                      <View
                        style={{
                          borderColor: "black",
                          borderRadius: 5,
                          borderWidth: 1,
                        }}
                      >
                        <Picker
                          mode="dropdown"
                          selectedValue={educationLevel.value}
                          onValueChange={(level) =>
                            setEducationLevel((prevState) => {
                              return {
                                ...prevState,
                                value: level,
                                isValid: true,
                              };
                            })
                          }
                        >
                          <Picker.Item
                            label="ORDINARY DIPLOMA"
                            value="ORDINARY DIPLOMA"
                          />
                          <Picker.Item
                            label="BACHELOR DEGREE"
                            value="BACHELOR DEGREE"
                          />
                          <Picker.Item
                            label="ADVANCED DIPLOMA"
                            value="ADVANCED DIPLOMA"
                          />
                        </Picker>
                      </View>
                    </View>
                  </>
                )}
                <DocumentPicker
                  isValid={pickedCertificate.isValid}
                  fileHandler={certificateFileHandler}
                />
              </>
            )}
            <Text style={styles.sub}>Profile Picture.</Text>
            <ImagePicker3
              isValid={pickedImage.isValid}
              isOnEditing={editprofile}
              imageUrl={
                editprofile ? myAppCtx.gathermanInfo.profile_pic : undefined
              }
              fileHandler={profileHandler}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

export default CompleteProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "97%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  line: {
    borderBottomWidth: 0.2,
    borderBottomColor: "#55A630",
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    fontFamily: "montserrat-17",
    fontSize: 30,
    marginTop: 10,
    color: "#55A630",
  },
  formInput: {
    marginTop: "2%",
  },
  formInputDisabled: {
    marginTop: "2%",
    backgroundColor: "white",
  },
  up: {
    fontFamily: "montserrat-14",
    fontSize: 20,
    marginTop: "2%",
    marginBottom: 0,
  },
  sub: {
    fontFamily: "montserrat-14",
    fontSize: 20,
    marginTop: "7%",
  },
  pickerStyling: {
    display: "none",
  },
});

// 14, 16, 17
