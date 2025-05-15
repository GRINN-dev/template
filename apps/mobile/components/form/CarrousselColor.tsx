import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "../ThemedText";

const CarrouselColors = ({
  onColorSelect,
}: {
  onColorSelect: (color: string) => void;
}) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const colors = ["#1F94A3", "#1FA38D", "#F3A712", "#DC0073"];

  const handlePress = (color: any) => {
    setSelectedColor(color);
    onColorSelect(color);
  };
  const disabledColors = "#E5E7EB";
  return (
    <View style={styles.wrapper}>
      <ThemedText
        className={`text-bold mb-4 pl-6 text-xs font-medium !text-[#434C52]`}
      >
        Couleur avatar
      </ThemedText>
      <FlatList
        horizontal
        data={colors}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View
              style={[
                styles.square,
                { backgroundColor: item },
                selectedColor === item && styles.selectedBorder,
              ]}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: -20,
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  square: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8, // coins arrondis (optionnel)
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: "black",
  },
});

export default CarrouselColors;
