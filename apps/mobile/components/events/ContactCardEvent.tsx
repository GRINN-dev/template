import { TouchableOpacity, View } from "react-native";

import useIsWidthLessThan400 from "@/utils/lessThan400";
import { AvatarProfile } from "../profile/avatarProfile";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { UserContactQueryProps } from "./memberList";

export interface SimpleContactTeamType {
  id: string;
  firstname: string;
  lastname?: string;
  phoneNumber?: string;
  email?: string;
  avatar_url?: string;
  osRepertoryPhoneNumber?: string;
  isSelected?: boolean;
}

export const ContactCardEvent = ({
  contact,
  onPress,
  isSelected,
}: {
  contact: NonNullable<UserContactQueryProps["userContacts"]>["nodes"][0];
  onPress: (
    contact: NonNullable<UserContactQueryProps["userContacts"]>["nodes"][0],
  ) => void;
  isSelected: boolean;
}) => {
  const isSmall = useIsWidthLessThan400();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(contact);
      }}
    >
      <View
        className="relative flex-1 flex-row items-center justify-center gap-3"
        style={{
          backgroundColor: "white",
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? "#1F94A3" : "#F9FAFB",
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
        <ThemedView className="flex-row items-center justify-start">
          <AvatarProfile
            firstName={
              contact?.contact?.firstname ? contact?.contact?.firstname : ""
            }
            lastName={
              contact?.contact?.lastname ? contact?.contact?.lastname : ""
            }
            avatarUrl={
              contact?.contact?.avatarUrl ? contact?.contact?.avatarUrl : ""
            }
            border={2}
            size="md"
            fontSize={20}
            selectColor={
              contact?.contact?.avatarColor
                ? contact?.contact?.avatarColor
                : "#FF0000"
            }
            type="default"
          />
        </ThemedView>
        <ThemedView className="flex-1 items-start">
          <ThemedText className="text-lg font-semibold">
            {contact?.contact?.firstname}
          </ThemedText>
          <ThemedText className="text-lg font-semibold">
            {contact?.contact?.lastname}
          </ThemedText>
        </ThemedView>
      </View>
    </TouchableOpacity>
  );
};
