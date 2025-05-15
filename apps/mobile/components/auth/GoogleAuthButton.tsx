import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

import GoogleIcon from "@/assets/svg/googleIcon.svg";
import { CurrentUserQuery } from "@/graphql/current-user";
import { RegisterWithTierAuthMutation } from "@/graphql/mutations/auth";
import { signIn } from "@/utils/gg-sign-in";
import { checkUserRoute } from "@/utils/utils";
import { setStoreItemAsync } from "../../utils/secure-store";
import { client } from "../apollo";

export const GoogleAuthButton = ({ className }: { className?: string }) => {
  const [registerWithTierAuth] = useMutation(RegisterWithTierAuthMutation);
  const [loadingCurrentUser] = useLazyQuery(CurrentUserQuery);
  const router = useRouter();
  const [disabledButton, setDisabledButton] = useState(false);
  const posthog = usePostHog();

  const ggSignIn = async () => {
    setDisabledButton(true);
    try {
      const ggSignIn = await signIn();
      if (!ggSignIn?.userInfo?.idToken) return;
      const res = await registerWithTierAuth({
        variables: {
          profile: JSON.stringify(ggSignIn?.userInfo?.user),
          service: "google",
          token: ggSignIn?.userInfo?.idToken,
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
            properties: { service: "Google", email: data?.currentUser?.email },
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
      setDisabledButton(false);
      console.log("finally");
    }
  };
  return (
    <TouchableOpacity
      className="border-primary-soft100 h-10 w-10 items-center rounded-full border-2 p-2"
      onPress={ggSignIn}
      disabled={disabledButton}
    >
      <GoogleIcon />
    </TouchableOpacity>
  );
};
