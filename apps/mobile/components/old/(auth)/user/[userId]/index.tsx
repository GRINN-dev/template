import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";

import { HeaderRouter } from "@/components/header/header-router";
import { ThemedView } from "@/components/ThemedView";
import UserComponent from "@/components/user/UserScreen";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { GetUserById } from "@/graphql/queries-content";

interface UserProps {
  id: string;
  firstname: string;
  lastname: string;
  avatarUrl: string;
  phoneNumber: string;
  isInMySquad: boolean;
  gender: "HOMME" | "FEMME" | "AUTRE" | "NOTSPECIFIED" | null;
  source: string;
}

export default function UserScreen() {
  const { userId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { data: user } = useQuery(GetUserById, {
    variables: {
      id: userId as string,
    },
    skip: !userId,
    fetchPolicy: "network-only",
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
      {user?.user ? (
        <UserComponent user={user?.user as UserProps} source="user" />
      ) : (
        <ActivityIndicator />
      )}
    </ThemedView>
  );
}
