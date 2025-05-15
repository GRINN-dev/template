import { Dimensions, Platform, View } from "react-native";

import useIsWidthLessThan400 from "@/utils/lessThan400";

export const CustomFullModal = ({
  children,
  visible,
}: {
  children: React.ReactNode;
  visible: boolean;
}) => {
  const isSmallScreen = useIsWidthLessThan400();
  if (!visible) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        zIndex: 100,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height + 200, // pr certains android où le fond s'arrête avant le bas
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View
        style={{
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          top: isSmallScreen ? 17 : 53,
        }}
      >
        {children}
      </View>
    </View>
  );
};
