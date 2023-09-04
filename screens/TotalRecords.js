import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
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

function AllRecords({ navigation }) {
  const myAppCtx = useContext(AppContext);

  const [page1, setPage1] = useState();

  const [stillChecking, setStillChecking] = useState(true);

  const [search, setSearch] = useState("");
  const [datatableMetadata, setDatatableMetadata] = useState([]); // format of this is [ {"date": [{ "data": "xxx", originalData: {}, infoId: "yyy" }], "owner": [ "data": "xxx", originalData: {}, infoId: "yyy" ], "owner": [ "data": "xxx", originalData: {}, "infoId": "yyy" ]} ]

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

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#55A630", "#80B918"]}
        style={styles.tableHolder}
      >
        <View style={styles.headerHolder}>
          <Text style={styles.header}>My Records</Text>
          <TouchableOpacity
            style={styles.addNew}
            onPress={
              page1
                ? () => {
                    navigation.navigate("Records1", {
                      page1,
                    });
                  }
                : () => {
                    navigation.navigate("Records1");
                  }
            }
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

export default AllRecords;

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
    flex: 0.96, // i added ths so make sure your table occupy 80% of the screen, this will make your maxHeight of "100%" to work well, if we don't put those flex 0.2, 0.8 logics then we're screwed since maxHeight of "100%" will overrap..
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
