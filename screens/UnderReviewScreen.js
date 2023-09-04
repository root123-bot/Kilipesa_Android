import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

function UnderReviewScreen({ route, navigation }) {
  // if there is no params sent then route.params is "undefined.."
  // const status = route.params;
  // if the user is from 'complete' gether profile then status is "Profile Created"
  return (
    <View style={styles.container}>
      {route.params ? (
        <>
          <Text style={styles.text}>
            We need to check you're profile. You'll be contacted via phone
            number or email after we reviewed your profiile.
          </Text>
          <Button
            style={{ marginVertical: "3%", fontFamily: "montserrat-17" }}
            buttonColor="#55A630"
            textColor="#fff"
            icon="home"
            onPress={() => navigation.navigate("LoginScreen")}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            Your account is under Review, you'll be contacted via phone number
            or email once everything is good..
          </Text>
          <Button
            style={{ marginVertical: "3%", fontFamily: "montserrat-14" }}
            buttonColor="#55A630"
            textColor="#fff"
            icon="home"
            onPress={() => navigation.navigate("LoginScreen")}
          >
            Continue
          </Button>
        </>
      )}
    </View>
  );
}

export default UnderReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "2%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    fontFamily: "montserrat-17",
  },
});
