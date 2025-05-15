import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";

import { HeaderRouter } from "@/components/header/header-router";
import { ThemedView } from "@/components/ThemedView";
import UserComponent from "@/components/user/UserScreen";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { GetPreRegisteredUserById } from "@/graphql/queries-content";

export interface UserProps {
  id: string;
  firstname: string;
  lastname: string;
  gender: "HOMME" | "FEMME" | "AUTRE" | "NOTSPECIFIED" | null;
  avatarUrl?: string;
  phoneNumber: string;
  isInMySquad?: boolean;
}
export default function UserScreen() {
  const { userId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { data: preRegisteredUser } = useQuery(GetPreRegisteredUserById, {
    skip: !userId,
    variables: {
      id: userId as string,
    },
  });
  return (
    <ThemedView
      className="flex-1"
      style={{
        backgroundColor: colorSlate50,
        paddingTop: insets.top,
      }}
    >
      <HeaderRouter title="Détail Profil" borderBottom={false} />
      <UserComponent
        source="pre_registered_contact"
        user={preRegisteredUser?.preRegisteredContact as UserProps}
      />
    </ThemedView>
  );
}
