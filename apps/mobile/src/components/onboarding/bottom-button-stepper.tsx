// j'ai besoin d'un seul bouton Continuer à la fin de chaque étape d'onboarding
// il doit avoir une props isFixed boolean
// si isFixed est à true le button reste en bas de l'écran sinon il est en bas du contenu

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
    <View className="">
      <View className={isFixed ? "absolute inset-x-0 bottom-2" : ""}>
        <Pressable onPress={onPress} className="rounded-md bg-blue-500 p-2">
          <Text className="text-center font-bold text-white">{title}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BottomButtonStepper;
