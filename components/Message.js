import { View, Text, ActivityIndicator } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";

export const ToastNotification = ({
  messageHeader,
  messageDescription,
  color,
}) => {
  {
    /*
    here the backgroundColor of Animated.View require you to put color in 'string' format
    even if you've passed your color in state/prop in string using only 
    >>> backgroundColor={color}
    will not work, you have to put it in string format like this
    >>> backgroundColor={`${color}`}
    hichi ni kitu kipya nimekigundua hapa ko in some case some props especially that build in 
    packages need a pure string format, so you have to put it in string format using template 
    string...
  */
  }
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        top: 70,
        backgroundColor: `${color}`,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 40,
        borderRadius: 5,
        padding: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        shadowColor: "#003049",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}
    >
      <Icon name="info" size={30} color="#f6f4f4" />
      <View>
        <Text
          style={{
            color: "#f6f4f4",
            fontWeight: "bold",
            marginLeft: 10,
            fontSize: 16,
          }}
        >
          {messageHeader}
        </Text>
        <Text
          style={{
            color: "#f6f4f4",
            fontWeight: "500",
            marginLeft: 10,
            fontSize: 14,
          }}
        >
          {messageDescription}
        </Text>
      </View>
    </Animated.View>
  );
};

// TransparentPopUpIcon message at center of screen inspired by all football...
export const TransparentPopUpIconMessage = ({
  messageHeader,
  icon,
  inProcess,
}) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View>
        <View style={{ alignItems: "center" }}>
          {inProcess ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Icon name={icon} size={50} color="#f6f4f4" />
          )}
        </View>
        {!inProcess && (
          <Text style={{ fontFamily: "montserrat-17", color: "white" }}>
            {messageHeader}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};
