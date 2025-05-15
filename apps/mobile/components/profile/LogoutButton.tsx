import { useRouter } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import { useLazyQuery, useMutation } from "@apollo/client";

import { CurrentUserQuery } from "@/graphql/current-user";
import { LogoutMutation } from "@/graphql/mutations/auth";
import { BaseButton } from "../ui/base-button";

export function LogoutButton() {
  const router = useRouter();
  const [logout] = useMutation(LogoutMutation, {
    fetchPolicy: "network-only",
  });
  const [getCurrentUser] = useLazyQuery(CurrentUserQuery, {
    fetchPolicy: "network-only",
  });

  const callLogout = async () => {
    const { data: logoutdata } = await logout();
    console.log("Logout data", logoutdata);
    if (logoutdata?.logout?.success) {
      await deleteItemAsync("access_token");
      await deleteItemAsync("refresh_token");
      const { data } = await getCurrentUser();
      if (data?.currentUser?.id) {
        console.log("User is still logged in :", data?.currentUser?.id);
      } else {
        router?.push("/login");
        console.log("User is logged out");
      }
    }
  };
  return (
    <BaseButton
      type="destructive"
      title="Déconnexion"
      onPress={() => callLogout()}
    />
  );
}
