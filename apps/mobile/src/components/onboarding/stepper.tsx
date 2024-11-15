import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

// import { graphql } from "@grinn/graphql";

import BottomButtonStepper from "./bottom-button-stepper";
import { useOnboardingStore } from "./onboarding-store";
import { onboardingSteps } from "./steps-list";

// import { useQuery } from "@apollo/client";

interface OnboardingStepperProps {
  buttonIsFixed: boolean;
}

const OnboardingStepper = (props: OnboardingStepperProps) => {
  const onboardingStore = useOnboardingStore();
  // const { data: currentUser } = useQuery(CurrentUser, {
  //   fetchPolicy: "network-only",
  // });

  return (
    <SafeAreaView className="m-4 flex-1">
      <View className="relative flex-1">
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
        {/* {!props.buttonIsFixed && (
          <BottomButtonStepper
            title="Continuer"
            onPress={() => {
              // onboardingSteps
              //   .find((step) => step.order === onboardingStore.step)
              //   ?.onValidate?.(currentUser?.currentUser?.id, {});
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
      )} */}
      </View>
    </SafeAreaView>
  );
};

// const CurrentUser = graphql(`
//   query currentUser {
//     currentUser {
//       id
//       username
//     }
//   }
// `);
export default OnboardingStepper;
