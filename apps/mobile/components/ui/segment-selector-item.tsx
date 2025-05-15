import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface SegmentSelectorItemProps {
  title: string;
  onPress: () => void;
  selected: boolean;
  hasNotification?: boolean;
}

export const SegmentSelectorItem = ({
  title,
  onPress,
  selected,
  hasNotification = false,
}: SegmentSelectorItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center rounded-full border py-2 ${
        selected ? "border-[#1F94A3] bg-white" : "border-[#BBBFC2] bg-white"
      }`}
    >
      <Text
        className={`text-lg font-semibold ${selected ? "text-[#1F94A3]" : "text-[#BBBFC2]"}`}
      >
        {title}
      </Text>
      {hasNotification && <NotificationDot />}
    </TouchableOpacity>
  );
};

const NotificationDot = () => {
  return (
    <View className="absolute right-4 top-2 h-[8px] w-[8px] rounded-full bg-[#EF4444]" />
  );
};

interface SegmentSelectorProps {
  items: { title: string; selected: boolean; hasNotification?: boolean }[];
  onSelect: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  borderBottom?: boolean;
}

export const SegmentSelector = ({
  items,
  onSelect,
  borderBottom,
}: SegmentSelectorProps) => {
  return (
    <View
      className={`flex-row gap-2 pb-4 pt-2 ${borderBottom ? "border-b border-[#A5D4DA]" : ""}`}
    >
      {items.map((item, index) => (
        <SegmentSelectorItem
          key={index}
          title={item.title}
          selected={item.selected}
          onPress={() => onSelect(index)}
          hasNotification={item.hasNotification}
        />
      ))}
    </View>
  );
};
