import { useFonts } from "expo-font";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import { StatusBar } from "expo-status-bar";
import CompleteProfile from "./screens/CompleteProfileScreen";
import { useEffect, useContext, useState, useLayoutEffect } from "react";
import UnderReviewScreen from "./screens/UnderReviewScreen";
import IndexScreen from "./screens/IndexScreen";
import AppContextProvider, { AppContext } from "./store/context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./components/CustomDrawerContent";
import LoadingSpinner from "./components/UI/Spinner";
import AddRecord from "./screens/AddRecordScreen";
import { Icon } from "@muratoner/semantic-ui-react-native";
import { Platform, TouchableOpacity } from "react-native";
import ProfileScreen from "./screens/ProfileScreeen";
import ChangePasswordScreen from "./screens/ChangePassword";

import { enableFreeze } from "react-native-screens";
import FarmerDetails from "./screens/Records/Screen1";
import FarmerResidence from "./screens/Records/Screen2";
import RecordsKinInfo from "./screens/Records/Screen3";
import CoordinatesFarm from "./screens/Records/Screen4";
import EditCoordinatesFarm from "./screens/EditRecords/Screen4";
import EditRecordsKinInfo from "./screens/EditRecords/Screen3";
import EditFarmerResidence from "./screens/EditRecords/Screen2";
import EditFarmerDetails from "./screens/EditRecords/Screen1";

import { Ionicons } from "@expo/vector-icons";
import AllRecords from "./screens/TotalRecords";
import ResetPasswordScreen from "./screens/PasswordReset";
import PasswordResetCompleteScreen from "./screens/PasswordResetCompleteScreen";

// for viewing on how to store token in localStorage view video 185

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  const myAppCtx = useContext(AppContext);
  if (Object.keys(myAppCtx.gathermanInfo).length < 1) {
    return <LoadingSpinner />;
  }

  {
    /* lets check if the that's user profile is complete if not redirect to the complete profile screen
     but the profile is not completed.. sawa ana-token na anafetch data profile analo so check if its 
     completed...
*/
  }
  if (!myAppCtx.gathermanInfo.profileIsCompleted) {
    return <CompleteProfile />;
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} moreData={myAppCtx.gathermanInfo} />
      )}
    >
      <Drawer.Screen
        name="Index"
        options={{
          title: "Dashboard",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          headerTintColor: "#fff",
          drawerLabelStyle: { fontFamily: "montserrat-17" },
        }}
        component={IndexScreen}
      />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  const myAppCtx = useContext(AppContext);

  {
    /* nimeweka hii ili kuondoa au kufanya flickering of auth screen and authenticated screen to not 
      flicker just remember the useEffect we have to check and set usermetadata in our context is 
      async so it check slowly, so just remember by default we set the "initialLoading" to be true this
      means we'll hang in our spiner until the useEffect complete its execution.. let's see if that will 
      work.. */
  }
  if (myAppCtx.initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="GetStarted" component={HomeScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="UnderReviewScreen" component={UnderReviewScreen} />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: true,
          title: "Reset Password",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            color: "white",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={({ pressed }) => pressed && { backgroundColor: "grey" }}
              >
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            );
          },
        })}
        name="ResetPassword"
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: true,
          title: "Reset Password Done",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            color: "white",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={({ pressed }) => pressed && { backgroundColor: "grey" }}
              >
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            );
          },
        })}
        name="ResetPasswordDone"
        component={PasswordResetCompleteScreen}
      />
    </Stack.Navigator>
  );
}

