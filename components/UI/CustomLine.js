import { View, StyleSheet } from "react-native";

function CustomLine({ style }) {
  return <View style={[styles.customLine, style]}></View>;
}

export default CustomLine;

const styles = StyleSheet.create({
  customLine: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cfcfcf",
  },
});
