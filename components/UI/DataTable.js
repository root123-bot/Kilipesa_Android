import { Text, View, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import CustomLine from "./CustomLine";
import { useNavigation } from "@react-navigation/native";

{
  /* uzuri ni kwamba ukiweka numeroflines={} prop in your Text component endapo text ikizidi available place yenyewe ina
    ji-trim like "Pasch..." kitu hichi in web nilikuwa na-handle mwenyewe but in mobile wamerahisisha... */
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

function DataTable({ data }) {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.tableHeaderView}>
        <View style={[styles.innerContainer, { width: "37%" }]}>
          <View>
            <Text style={styles.header}>Farm Owner</Text>
          </View>
          {Platform.OS === "ios" && <CustomLine style={styles.hr} />}
          {/* my farm owner */}
          {/* me nahangaika kuipata original data of my element here ambayo naifahamu kweli */}
          {data[1].owner.map((value, index) => (
            <View key={`${index * Math.random()}.FO`}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditRecords1", {
                    infoId: value.infoId,
                  })
                }
                style={{ paddingVertical: 5 }}
              >
                <View style={[styles.columnHolder]}>
                  <Text numberOfLines={1} style={styles.colValue}>
                    {value.data}
                  </Text>
                </View>
              </TouchableOpacity>
              {Platform.OS === "ios" && <CustomLine style={styles.hr} />}
            </View>
          ))}

          {/* my farm owner */}
        </View>
        <View style={[styles.innerContainer, { width: "37%" }]}>
          <View>
            <Text style={styles.header} numberOfLines={1}>
              Location
            </Text>
          </View>
          {Platform.OS === "ios" && <CustomLine style={styles.hr} />}

          {/* my location */}
          {data[2].location.map((value, index) => (
            <View key={`${index * Math.random()}..FL`}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditRecords1", {
                    infoId: value.infoId,
                  })
                }
                style={{ paddingVertical: 5 }}
              >
                <View style={styles.columnHolder}>
                  <Text numberOfLines={1} style={styles.colValue}>
                    {value.data}
                  </Text>
                </View>
              </TouchableOpacity>
              {Platform.OS === "ios" && <CustomLine style={styles.hr} />}
            </View>
          ))}
          {/* my location */}
        </View>
        <View style={[styles.innerContainer, { width: "25%" }]}>
          <View>
            <Text style={styles.header}>Date</Text>
          </View>
          {Platform.OS === "ios" && <CustomLine style={styles.hr} />}

          {/* my date data */}

          {data[0]["date"].map((value, index) => (
            <View key={`${index * Math.random()}.FD`}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditRecords1", {
                    infoId: value.infoId,
                  })
                }
                style={{ paddingVertical: 5 }}
              >
                <View key={`date${index}`} style={styles.columnHolder}>
                  <Text numberOfLines={1} style={styles.colValue}>
                    {value.data}
                  </Text>
                </View>
              </TouchableOpacity>
              {Platform.OS === "ios" && <CustomLine style={styles.hr} />}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default DataTable;

const styles = StyleSheet.create({
  hr: {
    marginBottom: 0,
  },
  tableHeaderView: {
    flexDirection: "row",
  },
  innerContainer: {
    width: "33%",
  },
  header: {
    fontFamily: "montserrat-17",
    color: "#fff",
    padding: 10,
    textTransform: "capitalize",
    // whiteSpace: "nowrap",  // nowrap whiteSpace can be set using the numberOfLines prop of Text
  },
  columnHolder: {
    padding: 10,
  },
  colValue: {
    fontFamily: "montserrat-14",
    color: "#fff",
    fontSize: 12,
    textTransform: "uppercase",
  },
});