function AunthenticatedStack() {
  const myAppCtx = useContext(AppContext);
  // why this value is changing not used as default one.. it use the last one
  // instead this defaut i specify here, do i also need to store thsi in context...
  // so as to be global.. ???
  // const [page1Icon, setPage1Icon] = useState("cloud-download-outline");

  return (
    <Stack.Navigator
      screenOptions={{
        backgroundColor: "#55A630",
        headerTintColor: "#fff",
        headerShown: false,
      }}
    >
      <Stack.Screen name="IndexScreen" component={MyDrawer} />
      <Stack.Screen name="CompleteProfileScreen" component={CompleteProfile} />
      <Stack.Screen name="ChangeProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: true,
          title: "All Records",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
        })}
        name="TotalRecords"
        component={AllRecords}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: true,
          title: "CHANGE PASSWORD",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={({ pressed }) => pressed && { backgroundColor: "grey" }}
              >
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            );
          },
        })}
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
      {/* add record stack */}
      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,

          title: "ADD RECORD (1/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },

          headerRight:
            route.params &&
            (() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log("load page1 draft");
                    myAppCtx.alterPage1Icon();
                    myAppCtx.alterShowPage1Draft();
                  }}
                  style={({ pressed }) =>
                    pressed && { backgroundColor: "grey" }
                  }
                >
                  <Ionicons name={myAppCtx.page1Icon} size={24} color="#fff" />
                </TouchableOpacity>
              );
            }),
        })}
        name="Records1"
        component={FarmerDetails}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,

          title: "ADD RECORD (2/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          headerRight:
            route.params &&
            (() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log("load page2 draft");
                    myAppCtx.alterPage2Icon();
                    myAppCtx.alterShowPage2Draft();
                  }}
                  style={({ pressed }) =>
                    pressed && { backgroundColor: "grey" }
                  }
                >
                  <Ionicons name={myAppCtx.page2Icon} size={24} color="#fff" />

                  {/* <Icon name="sync" size={24} color="#fff" /> */}
                </TouchableOpacity>
              );
            }),
        })}
        name="Records2"
        component={FarmerResidence}
      />

      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,

          title: "ADD RECORD (3/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          headerRight:
            route.params &&
            (() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log("load page3 draft");
                    myAppCtx.alterPage3Icon();
                    myAppCtx.alterShowPage3Draft();
                  }}
                  style={({ pressed }) =>
                    pressed && { backgroundColor: "grey" }
                  }
                >
                  <Icon name={myAppCtx.page3Icon} size={24} color="#fff" />
                </TouchableOpacity>
              );
            }),
        })}
        name="Records3"
        component={RecordsKinInfo}
      />

      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,

          title: "ADD RECORD (4/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          headerRight:
            route.params &&
            (() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log("load page4 draft");
                    myAppCtx.alterPage4Icon();
                    myAppCtx.alterShowPage4Draft();
                  }}
                  style={({ pressed }) =>
                    pressed && { backgroundColor: "grey" }
                  }
                >
                  <Icon name={myAppCtx.page4Icon} size={24} color="#fff" />
                </TouchableOpacity>
              );
            }),
        })}
        name="Records4"
        component={CoordinatesFarm}
      />

      {/* Edit record stack */}
      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,
          title: "VIEW AND UPDATE RECORD (1/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
        })}
        name="EditRecords1"
        component={EditFarmerDetails}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,

          title: "VIEW AND UPDATE RECORD (2/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
        })}
        name="EditRecords2"
        component={EditFarmerResidence}
      />

      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,

          title: "VIEW AND UPDATE RECORD (3/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
        })}
        name="EditRecords3"
        component={EditRecordsKinInfo}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,

          title: "VIEW AND UPDATE RECORD (4/4)",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
        })}
        name="EditRecords4"
        component={EditCoordinatesFarm}
      />

      <Stack.Screen name="UnderReviewScreen" component={UnderReviewScreen} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          headerShown: true,
          title: !route.params ? "ADD RECORD" : "MY RECORD",
          headerStyle: {
            backgroundColor: "#55A630",
          },
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={[
                  ({ pressed }) => pressed && { backgroundColor: "grey" },
                ]}
              >
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            );
          },
        })}
        name="AddRecordScreen"
        component={AddRecord}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const myAppCtx = useContext(AppContext);
  return (
    <NavigationContainer>
      {myAppCtx.usermetadata.token && <AunthenticatedStack />}
      {!myAppCtx.usermetadata.token && <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "lato-regular": require("./assets/fonts/Lato/Lato-Regular.ttf"),
    "lato-bold": require("./assets/fonts/Lato/Lato-Bold.ttf"),
    "lato-black": require("./assets/fonts/Lato/Lato-Black.ttf"),
    "lato-italic": require("./assets/fonts/Lato/Lato-Italic.ttf"),
    "lato-light": require("./assets/fonts/Lato/Lato-Light.ttf"),
    "lato-thin": require("./assets/fonts/Lato/Lato-Thin.ttf"),
    "lato-italic-bold": require("./assets/fonts/Lato/Lato-BoldItalic.ttf"),
    "playfair-1": require("./assets/fonts/Playfair_Display/static/PlayfairDisplay-Black.ttf"),
    "playfair-2": require("./assets/fonts/Playfair_Display/static/PlayfairDisplay-BlackItalic.ttf"),
    "playfair-3": require("./assets/fonts/Playfair_Display/static/PlayfairDisplay-Bold.ttf"),
    "montserrat-1": require("./assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf"),
    "montserrat-2": require("./assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf"),
    "montserrat-3": require("./assets/fonts/Montserrat/static/Montserrat-Black.ttf"),
    "montserrat-4": require("./assets/fonts/Montserrat/static/Montserrat-BlackItalic.ttf"),
    "montserrat-5": require("./assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    "montserrat-6": require("./assets/fonts/Montserrat/static/Montserrat-BoldItalic.ttf"),
    "montserrat-7": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf"),
    "montserrat-8": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBoldItalic.ttf"),
    "montserrat-9": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLight.ttf"),
    "montserrat-10": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLightItalic.ttf"),
    "montserrat-11": require("./assets/fonts/Montserrat/static/Montserrat-Italic.ttf"),
    "montserrat-12": require("./assets/fonts/Montserrat/static/Montserrat-Light.ttf"),
    "montserrat-13": require("./assets/fonts/Montserrat/static/Montserrat-LightItalic.ttf"),
    "montserrat-14": require("./assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    "montserrat-15": require("./assets/fonts/Montserrat/static/Montserrat-MediumItalic.ttf"),
    "montserrat-16": require("./assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "montserrat-17": require("./assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "montserrat-18": require("./assets/fonts/Montserrat/static/Montserrat-SemiBoldItalic.ttf"),
    "montserrat-19": require("./assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "montserrat-20": require("./assets/fonts/Montserrat/static/Montserrat-ThinItalic.ttf"),
    "overpass-reg": require("./assets/fonts/personalyzer/Overpass-Regular.ttf"),
    "roboto-reg": require("./assets/fonts/personalyzer/Roboto-Regular.ttf"),
    "roboto-med": require("./assets/fonts/personalyzer/Roboto-MediumItalic.ttf"),
  });

  if (!fontsLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AppContextProvider>
        <Navigation />
      </AppContextProvider>
    </>
  );
}
