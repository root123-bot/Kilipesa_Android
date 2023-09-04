import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // ni hook and hook is used inside the function component...
import { AppContext } from "../store/context";
import { useContext } from "react";

function Title() {
  const navigation = useNavigation();
  const myAppCtx = useContext(AppContext);

  function getStartedHandler() {
    const usermetadata = myAppCtx.usermetadata;
    // console.log("user metadata ", usermetadata);
    if (usermetadata.token) {
      if (usermetadata.user_status) {
        navigation.navigate("IndexScreen");
      } else {
        navigation.navigate("UnderReviewScreen");
      }
    } else {
      navigation.navigate("LoginScreen");
    }
  }

  return (
    <>
      <Text style={styles.title}>
        Use Technology to improve Agriculture Production.
      </Text>

      <Button
        mode="contained"
        dark
        style={styles.btn}
        uppercase
        buttonColor="#55A630"
        onPress={getStartedHandler}
      >
        Get Started
      </Button>
    </>
  );
}

export default Title;

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontFamily: "lato-black",
    fontSize: 24,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "montserrat-17",
  },
  subtitle: {
    color: "grey",
    fontFamily: "lato-black",
    fontSize: 15,
    textAlign: "center",
    fontFamily: "montserrat-17",
  },
  btn: {
    marginTop: 10,
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    fontFamily: "montserrat-17",
  },
});
