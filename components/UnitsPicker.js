import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-community/picker";

export default function UnitsPicker({ unitsSystem, setunitsSystem }) {
  return (
    <View style={styles.unitSystem}>
      <Picker
        selectedValue={unitsSystem}
        onValueChange={(item) => setunitsSystem(item)}
        mode="dropdown"
        itemStyle={{ fontsize: 12 }}
      >
        <Picker.Item label="C" value="metric" />
        <Picker.Item label="F" value="imperial" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  unitSystem: {
    position: "absolute",
    ...Platform.select({
      ios: { top: -20 },
      android: {
        top: 40,
      },
    }),
    left: 25,
    height: 58,
    width: 100,
  },
});
