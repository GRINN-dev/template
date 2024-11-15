import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import { client } from "@/components/apollo";
import { useOnboardingStore } from "@/components/onboarding/onboarding-store";
import BottomButtonStepper from "../bottom-button-stepper";

interface OnboardingStepperProps {
  buttonIsFixed: boolean;
}
const Step3PhoneNumber = (props: { props: OnboardingStepperProps }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [show, setShow] = useState(false);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
  };
  const onboardingStore = useOnboardingStore();

  const { data: currentUser } = useQuery(CurrentUser, {
    fetchPolicy: "cache-and-network",
  });

  const validateStep = async () => {
    await client
      .mutate({
        mutation: UpdateUser,
        variables: {
          id: currentUser?.currentUser?.id,
          patch: {
            phoneNumber: phoneNumber,
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
          <Text>Numéro de téléphone</Text>
          <View className="mt-6 flex flex-row items-center justify-center">
            <View className="flex flex-row items-center">
              <TouchableOpacity
                onPress={() => setShow(true)}
                className="flex h-[56px] w-[119px] flex-row items-center justify-center gap-2 rounded-l-md bg-[#E2E8F0]"
              >
                <Text className="text-['#64748B']">
                  {countryCode ? countryCode : "+ 33"}
                </Text>
                <Text className="text-['#64748B']">▼</Text>
              </TouchableOpacity>
              <View>
                <CountryPicker
                  show={show}
                  onBackdropPress={() => setShow(false)}
                  // showOnly={["FR", "BE", "CH", "LU"]}
                  pickerButtonOnPress={(item) => {
                    setCountryCode(item.dial_code);
                    setShow(false);
                  }}
                  inputPlaceholder="Rechercher une ville"
                  lang="fr"
                  style={{
                    modal: {
                      maxHeight: 300,
                    },
                  }}
                />
              </View>
            </View>
            <TextInput
              className="my-10 h-[56px] w-[216px] rounded-r-md border-l-transparent bg-white p-2"
              textContentType="telephoneNumber"
              keyboardType="numeric"
              inputMode="numeric"
              placeholder="6 12 34 56 78"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
            />
            {!props?.props?.buttonIsFixed && (
              <BottomButtonStepper
                title="Continuer"
                onPress={() => {
                  validateStep();
                }}
                isFixed={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
      {props?.props?.buttonIsFixed && (
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

export default Step3PhoneNumber;
