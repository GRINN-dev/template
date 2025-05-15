import { TouchableOpacity } from "react-native";

import InviteIcon from "@/assets/svg/inviteIcon.svg";
import PlusIcon from "@/assets/svg/plusIcon.svg";
import { ThemedText } from "../ThemedText";

interface ActionButtonProps {
  type: "Ajouter" | "Inviter";
  onPress: () => void;

  disabled?: boolean;
}

export const ActionButton = ({
  type,
  onPress,

  disabled,
}: ActionButtonProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center gap-2 rounded-full border border-[#1F94A3] px-4 py-2"
      onPress={onPress}
      disabled={disabled}
    >
      {type === "Ajouter" ? <PlusIcon /> : <InviteIcon />}
      <ThemedText type="medium" className="!text-[#1F94A3]">
        {type === "Ajouter" ? "Ajouter" : "Inviter"}
      </ThemedText>
    </TouchableOpacity>
  );
};
