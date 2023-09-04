import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import FarmOwnerDetailScreen from "../components/UI/Records/Odetails";
import FarmOwnerRedidenceScreen from "../components/UI/Records/Oresidence";
import RecordsInfoThirdScreen from "../components/UI/Records/OwnerPage3";
import RecordsInfoLastPage from "../components/UI/Records/OwnerPage4";
import { createRecords, fetchDistricts, fetchRegions } from "../utils/requests";
import { AppContext } from "../store/context";
import { TransparentPopUpIconMessage } from "../components/Message";

// https://youtu.be/QLR2UZKe6iE
function AddRecord({ route, navigation }) {
  const { infoId } = route.params ? route.params : { infoId: undefined };

  const myAppCtx = useContext(AppContext);
  const sviewRef = useRef();
  // here disappear in iOS was "block" but android refused that's why we put `{Platform.OS === "ios" ? "block" : "flex"}`
  const [disappear, setDisappear] = useState(
    `${Platform.OS === "ios" ? "block" : "flex"}`
  );
  const [oresidenceDisappear, setOresidenceDisappear] = useState("none");
  const [thirdPageDisplay, setThirdPageDisplay] = useState("none");
  const [lastPageDisplay, setLastPageDisplay] = useState("none");

  const [fetchedRegions, setFetchedRegions] = useState([]);
  const [fetchedDistricts, setFetchedDistricts] = useState([]);
  const [displaySpinner, setDisplaySpinner] = useState(false);

  const [enabled, setEnabled] = useState(false);
  const [focusedElem, setFocusedElem] = useState(0);

  const [showAnimation, setShowAnimation] = useState(false);

  const [submitRecordLoader, setSubmitRecordLoader] = useState(false);
  // first page
  const [firstPageMetadata, setFirstPageMetadata] = useState({
    oname: "",
    oage: "",
    ogender: "",
    onida: "",
    ophoto: undefined,
    ophone: "",
  });

  // second page metadata
  const [secondPageMetadata, setSecondPageMetadata] = useState({
    oregion: "",
    odistrict: "",
    oward: "",
    fmarital: "",
    fmchildren: "",
    fmwives: "",
    fmlivestock: "",
    fmhouse: "",
  });

  // third page
  const [thirdPageMetadata, setThirdPageMetadata] = useState({
    nkname: "",
    nkage: "",
    nkgender: "",
    nkphone: "",
    nknida: "",
    farmregion: "",
    farmdistrict: "",
    farmward: "",
  });

  // forth page
  const [forthPageMetadata, setForthPageMetadata] = useState({
    currentuse: "",
    currentcrop: "",
    averageyield: "",
    addedcoords: [],
  });

  const [weNeedToSubmitData, setWeNeedToSubmitData] = useState(false);

  const [dataToUpdate, setDataToUpdate] = useState();

  useEffect(() => {
    if (
      weNeedToSubmitData &&
      forthPageMetadata.addedcoords.length > 0 &&
      forthPageMetadata.currentuse.trim().length > 0
    ) {
      setSubmitRecordLoader(true);

      // submit the record..
      console.log("now you should post your data to the api.. ");
      const formData = new FormData();
      formData.append("id", myAppCtx.usermetadata.user_id);
      formData.append("oname", firstPageMetadata.oname);
      formData.append("oage", firstPageMetadata.oage);
      formData.append("ogender", firstPageMetadata.ogender);
      formData.append("onida", firstPageMetadata.onida);
      let uri_splited = firstPageMetadata.ophoto.assets[0].uri.split(".");
      let file_type = uri_splited[uri_splited.length - 1];
      if (Platform.OS === "ios") {
        formData.append("ophoto", {
          uri: firstPageMetadata.ophoto.assets[0].uri,
          name: firstPageMetadata.ophoto.assets[0].fileName
            ? firstPageMetadata.ophoto.assets[0].fileName
            : "new_file." + file_type,
          type: firstPageMetadata.ophoto.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = firstPageMetadata.ophoto.assets[0].uri;
        if (uri[0] === "/") {
          uri = `file://${firstPageMetadata.ophoto.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        formData.append("ophoto", {
          uri: uri,
          name: "photo." + file_type,
          type: `image/${file_type}`,
        });
      }
      formData.append("ophone", firstPageMetadata.ophone);

      formData.append("oregion", secondPageMetadata.oregion);
      formData.append("odistrict", secondPageMetadata.odistrict);
      formData.append("oward", secondPageMetadata.oward);
      formData.append("fdmarital", secondPageMetadata.fmarital);
      formData.append("fdchild", secondPageMetadata.fmchildren);
      formData.append("fdwives", secondPageMetadata.fmwives);
      formData.append("fdlivestock", secondPageMetadata.fmlivestock);
      formData.append("fdhouse", secondPageMetadata.fmhouse);

      formData.append("nkname", thirdPageMetadata.nkname);
      formData.append("nkage", thirdPageMetadata.nkage);
      formData.append("nkgender", thirdPageMetadata.nkgender);
      formData.append("nkphone", thirdPageMetadata.nkphone);
      formData.append("nknida", thirdPageMetadata.nknida);
      formData.append("fmregion", thirdPageMetadata.farmregion);
      formData.append("fmdistrict", thirdPageMetadata.farmdistrict);
      formData.append("fmward", thirdPageMetadata.farmward);

      formData.append("currentuse", forthPageMetadata.currentuse);
      formData.append("currentcrop", forthPageMetadata.currentcrop);
      formData.append("averageyield", forthPageMetadata.averageyield);
      formData.append("coords", JSON.stringify(forthPageMetadata.addedcoords));

      createRecords(formData, {
        "Content-Type": "multipart/form-data",
      })
        .then((data) => {
          console.log("data ", data);
          // you receive back the full added record.. push it to the context..

          myAppCtx.manipulateGatheredData({
            flag: "CREATE",
            data: [data],
          });
          setTimeout(() => {
            setSubmitRecordLoader(false);
            navigation.navigate("Index");
          }, 1000);
          setShowAnimation(false);
        })
        .catch((err) => {
          console.log(err);
          setSubmitRecordLoader(false);
        });
    }
  }, [forthPageMetadata, weNeedToSubmitData]);

  function addRecordHandler() {
    // check if the user has filled all the fields
    setSubmitRecordLoader(true);
    setWeNeedToSubmitData(true);
  }

  function onFocusHandler(id) {
    setFocusedElem(id);
  }

  useEffect(() => {
    // fetch the regions and districts
    setDisplaySpinner(true);
    fetchRegions()
      .then((data) => {
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
        setDisplaySpinner(false);
      })
      .catch((err) => {
        console.log(err);
        setDisplaySpinner(true);
      });
  }, []);

  useEffect(() => {
    // keyboard listeners
    if (Platform.OS === "ios") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          // console.log("keyboard shown ", focusedElem);
          if (focusedElem < 3) {
            setEnabled(false);
          } else {
            // console.log("i set enabled to true..");
            setEnabled(true);
            sviewRef.current.scrollToEnd({ animated: true });
          }
        }
      );

      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",

        () => {
          // console.log("keyboard hidden");
          setEnabled(false);
          // hii niliitoa
          sviewRef.current.scrollToEnd({ animated: true });
        }
      );

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }
  }, [enabled, focusedElem]);

  useEffect(() => {
    if (infoId) {
      myAppCtx.gatheredData.forEach((data) => {
        if (+data.id === +infoId) {
          setDataToUpdate(data);
        }
      });
    }
  }, [infoId, myAppCtx.gatheredData]);

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      contentContainerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
      enabled={Platform.OS === "android" ? true : enabled}
      pointerEvents={submitRecordLoader ? "none" : "auto"}
    >
      {submitRecordLoader && (
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
            messageHeader="Record Saved"
            icon="check"
            inProcess={showAnimation}
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={sviewRef}
        style={styles.container}
      >
        <FarmOwnerDetailScreen
          disappear={disappear}
          focusHandler={onFocusHandler}
          nextHandler={() => {
            setDisappear("none");
            setOresidenceDisappear(
              `${Platform.OS === "ios" ? "block" : "flex"}`
            );
          }}
          needupdate={infoId && dataToUpdate}
          accessmetadata={setFirstPageMetadata}
        />
        <FarmOwnerRedidenceScreen
          regions={fetchedRegions}
          districts={fetchedDistricts}
          needupdate={infoId && dataToUpdate}
          focusHandler={onFocusHandler}
          disappear={oresidenceDisappear}
          accessmetadata={setSecondPageMetadata}
          prevHandler={() => {
            setDisappear(`${Platform.OS === "ios" ? "block" : "flex"}`);
            setOresidenceDisappear("none");
          }}
          nextHandler={() => {
            setOresidenceDisappear("none");
            setThirdPageDisplay(`${Platform.OS === "ios" ? "block" : "flex"}`);
          }}
        />
        <RecordsInfoThirdScreen
          regions={fetchedRegions}
          needupdate={infoId && dataToUpdate}
          districts={fetchedDistricts}
          accessmetadata={setThirdPageMetadata}
          disappear={thirdPageDisplay}
          focusHandler={onFocusHandler}
          prevHandler={() => {
            setOresidenceDisappear(
              `${Platform.OS === "ios" ? "block" : "flex"}`
            );
            setThirdPageDisplay("none");
          }}
          nextHandler={() => {
            setThirdPageDisplay("none");
            setLastPageDisplay(`${Platform.OS === "ios" ? "block" : "flex"}`);
          }}
        />
        <RecordsInfoLastPage
          focusHandler={onFocusHandler}
          disappear={lastPageDisplay}
          needupdate={infoId && dataToUpdate}
          prevHandler={() => {
            setThirdPageDisplay(`${Platform.OS === "ios" ? "block" : "flex"}`);
            setLastPageDisplay("none");
          }}
          loading={submitRecordLoader}
          finishHandler={addRecordHandler}
          accessmetadata={setForthPageMetadata}
        />

        <View style={{ height: 30 }}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AddRecord;

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
