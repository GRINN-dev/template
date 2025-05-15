import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useMutation } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

import { AddInMyContacts } from "@/graphql/mutations/user";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { onShare } from "@/utils/utils";
import { AvatarProfile } from "../profile/avatarProfile";
import { ThemedText } from "../ThemedText";
import { ActionButton } from "../ui/action-button";
import { CardChip, chipViewStyles } from "./card-chip";

export interface SimpleContactType {
  id: string | null;
  firstname: string | null;
  lastname?: string | null;
  phoneNumber?: string;
  osRepertoryPhoneNumber?: string;
  isSelected?: boolean | null;
  hasMeInTeam?: boolean | null;
  isFederUser?: boolean | null;
  isInMyTeam?: boolean | null;
  avatarUrl?: string | null;
  avatarColor?: string | null;
  createdAt?: string | null;
  source?: string | null;
  typeChip?: "equipe" | "activite";
}

export const ContactCard = ({
  contact,
  onPress,
  withSelection,
  // isSelected,
}: {
  contact: SimpleContactType;
  onPress: (contact: SimpleContactType) => void;
  withSelection?: boolean;
  // isSelected?: boolean;
}) => {
  // const [isSelectedState, setIsSelected] = useState<boolean>(isSelected ?? false);
  const isSmall = useIsWidthLessThan400();
  const posthog = usePostHog();

  const labelType: keyof typeof chipViewStyles | null =
    contact?.source === "event"
      ? "activite"
      : contact?.source === "contact" || contact?.hasMeInTeam
        ? "equipe"
        : null;

  const [addInMyContacts] = useMutation(AddInMyContacts, {
    variables: {
      userId: contact.id ?? "",
    },
    refetchQueries: ["GetUserContactViews", "GetSuggestions"],
  });

  return (
    <TouchableOpacity
      onPress={() => {
        // if (withSelection) setIsSelected(!isSelected);
        console.log("contact", contact);
        onPress(contact);
      }}
      style={{
        height: isSmall ? 64 : 88,
        width: "100%",
      }}
    >
      <View
        className="relative flex-1 flex-row items-center justify-center gap-3"
        style={{
          backgroundColor: "white",
          borderWidth: contact?.isSelected ? 2 : 1,
          borderColor: contact?.isSelected ? "#1F94A3" : "#F9FAFB",
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
          width: "100%",
          height: isSmall ? 64 : 88,
          padding: isSmall ? 12 : 16,
        }}
      >
        {labelType ? (
          <View className="absolute right-0 top-0 z-40 -mr-2 -mt-2.5">
            <CardChip type={labelType} />
          </View>
        ) : null}
        <View className="flex-row items-center justify-start">
          <AvatarProfile
            firstName={contact?.firstname ? contact?.firstname : ""}
            lastName={contact?.lastname ? contact?.lastname : ""}
            avatarUrl={contact?.avatarUrl ? contact?.avatarUrl : ""}
            border={2}
            size="md"
            fontSize={20}
            selectColor={
              contact?.avatarColor ? contact?.avatarColor : "#FF0000"
            }
            type="default"
          />
        </View>
        <View className="flex-1 items-start">
          <ThemedText className="text-lg font-semibold">
            {contact?.firstname}
          </ThemedText>
          <ThemedText className="text-lg font-semibold">
            {contact?.lastname}
          </ThemedText>
        </View>
        {contact?.source === "contact" || contact?.source === "event" ? (
          <ActionButton
            onPress={() => {
              posthog.capture("add_contact", {
                path: "contact_card",
                link: labelType,
              });
              addInMyContacts();
            }}
            type="Ajouter"
          />
        ) : contact?.source === "pre_registered_contact" ? (
          <ActionButton
            onPress={() => {
              onShare();
              posthog.capture("invite_to_feder", {
                path: "contact_card",
                link: labelType,
              });
            }}
            type="Inviter"
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
