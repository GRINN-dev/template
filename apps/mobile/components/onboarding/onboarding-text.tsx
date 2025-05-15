import { Text, View } from "react-native";

interface OnboardingTextProps {
  title: string;
  content: string;
}

export const OnboardingText = ({ title, content }: OnboardingTextProps) => {
  return (
    <View className="flex-col items-center justify-center gap-4 px-4">
      <Text className="text-center text-3xl font-semibold italic leading-9">
        {title}
      </Text>
      <Text className="mt-4 text-center text-lg font-medium leading-7 text-[#545F66]">
        {content}
      </Text>
    </View>
  );
};
