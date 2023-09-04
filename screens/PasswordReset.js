import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { resetPassword } from "../utils/requests";

// deep linking read here https://reactnavigation.org/docs/deep-linking/

function ResetPasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState({
    value: "",
    isValid: true,
  });

  function sendmail() {
    setLoading(true);
    // do some validation..
    const mailValid =
      email.value.trim().length > 0 && email.value.includes("@");

    if (!mailValid) {
      // then our email is not valid...
      setEmail((prevState) => ({ ...prevState, isValid: mailValid }));
      setLoading(false);
      return alert("Email field is invalid");
    }

    // then everything is good now... we should submit the email to get reset account notification..
    setEmail((prevState) => ({ ...prevState, isValid: mailValid, value: "" }));

    resetPassword(email.value).then((data) => {
      console.log("data is ", data);
      setLoading(false);
    });
    setLoading(false);
    navigation.navigate("ResetPasswordDone");

    // display sth like dialogue with message that we have sent you a reset link to your email.. and login button..
  }

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={[styles.header, { marginBottom: "2%" }]}>
            Enter your email to reset password.
          </Text>
          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            inputMode="email"
            value={email.value}
            outlineColor={email.isValid ? "#55A630" : "red"}
            activeOutlineColor={email.isValid ? "#55A630" : "red"}
            onChangeText={(text) =>
              setEmail((prevState) => ({
                ...prevState,
                value: text,
                isValid: true,
              }))
            }
          />
          <Button
            mode="contained"
            style={{
              backgroundColor: "#55A630",
              marginTop: "5%",
            }}
            onPress={sendmail}
          >
            Reset Password
          </Button>
        </View>
      </View>
    </>
  );
}

export default ResetPasswordScreen;

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
