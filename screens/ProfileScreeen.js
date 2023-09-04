import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import CompleteProfile from "./CompleteProfileScreen";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../store/context";

function ProfileScreen() {
  return <CompleteProfile editprofile={true} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreen;
