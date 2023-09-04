import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DashboardCard from "../components/UI/DashboardCard";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import DataTable from "../components/UI/DataTable";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@muratoner/semantic-ui-react-native";
import { SearchBar } from "@rneui/themed";
import { AppContext } from "../store/context";
import LoadingSpinner from "../components/UI/Spinner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

function IndexScreen({ navigation }) {
  const myAppCtx = useContext(AppContext);

  const [page1, setPage1] = useState();

  const [needtogonext, setneedtogonext] = useState(0);
  const [loading, setLoading] = useState(false);

  const [stillChecking, setStillChecking] = useState(true);
  const [title, setTitle] = useState(
    `All Records (${myAppCtx.gathermanInfo.number_of_records})`
  );

  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [search, setSearch] = useState("");
  const [datatableMetadata, setDatatableMetadata] = useState([]); // format of this is [ {"date": [{ "data": "xxx", originalData: {}, infoId: "yyy" }], "owner": [ "data": "xxx", originalData: {}, infoId: "yyy" ], "owner": [ "data": "xxx", originalData: {}, "infoId": "yyy" ]} ]

  {
    /* always make sure hooks zinakua juu before your return DOM/UI elements otherwiser u will get the error.. */
  }

  {
    /*
          HIVI NDO JINSI SEARCH ITAKAVYO-WORK...
    HII ITASUMBUA BUT NISHAPATA SOLUTION YAKE KWA KUWA TUSHAFETCH DATA NA TUNAZO IN OUR STATE THEN MTU KILA AKI-JARIBU
    KU-SEARCH SISI TUTAKUWA TUNAENDA KU-FILTER ILE DATA ILIYOKUWA INAFANANA NA SEARCHED TEXT THEN TUNA-RENDER TENA
    KO NOW NISHAJUA LOGIC YA MWANZO ILIKUWA COMPLICATED SANA KO CHAKU-FANYA EVERTYTIME YOU NEED TO DETECT onChange()
    EVENT IN YOUR SEARCH BOX AND WHAT YOU NEED TO DO IS TO GO AND FILTER THE DATA IN YOUR STATE AND RENDER IT AGAIN
    WHICH THEN AFTER FILTER UPDATE THE STATE WHICH THEN SENT TO THE <DataTable /> COMPONENT AND THEN IT WILL RENDER
    ASANTE MUNGU KWA KUNIPA JIBU HII NDO NITATEMBEA NAYO...

    VILEVILE JUA HII NI ON FETCH KWENYE ON CLICK ROW YA TABLE NI SIMPLE TUU TAKE THE 'ID' OF INFO TO NEXT SCREEN..

  */
  }

  useEffect(() => {
    console.log("belachao belachao..");
    async function checkForDrafts() {
      const pg1 = await AsyncStorage.getItem("page1");
      console.log("pag1 ", pg1);
      setPage1(pg1);
      setStillChecking(false);
    }

    checkForDrafts();
  }, []);

  function executeCoreLogics(data) {
    const infos = !data ? myAppCtx.gatheredData : data;
    // console.log("infos ", infos.get_owner_info);
    const datatableMt = [];
    const datemetadata = [];
    // compute datatable metadata, having format of {"date": [{ "data": "xxx", originalData: {}, infoId: "yyy" }], "owner": [ "data": "xxx", originalData: {}, infoId: "yyy" ], "location": [ "data": "xxx", originalData: {}, "infoId": "yyy" ]}
    infos.forEach((info) => {
      // lets first create "date" objs
      const data = info.added_on.split("T")[0].split("-").reverse().join("-");
      const dateObj = { data, infoId: info.id };
      datemetadata.push(dateObj);
    });
    datatableMt.push({ date: datemetadata });

    // compute data of the owner
    const ownermetadata = [];
    infos.forEach((info) => {
      const data = info.farm_owner.name;
      const ownerObj = { data, infoId: info.id };
      ownermetadata.push(ownerObj);
    });
    datatableMt.push({ owner: ownermetadata });

    // compute data for the location..
    const locationmetadata = [];
    infos.forEach((info) => {
      const data = info.farm.farm_location;
      const locationObj = { data, infoId: info.id };
      locationmetadata.push(locationObj);
    });
    datatableMt.push({ location: locationmetadata });

    return datatableMt;
  }

  useEffect(() => {
    async function checkForDrafts() {
      setLoading(true);
      const pg1 = await AsyncStorage.getItem("page1");
      console.log("pag1 ", pg1);
      if (pg1) {
        console.log("this is the pg1 metadata for me");
        navigation.navigate("Records1", {
          page1: pg1,
        });
      } else {
        navigation.navigate("Records1");
      }
    }

    if (needtogonext) {
      console.log("i need to go to next");
      checkForDrafts();
    }
  }, [needtogonext]);

  useEffect(() => {
    return () => setneedtogonext(0);
  }, []);

  useEffect(() => {
    // set the datatable
    const datatableMt = executeCoreLogics();
    setDatatableMetadata(datatableMt);
  }, [myAppCtx.gatheredData]);

  function searchHandler(text) {
    setSearch(text);

    // najua nina myAppCtx.gatheredData so filter from it...
    const result = myAppCtx.gatheredData.filter(
      (info) =>
        info.farm_owner.name.toLowerCase().includes(text.toLowerCase()) ||
        info.farm.farm_location.toLowerCase().includes(text.toLowerCase()) ||
        info.added_on
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-")
          .includes(text)
    );

    const datatableMt = executeCoreLogics(result);
    setDatatableMetadata(datatableMt);
  }

  // if still fetching gathered infos then show spinner
  if (myAppCtx.stillFetcthingGatheredInfo) {
    return <LoadingSpinner />;
  }

  if (displaySpinner) {
    return <LoadingSpinner />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cardHolder}>
        <DashboardCard
          gradientColors={["#55A630", "#80B918"]}
          title="Total Records"
          subtitle="added"
          onPress={() => {
            setDisplaySpinner(true);
            const results = myAppCtx.gatheredData;
            const datatableMt = executeCoreLogics(results);
            setDatatableMetadata(datatableMt);
            setTitle(
              `All Records (${myAppCtx.gathermanInfo.number_of_records})`
            );
            setTimeout(() => {
              setDisplaySpinner(false);
            }, 1000);
          }}
          number={myAppCtx.gathermanInfo.number_of_records}
        />
        <DashboardCard
          gradientColors={["#55A630", "#80B918"]}
          title="Records added"
          subtitle="today"
          style={{ marginLeft: "2%" }}
          onPress={() => {
            setDisplaySpinner(true);
            let text = moment().format("DD-MM-YYYY");

            console.log("text to search ", text);
            const result = myAppCtx.gatheredData.filter(
              (info) =>
                info.farm_owner.name
                  .toLowerCase()
                  .includes(text.toLowerCase()) ||
                info.farm.farm_location
                  .toLowerCase()
                  .includes(text.toLowerCase()) ||
                info.added_on
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")
                  .includes(text)
            );

            console.log("result ", result);

            const datatableMt = executeCoreLogics(result);
            setDatatableMetadata(datatableMt);

            setTitle(
              `Records Added Today (${myAppCtx.gathermanInfo.recordsaddedtoday})`
            );

            setTimeout(() => {
              setDisplaySpinner(false);
            }, 1000);
          }}
          number={myAppCtx.gathermanInfo.recordsaddedtoday}
        />
      </View>
      <LinearGradient
        colors={["#55A630", "#80B918"]}
        style={styles.tableHolder}
      >
        <View style={styles.headerHolder}>
          <Text style={styles.header}>{title}</Text>
          <TouchableOpacity
            style={styles.addNew}
            onPress={() => {
              console.log("current need to go next ", needtogonext);
              setneedtogonext((prevState) => prevState + 1);
            }}
          >
            <Icon name="add" style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
        {/* since fetching of gathered data will take some time, then we've flickering of display between "No info found" then we're in our information... */}
        {myAppCtx.gatheredData.length > 0 ? (
          datatableMetadata.length > 0 ? (
            <>
              <View style={{ marginTop: "2%" }}>
                <SearchBar
                  platform={Platform.OS === "ios" ? "ios" : "default"}
                  showCancel={false}
                  round
                  placeholder="Search..."
                  light
                  autoCorrect={false}
                  placeholderTextColor="#55A630"
                  leftIcon={{ color: "#55A630" }}
                  inputContainerStyle={{
                    height: 20,
                    fontFamily: "montserrat-17",
                  }}
                  inputStyle={{
                    fontFamily: "montserrat-17",
                    fontSize: 14,
                    color: "#55A630",
                  }}
                  onChangeText={searchHandler}
                  value={search}
                  cancelButtonTitle=""
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderBottomColor: "transparent",
                    borderTopColor: "transparent",

                    marginHorizontal: "2%",
                  }}
                />
              </View>
              <ScrollView style={styles.innerTableHolder}>
                <DataTable data={datatableMetadata} />
              </ScrollView>
            </>
          ) : (
            <LoadingSpinner />
          )
        ) : (
          <View
            style={{
              height: 100,
              marginHorizontal: "5%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "montserrat-17",
                fontSize: 14,
                color: "white",
              }}
            >
              No records added
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

export default IndexScreen;

const styles = StyleSheet.create({
  cardHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "2%",
    marginTop: "5%",
    flex: 0.2, // i added this so make sure your cards occupy 20% of the screen
  },
  tableHolder: {
    flex: 0.75, // i added ths so make sure your table occupy 80% of the screen, this will make your maxHeight of "100%" to work well, if we don't put those flex 0.2, 0.8 logics then we're screwed since maxHeight of "100%" will overrap..
    maxHeight: "100%",
    margin: "2%",
    marginTop: "5%",
    borderRadius: 15,
  },
  innerTableHolder: {
    margin: "4%",
    marginTop: "2%",
  },
  header: {
    fontFamily: "montserrat-17",
    fontSize: 20,
    color: "white",
    textTransform: "uppercase",
    marginLeft: "2%",
  },
  headerIcon: {
    fontFamily: "montserrat-17",
    fontSize: 20,
    color: "white",
    textTransform: "uppercase",
    marginLeft: "2%",
    color: "#55A630",
  },
  headerHolder: {
    marginHorizontal: "4%",
    marginTop: "4%",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addNew: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
