import { Platform, Text } from "react-native";

import { ThemedView } from "../ThemedView";
import { AppleAuthButton } from "./AppleAuthButton";
import { GoogleAuthButton } from "./GoogleAuthButton";

export const TierAuthSection = ({ title }: { title: string }) => {
  return (
    <ThemedView className="flex flex-row items-center justify-between gap-6 rounded-full border border-primary p-1 pl-4">
      <Text
        style={{
          padding: 10,
        }}
        className="font-inter font-weight-500 text-base text-primary"
      >
        {title}
      </Text>
      <ThemedView className="flex flex-row items-center justify-center gap-4 rounded-full">
        {Platform.OS === "ios" ? <AppleAuthButton /> : null}
        <GoogleAuthButton />
      </ThemedView>
    </ThemedView>
  );
};
