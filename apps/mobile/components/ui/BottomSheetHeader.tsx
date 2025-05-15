import { TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import tinycolor from "tinycolor2";

import CloseButton from "@/assets/svg/closeButton.svg";
import Information from "@/assets/svg/information.svg";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { getSportIcon } from "@/utils/GetSportIcon";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const BottomSheetHeader = ({
  title,
  onClose,
  color,
  border,
  showInfo,
  showClose,
  textCenter,
  sport,
}: {
  title: string;
  onClose: () => void;
  color?: string;
  border?: boolean;
  showInfo?: boolean;
  showClose?: boolean;
  textCenter?: boolean;
  sport?: string;
}) => {
  const baseColor = color;
  const lightColor = tinycolor(baseColor).lighten(38).toString();
  const darkColor = tinycolor(baseColor).darken(16).toString();
  return (
    <ThemedView
      className={`relative flex flex-row items-center justify-between gap-4 overflow-hidden rounded-t-2xl ${border ? `border-b` : ""} px-4 py-4`}
      style={{
        borderColor: lightColor,
        backgroundColor: colorSlate50,
      }}
    >
      {showInfo && (
        <TouchableOpacity onPress={() => console.log("info")}>
          <Information fill="#545F66" />
        </TouchableOpacity>
      )}
      <ThemedText
        type="defaultSemiBold"
        style={{
          fontSize: 20,
          padding: 5,
          textAlign: textCenter ? "center" : "left",
          color: baseColor,
        }}
      >
        {title}
      </ThemedText>
      {showClose && (
        <TouchableOpacity onPress={onClose}>
          <CloseButton fill={baseColor} />
        </TouchableOpacity>
      )}
      {sport && (
        <View className="absolute left-4 top-[-1rem] z-[-10] opacity-10">
          {getSportIcon(sport, baseColor, 128, 128)}
        </View>
      )}
    </ThemedView>
  );
};
