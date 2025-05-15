import { View } from "react-native";

import { colorPrimary300, colorSlate50 } from "@/constants/ColorsFeder";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { AvatarProfile } from "../profile/avatarProfile";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const CardActivityByUser = ({
  firstname,
  lastname,
  avatarColor,
  avatarUrl,
}: {
  firstname: string;
  lastname: string;
  avatarColor: string;
  avatarUrl: string;
}) => {
  const isWidthLessThan400 = useIsWidthLessThan400();

  return (
    <ThemedView
      style={{
        backgroundColor: colorSlate50,
        borderRadius: 8,
        paddingHorizontal: isWidthLessThan400 ? 12 : 16,
        paddingVertical: isWidthLessThan400 ? 8 : 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <ThemedText
          type={isWidthLessThan400 ? "xs/brand/semibold" : "sm/brand/semibold"}
          style={{
            color: colorPrimary300,
          }}
        >
          Proposée par
        </ThemedText>
        <ThemedText
          type={
            isWidthLessThan400 ? "sm/brand/semibold" : "base/brand/semibold"
          }
        >
          {firstname} {lastname}
        </ThemedText>
      </View>
      <AvatarProfile
        selectColor={avatarColor ?? "#FF0000"}
        firstName={firstname ?? ""}
        lastName={lastname ?? ""}
        size="sm"
        border={2}
        type="default"
        fontSize={20}
        avatarUrl={avatarUrl ?? ""}
      />
    </ThemedView>
  );
};
