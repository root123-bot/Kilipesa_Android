import { createContext, useEffect, useState } from "react";
import { domain } from "../constants/domain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import {
  createRecords,
  fetchGathermanProfile,
  fetchInfosByGatherman,
  updateRecords,
} from "../utils/requests";
import { Platform } from "expo-modules-core";

export const AppContext = createContext({
  usermetadata: {},
  manipulateUserData: (metadata) => {},
  gathermanInfo: {},
  manipulateGathermanInfo: (metadata) => {},
  gatheredData: [],
  manipulateGatheredData: (metadata) => {},
  logout: () => {},
  initialLoading: true,
  stillFetcthingGatheredInfo: true,
  authenticate: (tk) => {},
  addedDataRecord: {
    page1: {},
    page2: {},
    page3: {},
    page4: {},
  },
  manipulateAddedDataRecord: (metadata) => {},
  alreadySubmitTheRecord: false,
  alterAlreadySubmitted: () => {},
  updateDataRecord: {
    page1: {},
    page2: {},
    page3: {},
    page4: {},
  },
  manipulateUpdateDataRecord: (metadata) => {},
  showPage1Draft: false,
  showPage2Draft: false,
  showPage3Draft: false,
  showPage4Draft: false,
  alterShowPage1Draft: () => {},
  alterShowPage2Draft: () => {},
  alterShowPage3Draft: () => {},
  alterShowPage4Draft: () => {},
  cleanShowPage1Draft: () => {},
  cleanShowPage2Draft: () => {},
  cleanShowPage3Draft: () => {},
  cleanShowPage4Draft: () => {},

  page1Icon: "cloud-download-outline",
  alterPage1Icon: () => {},
  defaultingPage1Icon: () => {},

  page2Icon: "cloud-download-outline",
  alterPage2Icon: () => {},
  defaultingPage2Icon: () => {},

  page3Icon: "cloud-download-outline",
  alterPage3Icon: () => {},
  defaultingPage3Icon: () => {},

  page4Icon: "cloud-download-outline",
  alterPage4Icon: () => {},
  defaultingPage4Icon: () => {},
});

