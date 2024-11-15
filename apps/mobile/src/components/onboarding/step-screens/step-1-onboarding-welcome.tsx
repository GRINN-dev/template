import { ScrollView, Text, View } from "react-native";

import BottomButtonStepper from "@/components/onboarding/bottom-button-stepper";
import { useOnboardingStore } from "@/components/onboarding/onboarding-store";

interface OnboardingStepperProps {
  buttonIsFixed: boolean;
}
const Step1OnboardingWelcome = ({
  props,
}: {
  props: OnboardingStepperProps;
}) => {
  const onboardingStore = useOnboardingStore();

  return (
    <>
      <ScrollView>
        <View className="flex flex-col items-center justify-center gap-2 px-4 py-6">
          <Text>Bienvenue !</Text>
          <Text>
            rem ipsum, dolor sit amet consectetur adipisicing elit. Iure, rerum
            unde... Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Iure, rerum unde...Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor
            sit amet consectetur adipisicing elit. Iure, rerum unde...Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Iure, rerum
            unde...Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Iure, rerum unde... Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Iure, rerum unde... Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor
            sit amet consectetur adipisicing elit. Iure, rerum unde...Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Iure, rerum
            unde...Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Iure, rerum unde...Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Iure, rerum unde... Lorem ipsum, dolor
            sit amet consectetur adipisicing elit. Iure, rerum unde... Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Iure, rerum
            unde...Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Iure, rerum unde...Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor
            sit amet consectetur adipisicing elit. Iure, rerum unde...Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Iure, rerum
            unde... Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Iure, rerum unde... Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Iure, rerum unde...Lorem ipsum, dolor
            sit amet consectetur adipisicing elit. Iure, rerum unde...Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Iure, rerum
            unde...Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Iure, rerum unde...Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Iure, rerum unde... Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Iure, rerum unde... Lorem ipsum, dolor
            sit amet consectetur adipisicing elit.
          </Text>
          {!props?.buttonIsFixed && (
            <BottomButtonStepper
              title="Continuer"
              onPress={() => {
                onboardingStore.nextStep();
              }}
              isFixed={false}
            />
          )}
        </View>
      </ScrollView>
      {props?.buttonIsFixed && (
        <BottomButtonStepper
          title="Continuer"
          onPress={() => {
            onboardingStore.nextStep();
          }}
          isFixed={true}
        />
      )}
    </>
  );
};

export default Step1OnboardingWelcome;
