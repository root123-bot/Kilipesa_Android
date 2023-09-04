import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

function IconButton({ color, size, name, style }) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  container: {},
});