function AppContextProvider({ children }) {
  const [userData, setUserData] = useState({});
  const [gathermanBio, setGathermanBio] = useState({});
  const [gatheredInfos, setGatheredInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alreadySubmitTheRecord, setAlreadySubmitTheRecord] = useState(false);
  const [stillFetcthingGatheredInfo, setStillFetcthingGatheredInfo] =
    useState(true);

  const [showPage1Draft, setShowPage1Draft] = useState(false);
  const [showPage2Draft, setShowPage2Draft] = useState(false);
  const [showPage3Draft, setShowPage3Draft] = useState(false);
  const [showPage4Draft, setShowPage4Draft] = useState(false);

  const [page1Icon, setPage1Icon] = useState("cloud-download-outline");
  const [page2Icon, setPage2Icon] = useState("cloud-download-outline");
  const [page3Icon, setPage3Icon] = useState("cloud-download-outline");
  const [page4Icon, setPage4Icon] = useState("cloud-download-outline");

  const [addedDataRecord, setAddedDataRecord] = useState({
    page1: {},
    page2: {},
    page3: {},
    page4: {},
  });

  const [updateDataRecord, setUpdateDataRecord] = useState({
    page1: {},
    page2: {},
    page3: {},
    page4: {},
  });

  // page 1 logics
  function alterPage1Icon() {
    if (page1Icon === "cloud-download-outline") {
      setPage1Icon("cloud-offline-outline");
    } else {
      setPage1Icon("cloud-download-outline");
    }
  }

  function defaultingPage1Icon() {
    setPage1Icon("cloud-download-outline");
  }

  // page 2 logics
  function alterPage2Icon() {
    if (page2Icon === "cloud-download-outline") {
      setPage2Icon("cloud-offline-outline");
    } else {
      setPage2Icon("cloud-download-outline");
    }
  }

  function defaultingPage2Icon() {
    setPage2Icon("cloud-download-outline");
  }

  // page 3 logics
  function alterPage3Icon() {
    if (page3Icon === "cloud-download-outline") {
      setPage3Icon("cloud-offline-outline");
    } else {
      setPage3Icon("cloud-download-outline");
    }
  }

  function defaultingPage3Icon() {
    setPage3Icon("cloud-download-outline");
  }

  // page 4 logics
  function alterPage4Icon() {
    if (page4Icon === "cloud-download-outline") {
      setPage4Icon("cloud-offline-outline");
    } else {
      setPage4Icon("cloud-download-outline");
    }
  }

  function defaultingPage4Icon() {
    setPage4Icon("cloud-offline-outline");
  }

  // end of page4 logics

  function manipulateAlreadySubmitted() {
    setAlreadySubmitTheRecord(false);
  }

  // sizani kama huyu jamaa ana-store token hasahasa mtu akilogin.. sizani
  // nahisi a-store coz inamwanzia kwenye "Get Started" screen wakati mtu
  // alisha-login mwanzo..... KWELI BWANA KAMA UNAVYOONA HII INA-GETITEM ko
  // kwa mtu ambaye amelogin haito-store token so let's store it here..
  async function executeUserMetadata(tk) {
    console.log("executing user metadata");
    let token = !tk ? await AsyncStorage.getItem("token") : tk;
    tk && (await AsyncStorage.setItem("token", tk)); // hii line ni ya kustore token..

    console.log("token ", token, typeof token);
    /* if user does not have token in our storage we have sth like this " LOG  token  {"email":["This field is required."],"password":["This field is required."]} which is string.."
    i think it saves this kind of data if we logout the user... */
    const checkValidToken = token ? JSON.parse(token) : null;
    let user_status;
    let user_id;
    if (checkValidToken && checkValidToken.access) {
      token = JSON.parse(token);
      user_id =
        Object.keys(token).length > 0 && jwt_decode(token.access).user_id;
      fetch(`${domain}/api/user_status/`, {
        method: "POST",
        body: JSON.stringify({
          id: user_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          user_status = data.status;
          setUserData((prevState) => {
            return { ...prevState, token, user_id, user_status };
          });

          // fetch tena and update the gatherman_bio
          fetchGathermanProfile(user_id)
            .then((data) => {
              setGathermanBio(data);
              console.log("done fetching 1");
            })
            .catch((err) =>
              console.log(
                "Failed to fetch gatherman data/profile from DB ",
                err
              )
            );

          // fetch infos gathered by this gatherman...
          fetchInfosByGatherman(user_id)
            .then((data) => {
              {
                /* THIS SHOULD ONLY BE CALLED WHEN ITS THE FIRST TIME WE OPEN/EXECUTE OUR APP
               IN SOME CASE IF YOU SEE DUPLICATES DATA IN OUR CONTEXT FOR GATHER INFO JUST
               REMOVE THAT SPREADING OPERATOR SINCE THERE IS NO WAY WE WANT TO UPDATE THE
               DATA FROM THE EXISTING DATA.. HI [...prevState, ...data] haina maana just
               do setGatherman(data)
              */
              }
              setGatheredInfos(data.reverse());
              console.log("done fetching 2");
              setStillFetcthingGatheredInfo(false);
            })
            .catch((err) => {
              console.log(
                "Failed to fetch data gathered by this gatherman from DB ",
                err
              );
              setStillFetcthingGatheredInfo(false);
            });
        })
        .catch((err) => {
          console.log("error ", err);
        });
    } else {
      // there is no way to have token stored in localstorage
      setLoading(false);
      console.log("there is no token");
    }
  }

  useEffect(() => {
    executeUserMetadata();
  }, []);

  function alterShowPage1Draft() {
    setShowPage1Draft((prevState) => !prevState);
  }

  function alterShowPage2Draft() {
    setShowPage2Draft((prevState) => !prevState);
  }

  function alterShowPage3Draft() {
    setShowPage3Draft((prevState) => !prevState);
  }

  function alterShowPage4Draft() {
    setShowPage4Draft((prevState) => !prevState);
  }

  function cleanShowPage1Draft() {
    setShowPage1Draft(false);
  }

  function cleanShowPage2Draft() {
    setShowPage2Draft(false);
  }

  function cleanShowPage3Draft() {
    setShowPage3Draft(false);
  }

  function cleanShowPage4Draft() {
    setShowPage4Draft(false);
  }

  function manipulateUpdatedDataRecord(metadata) {
    // console.log("i receive this in manipulate data record ", metadata);
    setUpdateDataRecord((prevState) => {
      return { ...prevState, ...metadata };
    });

    if (metadata.status === "Save record") {
      console.log("added data to submit  ", updateDataRecord);

      const formData = new FormData();
      // first metadata data
      formData.append("id", userData.user_id);
      formData.append("oname", updateDataRecord.page1.oname);
      formData.append("oage", updateDataRecord.page1.oage);
      formData.append("ogender", updateDataRecord.page1.ogender);
      formData.append("onida", updateDataRecord.page1.onida);

      // hatutatuma ophoto if the user has not changed it
      if (updateDataRecord.page1.ophoto !== "Use Old") {
        let uri_splited =
          updateDataRecord.page1.ophoto.assets[0].uri.split(".");
        let file_type = uri_splited[uri_splited.length - 1];

        if (Platform.OS === "ios") {
          formData.append("ophoto", {
            uri: updateDataRecord.page1.ophoto.assets[0].uri,
            name: updateDataRecord.page1.ophoto.assets[0].fileName
              ? updateDataRecord.page1.ophoto.assets[0].fileName
              : "new_file." + file_type,
            type: updateDataRecord.page1.ophoto.assets[0].type,
          });
        } else if (Platform.OS === "android") {
          let uri = updateDataRecord.page1.ophoto.assets[0].uri;
          if (uri[0] === "/") {
            uri = `file://${updateDataRecord.page1.ophoto.assets[0].uri}`;
            uri = uri.replace(/%/g, "%25");
          }
          formData.append("ophoto", {
            uri: uri,
            name: "photo." + file_type,
            type: `image/${file_type}`,
          });
        }
      }

      formData.append("ophone", updateDataRecord.page1.ophone);

      // second metadata data..
      formData.append("oregion", updateDataRecord.page2.oregion);
      formData.append("odistrict", updateDataRecord.page2.odistrict);
      formData.append("oward", updateDataRecord.page2.oward);
      formData.append("fdmarital", updateDataRecord.page2.fmarital);
      formData.append("fdchild", updateDataRecord.page2.fmchildren);
      formData.append("fdwives", updateDataRecord.page2.fmwives);
      formData.append("fdlivestock", updateDataRecord.page2.fmlivestock);
      formData.append("fdhouse", updateDataRecord.page2.fmhouse);

      // third metadata data
      formData.append("nkname", updateDataRecord.page3.nkname);
      formData.append("nkage", updateDataRecord.page3.nkage);
      formData.append("nkgender", updateDataRecord.page3.nkgender);
      formData.append("nkphone", updateDataRecord.page3.nkphone);
      formData.append("nknida", updateDataRecord.page3.nknida);
      formData.append("fmregion", updateDataRecord.page3.farmregion);
      formData.append("fmdistrict", updateDataRecord.page3.farmdistrict);
      formData.append("fmward", updateDataRecord.page3.farmward);

      // fourth metadata data
      formData.append("record_id", metadata.page4.record_id);
      formData.append("currentuse", metadata.page4.current_use);
      formData.append("currentcrop", metadata.page4.current_crop);
      formData.append("averageyield", metadata.page4.average_yield);
      formData.append("coords", JSON.stringify(metadata.page4.coordinates));
      console.log(
        "thsi is what is receive as coordnates ",
        metadata.page4.coordinates
      );
      console.log("this is the form data ", formData);

      updateRecords(formData, {
        "Content-Type": "multipart/form-data",
      })
        .then((data) => {
          console.log("this is data response after updating the data..", data);

          manipulateGatheredData({
            flag: "UPDATE",
            data: [data],
          });
          // navigation.navigate("Index");
          setAlreadySubmitTheRecord(true);
        })
        .catch((err) => {
          console.log("error ", err);
        });
    }
  }

  // holds the records of data added...
  function manipulateAddedDataRecord(metadata) {
    console.log("i receive this ", metadata);
    setAddedDataRecord((prevState) => {
      return { ...prevState, ...metadata };
    });

    if (metadata.status === "Save record") {
      console.log("added data to submit  ", addedDataRecord);

      const formData = new FormData();
      // first metadata data
      formData.append("id", userData.user_id);
      formData.append("oname", addedDataRecord.page1.oname);
      formData.append("oage", addedDataRecord.page1.oage);
      formData.append("ogender", addedDataRecord.page1.ogender);
      formData.append("onida", addedDataRecord.page1.onida);

      let uri_splited = addedDataRecord.page1.ophoto.assets[0].uri.split(".");
      let file_type = uri_splited[uri_splited.length - 1];
      if (Platform.OS === "ios") {
        formData.append("ophoto", {
          uri: addedDataRecord.page1.ophoto.assets[0].uri,
          name: addedDataRecord.page1.ophoto.assets[0].fileName
            ? addedDataRecord.page1.ophoto.assets[0].fileName
            : "new_file." + file_type,
          type: addedDataRecord.page1.ophoto.assets[0].type,
        });
      } else if (Platform.OS === "android") {
        let uri = addedDataRecord.page1.ophoto.assets[0].uri;
        if (uri[0] === "/") {
          uri = `file://${addedDataRecord.page1.ophoto.assets[0].uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        formData.append("ophoto", {
          uri: uri,
          name: "photo." + file_type,
          type: `image/${file_type}`,
        });
      }

      formData.append("ophone", addedDataRecord.page1.ophone);

      // second metadata data..
      formData.append("oregion", addedDataRecord.page2.oregion);
      formData.append("odistrict", addedDataRecord.page2.odistrict);
      formData.append("oward", addedDataRecord.page2.oward);
      formData.append("fdmarital", addedDataRecord.page2.fmarital);
      formData.append("fdchild", addedDataRecord.page2.fmchildren);
      formData.append("fdwives", addedDataRecord.page2.fmwives);
      formData.append("fdlivestock", addedDataRecord.page2.fmlivestock);
      formData.append("fdhouse", addedDataRecord.page2.fmhouse);

      // third metadata data
      formData.append("nkname", addedDataRecord.page3.nkname);
      formData.append("nkage", addedDataRecord.page3.nkage);
      formData.append("nkgender", addedDataRecord.page3.nkgender);
      formData.append("nkphone", addedDataRecord.page3.nkphone);
      formData.append("nknida", addedDataRecord.page3.nknida);
      formData.append("fmregion", addedDataRecord.page3.farmregion);
      formData.append("fmdistrict", addedDataRecord.page3.farmdistrict);
      formData.append("fmward", addedDataRecord.page3.farmward);

      // fourth metadata data
      formData.append("currentuse", metadata.page4.current_use);
      formData.append("currentcrop", metadata.page4.current_crop);
      formData.append("averageyield", metadata.page4.average_yield);
      formData.append("coords", JSON.stringify(metadata.page4.coordinates));
      // console.log("our coords to add ", metadata.page4.coordinates);
      // console.log("this is the form data ", JSON.stringify(formData));

      createRecords(formData, {
        "Content-Type": "multipart/form-data",
      })
        .then((data) => {
          console.log("this is data ", data);
          manipulateGatheredData({
            flag: "CREATE",
            data: [data],
          });
          // navigation.navigate("Index");
          // i need to delete all the data stored in the context and in the local storage..
          setAddedDataRecord({
            page1: {},
            page2: {},
            page3: {},
            page4: {},
          });

          // now i can clear all these data in my local storage
          AsyncStorage.removeItem("page1");
          AsyncStorage.removeItem("page2");
          AsyncStorage.removeItem("page3");
          AsyncStorage.removeItem("page4");

          setAlreadySubmitTheRecord(true);
        })
        .catch((err) => {
          console.log("error ", err);
        });
    }
  }

  function authenticateUser(tk) {
    executeUserMetadata(tk);
  }

  function logoutCurrentUser() {
    setUserData({});
    setGathermanBio({});
    setGatheredInfos([]);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("page1");
    AsyncStorage.removeItem("page2");
    AsyncStorage.removeItem("page3");
    AsyncStorage.removeItem("page4");
    console.log("i am logging out ", userData);
  }

  {
    /*  evertime you should send your information in object with key value pair
    for example to add token you should send {token: ${token}}
    to add user_id you should send {user_id: ${user_id}}
    to add user_status send {user_status: ${user_status}}
    so the userdata contains keys of "token", "user_id", "user_status" and their values

*/
  }

  function manipulateUserData(metadata) {
    setUserData((prevState) => {
      return { ...prevState, ...metadata };
    });
  }

  function manipulateGathermanInfo(metadata) {
    setGathermanBio((prevState) => {
      return { ...prevState, ...metadata };
    });
  }

  function manipulateGatheredData(metadata) {
    {
      /*we have to update the info gathered by this gatherma if in these two condition
      1. You've added new record
      2. You've updated the existing record
    
    In adding new record we need to receive "flag" of "Create" by using this we
    don't need to check if the record exist since its new one so we should add it 
    directly since there is no way to for it to exist and remember we receive one 
    instance/object so its easy to track its id in case we update existing one..
    On update the existing data we should receive "flag" of "Update" and in this 
    condition we should first get the id of incoming metadata to replace the existing 
    one don't forget to have this logics on add or update new records.. so in each condition
    the incoming data should have this format {"flag", "data": {}}*/
    }
    if (metadata.flag === "CREATE") {
      setGatheredInfos((prevState) => [...metadata.data, ...prevState]);
      manipulateGathermanInfo({
        recordsaddedtoday: +gathermanBio.recordsaddedtoday + 1,
        number_of_records: +gathermanBio.number_of_records + 1,
      });
    }

    if (metadata.flag === "UPDATE") {
      setGatheredInfos((prevState) => {
        const existingDataIndex = prevState.find(
          (item) => +item.id === +metadata.data.id
        );

        if (existingDataIndex !== -1) {
          prevState.splice(existingDataIndex, 1);
          return [...metadata.data, ...prevState];
        }

        console.log(
          "there is no way we edit the record which does not exist in our context/data.. makesure you update you're context any time you add new record.."
        );
      });
    }
  }

  const value = {
    usermetadata: userData,
    gathermanInfo: gathermanBio,
    gatheredData: gatheredInfos,
    initialLoading: loading,
    manipulateUserData,
    manipulateGathermanInfo,
    manipulateGatheredData,
    logout: logoutCurrentUser,
    authenticate: authenticateUser,
    stillFetcthingGatheredInfo,
    addedDataRecord,
    manipulateAddedDataRecord,
    alreadySubmitTheRecord,
    alterAlreadySubmitted: manipulateAlreadySubmitted,
    updateDataRecord,
    manipulateUpdatedDataRecord: manipulateUpdatedDataRecord,
    showPage1Draft,
    showPage2Draft,
    showPage3Draft,
    showPage4Draft,
    alterShowPage1Draft,
    alterShowPage2Draft,
    alterShowPage3Draft,
    alterShowPage4Draft,
    cleanShowPage1Draft,
    cleanShowPage2Draft,
    cleanShowPage3Draft,
    cleanShowPage4Draft,
    page1Icon,
    alterPage1Icon,
    defaultingPage1Icon,
    page2Icon,
    alterPage2Icon,
    defaultingPage2Icon,
    page3Icon,
    alterPage3Icon,
    defaultingPage3Icon,
    page4Icon,
    alterPage4Icon,
    defaultingPage4Icon,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
