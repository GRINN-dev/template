import { TouchableOpacity, View } from "react-native";

import Location from "@/assets/svg/location.svg";
import MarkerSimple from "@/assets/svg/markerSimple.svg";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconButton } from "./IconButton";

export const AutoCompleteSearchBar = ({
  onPress,
  onPressLocation,
}: {
  onPress: () => void;
  onPressLocation: () => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}
      className="h-10 w-full flex-row items-center justify-between gap-10 rounded-full bg-white"
      onPress={() => {
        onPress();
      }}
    >
      <View className="flex-row items-center gap-1 px-2">
        <View className="h-6 w-6 items-center justify-center">
          <MarkerSimple />
        </View>
        <ThemedText>Rechercher...</ThemedText>
      </View>
      <IconButton
        shadow
        border
        color="#1F94A3"
        icon={<Location />}
        onPress={() => {
          onPressLocation();
        }}
      />
    </TouchableOpacity>
  );
};
