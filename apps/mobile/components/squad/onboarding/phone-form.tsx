import { useState } from "react";
import { View } from "react-native";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BaseButton } from "@/components/ui/base-button";
import { ContainerButtonSheet } from "@/components/ui/containerButtonSheet";
import { CustomNumberInput } from "@/components/ui/squad-onboarding/custom-number-input";
import { CurrentUserQuery } from "@/graphql/current-user";
import { UpdateMyPhoneNumberMutation } from "@/graphql/mutations/auth";
import { CheckPhoneNumber } from "@/graphql/queries-content";

export const PhoneForm = ({
  handleOnPressNext,
}: {
  handleOnPressNext: () => void;
}) => {
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [countryCode, setCountryCode] = useState("+33");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const { data: currentUserData } = useQuery(CurrentUserQuery, {
    onCompleted: (data) => {
      if (data?.currentUser?.phoneNumber) {
        setTimeout(() => {
          setPhoneNumberInput("0" + data?.currentUser?.phoneNumber?.slice(-9));
        }, 50);
      }
    },
  });
  const [updateMyPhone, { loading }] = useMutation(UpdateMyPhoneNumberMutation);
  const [
    checkPhoneNumber,
    { loading: loadingCheckPhoneNumber, data: usedPhoneNumQuery },
  ] = useLazyQuery(CheckPhoneNumber);

  const handleChangeText = async (text: string) => {
    setPhoneNumberInput(text);
    if (text.length === 10) {
      checkPhoneNumber({
        variables: {
          phoneNumber: countryCode + text.substring(1),
        },
      });
    }
  };

  const submit = async () => {
    if (!currentUserData?.currentUser?.id) return;
    if (phoneNumberInput.length === 10) {
      await updateMyPhone({
        variables: {
          input: {
            pPhoneNumber: countryCode + phoneNumberInput?.substring(1),
          },
        },
        refetchQueries: ["CurrentUser"],
      });
      handleOnPressNext();
      return;
    }
  };

  return (
    <View className="grow">
      <ThemedView className="grow justify-center gap-12 px-4">
        {/* country Picker view */}
        {/* <ThemedView className="flex flex-row items-center">
        <TouchableOpacity
          onPress={() => setShowCountryPicker(true)}
          className="flex max-h-[56px] min-h-[56px] min-w-[119px] max-w-[119px] flex-row items-center justify-center gap-2 rounded-l-md bg-[#E2E8F0]"
        >
          <ThemedText className="text-['#64748B']">
            {countryCode ? countryCode : "+ 33"}
          </ThemedText>
        </TouchableOpacity>
        <ThemedView>
          <CountryPicker
            show={showCountryPicker}
            onBackdropPress={() => setShowCountryPicker(false)}
            // showOnly={["FR", "BE", "CH", "LU"]}
            pickerButtonOnPress={(item) => {
              setCountryCode(item.dial_code);
              setShowCountryPicker(false);
            }}
            inputPlaceholder="Rechercher une ville"
            lang="fr"
            style={{
              modal: {
                maxHeight: 300,
              },
            }}
          />
        </ThemedView>
      </ThemedView> */}
        <CustomNumberInput
          value={phoneNumberInput}
          editable={!loading}
          onChange={handleChangeText}
          onSubmit={submit}
          inputLength={10}
        />
        {usedPhoneNumQuery?.users?.totalCount > 0 ? (
          <ThemedText style={{ color: "red", textAlign: "center" }}>
            Ce numéro de téléphone est déjà utilisé par un autre utilisateur.
          </ThemedText>
        ) : null}
        <View className="gap-3">
          <ThemedText
            className="text-center align-middle text-lg text-primary"
            style={{ fontFamily: "Figtree_700Bold_Italic" }}
          >
            Pour retrouver facilement vos contacts, validez votre numéro de
            téléphone
          </ThemedText>
          <ThemedText className="text-center align-middle text-sm font-medium">
            🔒 Votre numéro reste protégé : il ne sera jamais partagé ni visible
            des autres utilisateurs et sera sécurisé selon les normes RGPD.
          </ThemedText>
        </View>
      </ThemedView>
      <ContainerButtonSheet>
        <BaseButton
          title="Plus tard"
          type="outlined"
          onPress={handleOnPressNext}
        />
        <BaseButton
          title="Valider mon numéro"
          type="solid"
          onPress={submit}
          disable={
            loadingCheckPhoneNumber || usedPhoneNumQuery?.users?.totalCount > 0
          }
        />
      </ContainerButtonSheet>
    </View>
  );
};
