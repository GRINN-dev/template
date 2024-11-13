import { View } from "react-native";

import OnboardingStepper from "@/components/onboarding/stepper";

const Onboarding = () => {
  return (
    <View className="flex-1 bg-pink-100">
      <OnboardingStepper buttonIsFixed />
    </View>
  );
};

export default Onboarding;
