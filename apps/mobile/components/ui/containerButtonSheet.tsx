import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CardChip } from "../squad/card-chip";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const ContainerButtonSheet = ({
  children,
  classNameStyle,
  title,
  shadow,
  CardChipR,
  CardChipL,
  number,
  backgroundColor = "white",
}: {
  children: React.ReactNode;
  classNameStyle?: string;
  title?: string;
  shadow?: boolean;
  backgroundColor?: string;
  CardChipR?:
    | "equipe"
    | "activite"
    | "publique"
    | "privee"
    | "complete"
    | "places"
    | "terminee"
    | "invitation"
    | "participant";
  CardChipL?:
    | "equipe"
    | "activite"
    | "publique"
    | "privee"
    | "complete"
    | "places"
    | "terminee"
    | "invitation"
    | "participant";
  number?: string;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      className="pt-4"
      style={[
        shadow ? styles.shadow : {},
        {
          backgroundColor: backgroundColor,
          paddingBottom: insets.bottom || 10,
        },
      ]}
    >
      <View className="px-4">
        {title && (
          <ThemedText
            style={{
              textAlign: "center",
            }}
          >
            {title}
          </ThemedText>
        )}

        <ThemedView
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          {CardChipL && <CardChip type={CardChipL} />}
          {CardChipR && <CardChip type={CardChipR} number={number} />}
        </ThemedView>
      </View>
      <View className={`gap-4 px-4 pt-4 ${classNameStyle}`}>{children}</View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: Platform.OS === "ios" ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,1)",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 9,
  },
  infoBulle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
