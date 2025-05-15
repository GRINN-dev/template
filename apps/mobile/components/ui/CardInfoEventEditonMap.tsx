import { View } from "react-native";

import { colorPrimary400, colorPrimary500 } from "@/constants/ColorsFeder";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { MarkerSimpleComponent } from "../events/MarkerSimple";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "./base-button";

export const CardInfoEventEditonMap = ({
  handleCloseInfo,
}: {
  handleCloseInfo: () => void;
}) => {
  const isSmallScreen = useIsWidthLessThan400();

  return (
    <ThemedView
      style={{
        position: "absolute",
        top: isSmallScreen ? 73 : 110,
        zIndex: 90,
        alignSelf: "center",
        width: "90%",
        paddingTop: 16,
        paddingHorizontal: 8,
        paddingBottom: 8,
        borderRadius: 16,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: isSmallScreen ? 16 : 24,
        }}
      >
        <View
          style={{
            height: 36,
            width: 28,
          }}
        >
          <MarkerSimpleComponent />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            paddingHorizontal: 8,
          }}
        >
          <ThemedText
            type={isSmallScreen ? "medium" : "default"}
            style={{ textAlign: "center", color: colorPrimary500 }}
          >
            Indiquez une adresse précise ou {"\n"} déplacez le marqueur sur la
            carte pour {"\n"} définir le lieu de rencontre idéal.
          </ThemedText>
          <ThemedText
            type={isSmallScreen ? "smallText" : "medium"}
            style={{ textAlign: "center", color: colorPrimary400 }}
          >
            Conseil 💡 : privilégiez des lieux facilement {"\n"} repérables et
            accessibles pour tous {"\n"} les participants.
          </ThemedText>
        </View>

        <BaseButton
          type={"brand-solid-secondary"}
          title={"D'accord"}
          onPress={handleCloseInfo}
        />
      </View>
    </ThemedView>
  );
};
