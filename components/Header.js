import { View, Text } from "react-native";

function Header({ title, subtitle }) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

export default Header;
