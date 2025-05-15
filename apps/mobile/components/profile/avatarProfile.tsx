import { Image, View } from "react-native";

import Avatar from "@/assets/svg/avatar.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { darkenColor, hexToRgba } from "@/utils/utils";
import { ThemedText } from "../ThemedText";

export const AvatarProfile = ({
  selectColor = "#FF0000",
  firstName,
  lastName,
  size,
  fontSize = 60,
  border = 6,
  type = "title",
  avatarUrl,
}: {
  selectColor?: string;
  firstName: string;
  lastName?: string;
  size?: "sm" | "md" | "lg";
  fontSize?: number;
  border?: number;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "error";

  avatarUrl?: string;
}) => {
  const isSmall = useIsWidthLessThan400();
  return (
    <View className="rounded-full bg-white">
      {!avatarUrl ? (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            height: size === "lg" ? 128 : isSmall ? 40 : 40,
            width: size === "lg" ? 128 : isSmall ? 40 : 40,
            justifyContent: "center",
            backgroundColor: selectColor
              ? hexToRgba(selectColor, 0.2)
              : "rgba(241, 245, 249, 1)",
            borderRadius: size === "sm" ? 40 : 100,
            opacity: 1,
            borderWidth: border,
            borderColor: selectColor,
          }}
        >
          {firstName ? (
            <ThemedText
              type={type}
              style={{
                color: darkenColor(selectColor, 0.2),
                fontSize: fontSize,
                lineHeight: fontSize,
                fontWeight: "bold",
                textAlign: "center",
                textAlignVertical: "center",
                includeFontPadding: false,
                alignSelf: "center",
                marginTop: 5,
              }}
            >
              {firstName[0].toUpperCase() + lastName?.[0]?.toUpperCase()}
            </ThemedText>
          ) : (
            <Avatar
              width={size === "lg" ? 66.67 : size === "md" ? 56 : 40}
              height={size === "lg" ? 66.67 : size === "md" ? 56 : 40}
              color={darkenColor(selectColor, 0.2)}
            />
          )}
        </View>
      ) : (
        <Image
          source={{ uri: avatarUrl }}
          style={{
            width: size === "sm" ? 40 : size === "md" ? 56 : 128,
            height: size === "sm" ? 40 : size === "md" ? 56 : 128,
            borderRadius: size === "sm" ? 40 : 100,
            borderWidth: border,
            borderColor: "rgba(221, 223, 224, 1)",
          }}
        />
      )}
    </View>
  );
};
