import { Pressable, SafeAreaView, Text, View } from "react-native";

import { useOnboardingStore } from "./onboarding-store";
import { onboardingSteps } from "./steps-list";

const OnboardingStepper = () => {
  const onboardingStore = useOnboardingStore();

  return (
    <SafeAreaView>
      <View className="mx-4 flex flex-row items-center justify-between">
        <Pressable
          onPress={() => {
            onboardingStore.previousStep();
          }}
          className="rounded-md bg-blue-500 p-2"
        >
          <Text>Previous</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            onboardingStore.nextStep();
          }}
          className="rounded-md bg-blue-500 p-2"
        >
          <Text>Next</Text>
        </Pressable>
      </View>

      <Text>{onboardingStore?.step}</Text>
      <Text>Onboarding Stepper</Text>
      {
        onboardingSteps.find((step) => step.order === onboardingStore.step)
          ?.component
      }
    </SafeAreaView>
  );
};

export default OnboardingStepper;
