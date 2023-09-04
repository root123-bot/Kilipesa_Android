import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import Form from "../components/Form";

function RegisterScreen() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Form
          title="JOIN NOW"
          image={require("../assets/images/fert.png")}
          icon="login"
        />
      </SafeAreaView>
    </>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
