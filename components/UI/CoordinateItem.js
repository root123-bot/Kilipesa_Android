import { View, Text, Image, TouchableOpacity } from "react-native";

function CoordinateItem({ coordinate, index, onPressHandler }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: "2%" }}
    >
      <Text
        style={{
          fontFamily: "montserrat-17",
        }}
        numberOfLines={1}
      >
        {coordinate}
      </Text>
      <TouchableOpacity onPress={onPressHandler.bind(this, index)}>
        <Image
          source={require("../../assets/images/x-mark.png")}
          style={{ marginLeft: "10%", width: 15, height: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default CoordinateItem;
