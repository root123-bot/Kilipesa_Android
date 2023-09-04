import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

function PasswordResetCompleteScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.header, { marginBottom: "2%" }]}>
        Password reset link have been sent to your email, change password and
        login again.
      </Text>
      <Button
        mode="contained"
        style={{
          backgroundColor: "#55A630",
          marginTop: "5%",
        }}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login here
      </Button>
    </View>
  );
}

export default PasswordResetCompleteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "94%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "8%",
  },
  header: {
    fontSize: 20,
    marginTop: "5%",
    fontFamily: "overpass-reg",
  },
});
