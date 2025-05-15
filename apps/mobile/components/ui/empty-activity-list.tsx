import { Text, View } from "react-native";
import { router } from "expo-router";

import CalendarNoResultDark from "@/assets/svg/calendarNoResultDark.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { BaseButton } from "./base-button";

interface EmptyListTextProps {
  title: string;
  content: string;
}
export const EmptyActivityList = ({ title, content }: EmptyListTextProps) => {
  const isWidthLessThan400 = useIsWidthLessThan400();
  return (
    <View
      className={`mb-20 flex-1 flex-col justify-center ${isWidthLessThan400 ? "gap-8" : "gap-20"} `}
    >
      <View className="bg- max-w-[361px] items-center">
        <View className="bg-surface">
          <CalendarNoResultDark width={160} height={160} color={"#1F94A3"} />
        </View>
        <Text className="text-center text-lg font-bold italic leading-9">
          {title}
        </Text>
        <Text className="text-center text-sm font-medium leading-5 text-[#545F66]">
          {content}
        </Text>
      </View>
      <View className="mb-10 w-full flex-col items-center justify-center gap-4">
        <BaseButton
          title="Explorer les activités"
          type="outlined"
          onPress={() => router.push("/(auth)/(tabs)/events")}
        />
        <BaseButton
          title="Créer une activité"
          type="solid"
          onPress={() => router.push("/event-edition/event-edition")}
        />
      </View>
    </View>
  );
};
