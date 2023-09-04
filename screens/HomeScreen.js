import Title from "../components/Title";
import { StyleSheet, ImageBackground, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect } from "react";
import { AppContext } from "../store/context";
import { StatusBar } from "expo-status-bar";

function HomeScreen() {
  const myAppCtx = useContext(AppContext);

  {
    /* 
    this is the initial page you should go and find if there is token in user storage, if not 
    then you should redirect the user to the login screen, if there is token then you should
    go check if the user is "active" status or "inactive" status, if the user is "active" status
    then you should redirect the user to the index screen, if the user is "inactive" status then
    you should redirect the user to the waiting verification screen, either you should check 
    if your context have this kind of data if not then you should get it check if there is 
    token in your storage...
  */
  }

  return (
    <>
      <LinearGradient colors={["#fff", "#000"]} style={styles.container}>
        <ImageBackground
          source={require("../assets/images/banner.jpg")}
          resizeMode="cover"
          style={styles.rootContainer}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.container}>
            <Title />
          </View>
        </ImageBackground>
      </LinearGradient>
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  backgroundImage: {
    opacity: 0.25,
  },
});
