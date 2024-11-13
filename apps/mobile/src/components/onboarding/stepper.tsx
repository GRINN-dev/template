import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import { client } from "../apollo";
import BottomButtonStepper from "./bottom-button-stepper";
import { useOnboardingStore } from "./onboarding-store";
import { onboardingSteps } from "./steps-list";

interface OnboardingStepperProps {
  buttonIsFixed: boolean;
}

const OnboardingStepper = (props: OnboardingStepperProps) => {
  const onboardingStore = useOnboardingStore();
  const {
    data: currentUser,
    loading,
    //  error,
  } = useQuery(CurrentUser, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleUpdateUser = async () => {
    if (onboardingStore?.step === 2) {
      await client.mutate({
        mutation: UpdateUser,
        variables: {
          input: {
            id: currentUser?.currentUser?.id,
            patch: {
              username: "test",
            },
          },
        },
      });
    } else if (onboardingStore?.step === 3) {
      await client.mutate({
        mutation: UpdateUser,
        variables: {
          input: {
            id: currentUser?.currentUser?.id,
            patch: {
              username: "test",
            },
          },
        },
      });
    }
  };
  return (
    <SafeAreaView className="m-4 flex-1">
      <ScrollView className="relative">
        <View className="flex-row items-center justify-between">
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
          {
            onboardingSteps.find((step) => step.order === onboardingStore.step)
              ?.component
          }
        </View>
        {!props.buttonIsFixed && (
          <BottomButtonStepper
            title="Continuer"
            onPress={() => {
              handleUpdateUser();
            }}
            isFixed={false}
          />
        )}
      </ScrollView>
      {props.buttonIsFixed && (
        <BottomButtonStepper
          title="Continuer"
          onPress={() => {
            handleUpdateUser();
          }}
          isFixed={false}
        />
      )}
    </SafeAreaView>
  );
};
const CurrentUser = graphql(`
  query currentUser {
    currentUser {
      id
      username
    }
  }
`);

const UpdateUser = graphql(`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        username
      }
      clientMutationId
    }
  }
`);

export default OnboardingStepper;
