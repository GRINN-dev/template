import { Text, View } from "react-native";

import RedEllipse from "@/assets/svg/red-ellipse.svg";

export const chipViewStyles = {
  equipe: "bg-[#1F94A3]",
  activite: "bg-[#F3A712] ",
  publique: "bg-[#D1FAE5] border border-[#10B981]",
  privee: "bg-[#FEF3C7] border border-[#F59E0B]",
  complete: "bg-[#FEE2E2] border border-[#EF4444] ",
  places: "bg-[#E0F2FE] border border-[#0EA5E9]",
  terminee: "bg-[#DDDFE0]  border border-[#545F66]",
  invitation:
    "bg-[#FFF1F2] border border-[#F43F5E] flex flex-row items-center gap-2",
  participant: "bg-[#E0F2FE] border border-[#0EA5E9]",
};

const chipTextStyles = {
  equipe: "text-white",
  activite: "text-white",
  publique: "text-[#047857]",
  privee: "text-[#B45309] ",
  complete: "text-[#B91C1C]",
  places: "text-[#0369A1]",
  terminee: "text-[#32393D]",
  invitation: "text-[#F43F5E]",
  participant: "text-[#0369A1]",
};

const chipContent = {
  equipe: "Vous êtes dans son équipe !",
  activite: "Activité en commun",
  publique: "Publique",
  privee: "Privée",
  complete: "Complète",
  places: "places réservées",
  terminee: "Terminée",
  invitation: "Invitation",
  participant: "participant",
};

export const CardChip = ({
  type,
  number,
}: {
  type: keyof typeof chipViewStyles;
  number?: string;
}) => {
  return (
    <View
      className={`${chipViewStyles[type]} flex-row items-center justify-end gap-2 rounded-full px-[12px] py-[2px]`}
    >
      {type === "invitation" && <RedEllipse />}
      <Text
        className={`${chipTextStyles[type]}`}
        style={{
          fontFamily: "Figtree_700Bold_Italic",
          fontSize: 12,
          lineHeight: 16,
        }}
      >
        {number ? <Text>{number} </Text> : null}
        {type === "places" && number === "1"
          ? "place réservée"
          : chipContent[type]}
      </Text>
    </View>
  );
};
