import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import BottomButtonStepper from "./bottom-button-stepper";
import { useOnboardingStore } from "./onboarding-store";
import { onboardingSteps } from "./steps-list";

interface OnboardingStepperProps {
  buttonIsFixed: boolean;
}

const OnboardingStepper = (props: OnboardingStepperProps) => {
  const onboardingStore = useOnboardingStore();

  return (
    <SafeAreaView className="m-4 flex-1">
      <ScrollView className="relative">
        <View className="flex-row items-center justify-between py-4">
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
        <View className="flex-1 bg-yellow-100 p-4">
          {
            onboardingSteps.find((step) => step.order === onboardingStore.step)
              ?.component
          }
        </View>
        {!props.buttonIsFixed && (
          <BottomButtonStepper
            title="Continuer"
            onPress={() => {
              onboardingStore.nextStep();
            }}
            isFixed={false}
          />
        )}
      </ScrollView>
      {props.buttonIsFixed && (
        <BottomButtonStepper
          title="Continuer"
          onPress={() => {
            onboardingStore.nextStep();
          }}
          isFixed={false}
        />
      )}
    </SafeAreaView>
  );
};

export default OnboardingStepper;
