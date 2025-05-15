import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import MarkerTabs from "@/assets/svg/markerTabs.svg";
import WorldTabs from "@/assets/svg/worldTabs.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";

export const BottomNavBarCirclularButton = ({
  isActive,
}: {
  isActive?: boolean;
}) => {
  const isWidthLessThan400 = useIsWidthLessThan400();
  return isActive ? (
    <View
      className="items-center justify-center rounded-full border-2 border-[#1f9A83] bg-white"
      style={{
        height: isWidthLessThan400 ? 72 : 96,
        width: isWidthLessThan400 ? 72 : 96,
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 8,
        elevation: 8,
      }}
    >
      <MarkerTabs />
      {!isWidthLessThan400 && (
        <Text style={[styles.text, isActive && styles.activeText]}>Créer</Text>
      )}
    </View>
  ) : (
    <View
      className="items-center justify-center rounded-full bg-white"
      style={{
        height: isWidthLessThan400 ? 72 : 96,
        width: isWidthLessThan400 ? 72 : 96,
      }}
    >
      <WorldTabs />
      {isWidthLessThan400 && (
        <Text style={[styles.text, isActive && styles.activeText]}>
          Explorer
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  activeText: {
    color: "#1f9A83",
    textTransform: "uppercase",
  },
});
