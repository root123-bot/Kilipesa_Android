import { View, Pressable, Text, StyleSheet } from "react-native";

function AuthButton({ children, onPress, style }) {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, style]}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default AuthButton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "white",
  },
  text: {
    color: "white",
    paddingVertical: 4,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "overpass-reg"
  },
});
