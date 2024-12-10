import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import { client } from "@/components/apollo";
import BottomButtonStepper from "@/components/onboarding/bottom-button-stepper";
import { useOnboardingStore } from "@/components/onboarding/onboarding-store";

interface OnboardingStepperProps {
  buttonIsFixed: boolean;
}

const Step2OnboardingBirthdate = ({
  props,
}: {
  props: OnboardingStepperProps;
}) => {
  const [birthdate, setBirthdate] = useState(new Date(""));
  const onboardingStore = useOnboardingStore();

  const { data: currentUser, error } = useQuery(CurrentUser, {
    fetchPolicy: "cache-and-network",
  });

  console.log(currentUser?.currentUser?.id);
  console.log(error);

  const validateStep = async () => {
    await client
      .mutate({
        mutation: UpdateUser,

        variables: {
          id: currentUser?.currentUser?.id,
          patch: {
            birthday: birthdate,
          },
        },
        refetchQueries: ["currentUser"],
      })
      .catch((error) => {
        console.error(error);
      })
      .then(() => {
        onboardingStore.nextStep();
      });
  };

  return (
    <>
      <ScrollView>
        <View>
          <Text>Date de naissance</Text>
          <TextInput
            className="mb-6 mt-16 h-12 w-full rounded bg-white p-2"
            textContentType="birthdateYear"
            keyboardType="numeric"
            inputMode="numeric"
            placeholder="Année de naissance (AAAA)"
            onChangeText={(text) => setBirthdate(new Date(text))}
          />
          {!props?.buttonIsFixed && (
            <BottomButtonStepper
              title="Continuer"
              onPress={() => {
                validateStep();
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
            validateStep();
          }}
          isFixed={true}
        />
      )}
    </>
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
  mutation updateUser($id: UUID!, $patch: UserPatch = {}) {
    updateUser(input: { id: $id, patch: $patch }) {
      clientMutationId
    }
  }
`);

export default Step2OnboardingBirthdate;
