import { Pressable, Text, View } from "react-native";

interface BottomButtonStepperProps {
  title: string;
  onPress: () => void;
  isFixed: boolean;
}

const BottomButtonStepper = ({
  title,
  onPress,
  isFixed,
}: BottomButtonStepperProps) => {
  return (
    <View className={isFixed ? "absolute inset-x-0 bottom-2" : ""}>
      <Pressable onPress={onPress} className="rounded-md bg-blue-500 p-2">
        <Text className="text-center font-bold text-white">{title}</Text>
      </Pressable>
    </View>
  );
};

export default BottomButtonStepper;
