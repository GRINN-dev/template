import { Pressable, SafeAreaView, Text, View } from "react-native";

import BottomButtonStepper from "./bottom-button-stepper";
import { useOnboardingStore } from "./onboarding-store";
import { onboardingSteps } from "./steps-list";

const OnboardingStepper = () => {
  const onboardingStore = useOnboardingStore();

  return (
    <SafeAreaView className="m-4 flex-1">
      <View className="flex flex-row items-center justify-between">
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
      <View className="flex-1 bg-yellow-100 px-4">
        <View className="flex-1">
          {
            onboardingSteps.find((step) => step.order === onboardingStore.step)
              ?.component
          }
        </View>
        <BottomButtonStepper
          title="Continuer"
          onPress={() => {
            onboardingStore.nextStep();
          }}
          isFixed={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingStepper;
