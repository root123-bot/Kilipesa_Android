import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable } from "react-native";

function PressableIconButton({ color, size, name, style, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pressable]}
    >
      <View style={[styles.container, style]}>
        <Ionicons name={name} size={size} color={color} />
      </View>
    </Pressable>
  );
}

export default PressableIconButton;
// Nahisi hii ionicon haichukui full width/height provided by pressable..
const styles = StyleSheet.create({
  pressable: {},
  container: {
    overflow: "hidden",
  },
});
