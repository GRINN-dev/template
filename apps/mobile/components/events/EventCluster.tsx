import { TouchableOpacity, View } from "react-native";
import { Marker } from "react-native-maps";
import tinycolor from "tinycolor2";

import MarkerBaseSmall from "@/assets/svg/markerBaseSmall.svg";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const EventCluster = ({ cluster }: { cluster: any }) => {
  const baseColor = "#545F66";
  const lightColor = tinycolor(baseColor).lighten(38).toString();
  const darkColor = tinycolor(baseColor).darken(16).toString();
  return (
    <Marker
      coordinate={{
        latitude: cluster?.geometry?.coordinates?.[1],
        longitude: cluster?.geometry?.coordinates?.[0],
      }}
    >
      <TouchableOpacity
        className="relative"
        onPress={() => cluster.onPress()}
        style={{ height: 35, width: 28 }}
      >
        <MarkerBaseSmall
          style={{ zIndex: 1, position: "absolute", top: 1, left: 0 }}
          fill={lightColor}
        />
        <View
          style={{
            backgroundColor: darkColor,
            position: "absolute",
            top: 2,
            left: 0,
            zIndex: 10,
            height: 28,
            width: 28,
            borderRadius: 100,
          }}
        />
        <View
          style={{
            backgroundColor: baseColor,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
            height: 28,
            width: 28,
            borderRadius: 100,
          }}
        />
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            top: 2,
            left: 2,
            zIndex: 30,
            height: 24,
            width: 24,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText type="defaultSemiBold">
            {cluster?.properties?.point_count}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </Marker>
  );
};
