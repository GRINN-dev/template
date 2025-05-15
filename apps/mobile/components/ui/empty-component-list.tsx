import { Text, View } from "react-native";

import IconTeamLight from "@/assets/svg/iconTeamLight.svg";
import { ThemedView } from "../ThemedView";

interface EmptyListTextProps {
  title: string;
  content: string;
}
export const EmptyComponentList = ({ title, content }: EmptyListTextProps) => {
  return (
    <ThemedView className="!bg-surface flex-1 items-center justify-center space-y-8">
      <ThemedView className="!bg-surface mt-20 md:mt-36">
        <IconTeamLight width={96} height={96} />
      </ThemedView>
      <ThemedView className="!bg-surface mt-8">
        <View className="max-w-[265px] flex-col items-center justify-center gap-4">
          <Text className="text-center text-lg font-semibold italic leading-9">
            {title}
          </Text>
          <Text className="mt-4 text-center text-sm font-medium leading-5 text-[#545F66]">
            {content}
          </Text>
        </View>
      </ThemedView>
    </ThemedView>
  );
};
