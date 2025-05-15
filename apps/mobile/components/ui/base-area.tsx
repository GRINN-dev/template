import { View } from "react-native";

import { ThemedView } from "../ThemedView";

export const BaseArea = ({
  children,
  bottom = "bottom-7",
}: {
  children: React.ReactNode;
  bottom?: string;
}) => {
  return <View className={`absolute w-full ${bottom}`}>{children}</View>;
};
