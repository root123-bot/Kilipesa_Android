import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Banner from "./UI/Banner";
import CustomLine from "./UI/CustomLine";
import PressableIconTextContainer from "./UI/PressableIconTextContainer";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceHeight = Dimensions.get("window").height;

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const myAppCtx = useContext(AppContext);

  const [needtogonext, setneedtogonext] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setneedtogonext(0);
    };
  }, []);

  useEffect(() => {
    async function checkForDrafts() {
      setLoading(true);
      const pg1 = await AsyncStorage.getItem("page1");
      if (pg1) {
        navigation.navigate("Records1", {
          page1: pg1,
        });
      } else {
        navigation.navigate("Records1");
      }
    }

    if (needtogonext) {
      console.log("You need to submit the record");
      checkForDrafts();
    }
  }, [needtogonext]);

  return (
    <View style={styles.container}>
      <Banner profile={props.moreData} />
      <ScrollView style={styles.parentOuterView} {...props}>
        <View style={styles.outerView}>
          <View>
            <LinearGradient
              style={styles.firstContainer}
              colors={["#55A630", "#80B918"]}
            >
              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="addfile"
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
                onPress={() => {
                  console.log("im setting to go to addrecordscreen1");
                  setneedtogonext((prevState) => prevState + 1);
                }}
              >
                Add record
              </PressableIconTextContainer>
              <CustomLine style={{ marginBottom: 1, marginHorizontal: 10 }} />

              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="contacts"
                onPress={() => navigation.navigate("ChangeProfileScreen")}
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                Edit Profile
              </PressableIconTextContainer>
              <CustomLine style={{ marginBottom: 1, marginHorizontal: 10 }} />

              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="lock"
                onPress={() => navigation.navigate("ChangePassword")}
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                Change Password
              </PressableIconTextContainer>
            </LinearGradient>
            {/* <LinearGradient
              style={styles.secondContainer}
              colors={["#55A630", "#80B918"]}
            >
              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="setting"
                // onPress={drawerItemPressed}
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                Settings
              </PressableIconTextContainer>
            </LinearGradient> */}
          </View>
        </View>
      </ScrollView>
      <CustomLine />
      <View style={{ alignItems: "center" }}>
        <PressableIconTextContainer
          color="#d9534f"
          size={28}
          name="logout"
          onPress={() => {
            myAppCtx.logout();
            // hii kama additional but mwanzo sikuiweka na ilikuwa fresh tu,
            // yaani error inapotokea ni pale user/gatherman akiwa amechezea
            // chezea 'add record' screens or pages hapo ndo kunakuwa na
            // kimbembe kidogo..
            // navigation.navigate("LoginScreen");
          }}
          titleStyle={{ marginLeft: 8, color: "#d9534f" }}
          style={{ paddingVertical: 10 }}
        >
          Logout
        </PressableIconTextContainer>
      </View>
    </View>
  );
}

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lgContainer: {
    flex: 0.3,
  },
  firstContainer: {
    marginTop: 5,
  },
  secondContainer: {
    marginTop: 5,
  },
  drawerItemsContainer: {
    margin: 0,
    padding: 0,
  },

  parentOuterView: {
    flex: 1,
  },
  outerView: {
    flex: 1,
  },
  imgBack: {
    flex: 1,
  },
  title: {
    fontFamily: "montserrat-17",
    textAlign: "center",
    color: "white",
    fontSize: 25,
  },

  textHolder: {
    marginLeft: 10,
  },
  nameText: {
    fontFamily: "overpass-reg",
    fontSize: 25,
    color: "white",
  },
  sub: {
    fontFamily: "montserrat-17",
    fontSize: 15,
    color: "white",
  },
  wrapperView: {
    flex: 1,
    height: "100%",
    width: "100%",
    // marginBottom: deviceHeight < 700 ? 15 : 30,
  },
  innerWrapperView: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
  },
  conte: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageProfile: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  authButtonContainer: {
    alignItems: "center",
  },
  increasedMarginTop: {
    marginTop: deviceHeight < 700 ? 15 : 20,
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});
