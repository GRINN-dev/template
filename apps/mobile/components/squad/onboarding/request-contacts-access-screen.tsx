import { Alert, Linking, View } from "react-native";
import * as Contacts from "expo-contacts";
import { usePostHog } from "posthog-react-native";

import IconContacts from "@/assets/svg/Icon_Contacts.svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BaseButton } from "@/components/ui/base-button";
import { ContainerButtonSheet } from "@/components/ui/containerButtonSheet";

export const RequestContactsAccessScreen = ({
  handleOnPressNext,
}: {
  handleOnPressNext: () => void;
}) => {
  const posthog = usePostHog();
  const onPressAskPermission = async () => {
    const { status, canAskAgain } = await Contacts.requestPermissionsAsync();
    console.log("status", status);

    posthog?.capture("contacts_permission_set", {
      description: "Permission accès au répertoire",
      properties: { answer: "status " + status },
      tags: ["équipe", "Permission", "Haute"],
      type: "event",
    });
    if (status === "granted") {
      handleOnPressNext();
    } else if (status === "denied" && !canAskAgain) {
      Alert.alert(
        "Accès refusé",
        "Vous devez activer l'accès aux contacts dans les paramètres.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Ouvrir les paramètres",
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  };
  return (
    <ThemedView className="w-full grow">
      <View className="grow items-center justify-center gap-16">
        <IconContacts />
        <View className="gap-3">
          <ThemedText
            className="text-center align-middle text-lg text-primary"
            style={{ fontFamily: "Figtree_700Bold_Italic" }}
          >
            Invitez dès maintenant vos coéquipiers habituels
          </ThemedText>
          <ThemedText className="text-center align-middle text-sm font-medium">
            🔒 Votre vie privée est respectée : FEDER n'accède pas à votre
            répertoire.
          </ThemedText>
        </View>
      </View>
      <ContainerButtonSheet>
        <BaseButton
          title="Accéder à mes contacts"
          type="solid"
          onPress={onPressAskPermission}
        />
      </ContainerButtonSheet>
    </ThemedView>
  );
};
