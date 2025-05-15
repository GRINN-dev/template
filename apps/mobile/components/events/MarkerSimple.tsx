import { TouchableOpacity, View } from "react-native";
import tinycolor from "tinycolor2";

import MarkerDefault from "@/assets/svg/makerDefault.svg";
import MarkerBaseSmall from "@/assets/svg/markerBaseSmall.svg";

export const MarkerSimpleComponent = () => {
  const baseColor = "#545F66";
  const lightColor = tinycolor(baseColor).lighten(38).toString();
  const darkColor = tinycolor(baseColor).darken(16).toString();

  return (
    <TouchableOpacity
      className="relative"
      style={{
        height: "100%",
        width: "100%",
      }}
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
        <MarkerDefault fill={baseColor} />
      </View>
    </TouchableOpacity>
  );
};
