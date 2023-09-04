import { Text, View, StyleSheet, Pressable } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { useState, useContext } from "react";
import { AppContext } from "../store/context";
import { changeGathermanPassword } from "../utils/requests";
import { useNavigation } from "@react-navigation/native";

function ChangePasswordScreen() {
  const navigation = useNavigation();
  const myAppCtx = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [opassword, setOpassword] = useState({
    value: "",
    isValid: true,
  });
  const [npassword, setNpassword] = useState({
    value: "",
    isValid: true,
  });
  const [cpassword, setCpassword] = useState({
    value: "",
    isValid: true,
  });

  function changePasswordHandler() {
    setLoading(true);
    const oPasswordValid = opassword.value.trim().length > 0;
    const nPasswordValid = npassword.value.trim().length > 7;
    const cPasswordValid = cpassword.value.trim().length > 7;
    if (!oPasswordValid || !nPasswordValid || !cPasswordValid) {
      alert("Please make sure you have filled all the fields correctly");
      setOpassword({
        ...opassword,
        isValid: oPasswordValid,
      });
      setNpassword({
        ...npassword,
        isValid: nPasswordValid,
      });
      setCpassword({
        ...cpassword,
        isValid: cPasswordValid,
      });
      setLoading(false);
      return;
    }

    changeGathermanPassword(
      myAppCtx.usermetadata.user_id,
      opassword.value,
      npassword.value,
      cpassword.value
    )
      .then((data) => {
        if (data.success) {
          alert("Password changed successfully");
          navigation.goBack();
        } else {
          alert(data.details);
        }
      })
      .catch((err) => {
        alert(err.message);
      });

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Old Password"
        mode="outlined"
        outlineColor={opassword.isValid ? "#000" : "#EF233C"}
        activeOutlineColor={opassword.isValid ? "#000" : "#EF233C"}
        onChangeText={(text) =>
          setOpassword((prevState) => {
            return {
              ...prevState,
              value: text,
              isValid: true,
            };
          })
        }
        style={styles.formInput}
        secureTextEntry
        value={opassword.value}
      />
      <TextInput
        label="New Password"
        mode="outlined"
        secureTextEntry
        outlineColor={npassword.isValid ? "#000" : "#EF233C"}
        activeOutlineColor={npassword.isValid ? "#000" : "#EF233C"}
        onChangeText={(text) =>
          setNpassword((prevState) => {
            return {
              ...prevState,
              value: text,
              isValid: true,
            };
          })
        }
        value={npassword.value}
        style={styles.formInput}
      />
      <HelperText
        padding="none"
        style={{
          color: "#55A630",
          fontFamily: "montserrat-17",
        }}
        type="info"
      >
        **not less than 8 characters
      </HelperText>
      <TextInput
        label="Confirm Password"
        mode="outlined"
        outlineColor={cpassword.isValid ? "#000" : "#EF233C"}
        activeOutlineColor={cpassword.isValid ? "#000" : "#EF233C"}
        secureTextEntry
        onChangeText={(text) =>
          setCpassword((prevState) => {
            return {
              ...prevState,
              value: text,
              isValid: true,
            };
          })
        }
        value={cpassword.value}
        style={styles.formInput}
      />
      <HelperText
        padding="none"
        style={{
          color: "#55A630",
          fontFamily: "montserrat-17",
        }}
        type="info"
      >
        **not less than 8 characters
      </HelperText>
      <Button
        mode="contained"
        loading={loading}
        style={{ marginTop: "5%" }}
        buttonColor="#55A630"
        onPress={changePasswordHandler}
      >
        Change Password
      </Button>
    </View>
  );
}

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "5%",
  },
  formInput: {
    marginTop: "2%",
  },
});
