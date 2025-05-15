import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BaseButton } from "@/components/ui/base-button";
import { ContainerButtonSheet } from "@/components/ui/containerButtonSheet";
import { CustomNumberInput } from "@/components/ui/squad-onboarding/custom-number-input";
import { CurrentUserQuery } from "@/graphql/current-user";
import { SendVerificationCodeMutation } from "@/graphql/mutations/auth";

export const PhoneCodeForm = ({
  handleOnPressNext,
}: {
  handleOnPressNext: () => void;
}) => {
  const posthog = usePostHog();

  const [phoneCodeInput, setPhoneCodeInput] = useState("");
  const { data: currentUserData } = useQuery(CurrentUserQuery);
  const [sendVerificationCode] = useMutation(SendVerificationCodeMutation);
  const [loadingValidation, setLoadingValidation] = useState(false);
  const [errorCodeValidation, setErrorCodeValidation] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const onPressFakeInput = () => {
    inputRef.current?.focus();
  };

  const handleChangeText = async (text: string) => {
    setPhoneCodeInput(text);
    if (text.length === 6) {
      submit();
    }
  };

  const submit = async () => {
    if (phoneCodeInput.length === 6) {
      setLoadingValidation(true);
      // Le code est invalide, reset code et message d'erreur
      if (currentUserData?.currentUser?.id) {
        const { data } = await sendVerificationCode({
          variables: {
            code: phoneCodeInput,
          },
          refetchQueries: ["CurrentUser"],
        });

        if (data?.validateCode?.result) {
          posthog?.capture("phone_verified", {
            description: "Numéro de téléphone vérifié",
            properties: [{ email: data?.currentUser?.email }],
            tags: ["Auth / Login", "SMSValidation", "Haute"],
            type: "event",
          });
          handleOnPressNext();
          return;
        } else {
          posthog?.capture("phone_verification_failed", {
            description: "échec de vérification du téléphone",
            properties: { error: data?.validateCode?.error },
            tags: ["Auth / Login", "SMSValidation", "Moyenne"],
            type: "event",
          });
          setErrorCodeValidation("Code invalide");
        }
        setLoadingValidation(false);
      }
      return;
    }
  };

  return (
    <ThemedView className="flex-1">
      <View className="grow items-center justify-center gap-16 px-4">
        <CustomNumberInput
          value={phoneCodeInput}
          editable={!loadingValidation}
          onChange={handleChangeText}
          onSubmit={submit}
          inputLength={6}
        />
        <View className="gap-3">
          <ThemedText
            className="text-center align-middle text-lg text-primary"
            style={{ fontFamily: "Figtree_700Bold_Italic" }}
          >
            Vous y êtes presque !
          </ThemedText>
          <ThemedText className="text-center align-middle text-sm font-medium">
            Renseignez le code reçu par SMS
          </ThemedText>
        </View>
      </View>
      <ContainerButtonSheet>
        <BaseButton title="Valider le code" type="solid" onPress={submit} />
      </ContainerButtonSheet>
    </ThemedView>
  );
};
