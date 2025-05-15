import { useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

import ApplIcon from "@/assets/svg/appleIcon.svg";
import { CurrentUserQuery } from "@/graphql/current-user";
import { RegisterWithTierAuthMutation } from "@/graphql/mutations/auth";
import { checkUserRoute } from "@/utils/utils";
import { setStoreItemAsync } from "../../utils/secure-store";
import { client } from "../apollo";

export const AppleAuthButton = () => {
  const [registerWithTierAuth] = useMutation(RegisterWithTierAuthMutation);
  const [loadingCurrentUser] = useLazyQuery(CurrentUserQuery);
  const router = useRouter();
  const [disabledButton, setDisabledButton] = useState(false);
  const posthog = usePostHog();

  const appleSignIn = async (creds: any) => {
    try {
      const userInfo = {
        ...creds?.fullName,
        email: creds?.email,
        id: creds?.user,
      };
      const res = await registerWithTierAuth({
        variables: {
          profile: JSON.stringify(userInfo),
          service: "apple",
          token: creds?.identityToken,
        },
      });
      if (
        res?.data?.registerWithTierAuth?.accessToken &&
        res?.data?.registerWithTierAuth?.refreshToken
      ) {
        await setStoreItemAsync(
          "access_token",
          res.data.registerWithTierAuth.accessToken,
        );
        await setStoreItemAsync(
          "refresh_token",
          res.data.registerWithTierAuth.refreshToken,
        );
        await client.clearStore();
        const { data } = await loadingCurrentUser();

        if (data?.currentUser?.profileValidated) {
          posthog?.capture("Login", {
            description: "Login",
            properties: { service: "Apple", email: data?.currentUser?.email },
            tags: ["Auth / Login", "Fin inscription", "Haute"],
            type: "event",
          });
        } else {
          posthog?.capture("signup_completed", {
            description: "Inscription complète avec succès",
            properties: { service: "Apple", email: data?.currentUser?.email },
            tags: ["Auth / Login", "Fin inscription", "Haute"],
            type: "event",
          });
        }
        const url = checkUserRoute(data);
        router.push(url);
      }
    } catch (e) {
      console.log("error", e);
    } finally {
      console.log("finally");
    }
  };
  const theme = useColorScheme() ?? "light";

  const onPressLoginApple = async () => {
    if (disabledButton) return;
    setDisabledButton(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential) {
        await appleSignIn(credential);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <TouchableOpacity
      className="border-primary-soft100 h-10 w-10 items-center rounded-full border-2 p-2"
      onPress={onPressLoginApple}
    >
      <ApplIcon height={20} color={theme === "light" ? "black" : "white"} />
    </TouchableOpacity>
  );
};
