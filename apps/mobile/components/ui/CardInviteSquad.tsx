import { View } from "react-native";

import SquadBig from "@/assets/svg/SquadBig.svg";
import {
  colorPrimary300,
  colorPrimary500,
  colorSemanticOnDisabledLighter,
} from "@/constants/ColorsFeder";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ContactCard, SimpleContactType } from "../squad/contact-card";
import { ThemedText } from "../ThemedText";
import { BaseButton } from "./base-button";

export const CardInviteSquad = ({
  buttonTitle,
  openInvitation,
  memberSelecteds,
  title,
}: {
  buttonTitle: string;
  openInvitation: () => void;
  title: string;
  memberSelecteds?: SimpleContactType[];
}) => {
  const isSmall = useIsWidthLessThan400();

  return (
    <View
      style={{
        gap: 32,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: colorSemanticOnDisabledLighter,
        borderRadius: 8,
        paddingHorizontal: isSmall ? 12 : 16,
      }}
    >
      <View>
        <ThemedText
          type="sm/brand/semibold"
          style={{
            color: colorPrimary300,
          }}
        >
          {title}
        </ThemedText>
      </View>
      {!memberSelecteds || memberSelecteds.length === 0 ? (
        <View
          style={{
            gap: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 96,
              width: 96,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SquadBig />
          </View>
          <View style={{ gap: 12 }}>
            <ThemedText
              type="lg/brand/semibold"
              style={{
                textAlign: "center",
                color: colorPrimary500,
              }}
            >
              Ajoutez des membres de votre équipe
            </ThemedText>
            <ThemedText
              type="smallText"
              style={{
                textAlign: "center",
                color: colorPrimary500,
              }}
            >
              Choisissez dans votre équipe des participants à inviter
            </ThemedText>
          </View>
        </View>
      ) : (
        <View
          style={{
            gap: 8,
            flex: 1,
          }}
        >
          {memberSelecteds &&
            memberSelecteds.map((contact, i) => (
              <ContactCard
                key={i}
                contact={contact as any}
                onPress={() => {}}
              />
            ))}
        </View>
      )}
      <BaseButton
        title={buttonTitle}
        type={
          memberSelecteds && memberSelecteds.length > 0 ? "outlined" : "solid"
        }
        onPress={openInvitation}
      />
    </View>
  );
};
