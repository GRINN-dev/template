import { Pressable, Text, View } from "react-native";

import { useOnboardingStore } from "./onboarding-store";
import { onboardingSteps } from "./steps-list";

const OnboardingStepper = () => {
  const onboardingStore = useOnboardingStore();

  return (
    <View>
      <Pressable
        onPress={() => {
          onboardingStore.previousStep();
        }}
      >
        <Text>Previous</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          onboardingStore.nextStep();
        }}
      >
        <Text>Next</Text>
      </Pressable>
      <Text>{onboardingStore?.step}</Text>
      <Text>Onboarding Stepper</Text>
      {
        onboardingSteps.find((step) => step.order === onboardingStore.step)
          ?.component
      }
    </View>
  );
};

export default OnboardingStepper;
