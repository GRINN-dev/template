import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { client } from "@/components/apollo";
import { CurrentUserQuery } from "@/graphql/current-user";
import { LoginMutation, RegisterMutation } from "@/graphql/mutations/auth";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { setStoreItemAsync } from "@/utils/secure-store";
import { InputField } from "../form/InputField";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "../ui/base-button";
import { TierAuthSection } from "./TierAuthSection";

const getLoginFormSchema = (type: "login" | "register") => {
  // const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  //   if (issue.code === z.ZodIssueCode.) {
  //     if (issue.expected === "string") {
  //       return { message: "bad type!" };
  //     }
  //   }
  //   if (issue.code === z.ZodIssueCode.custom) {
  //     return { message: `less-than-${(issue.params || {}).minimum}` };
  //   }
  //   return { message: ctx.defaultError };
  // };

  // z.setErrorMap(customErrorMap);

  return z
    .object({
      email: z
        .string({
          required_error: "Email requis",
        })
        .email({ message: "Email invalide" }),
      password: z
        .string({
          required_error: "Mot de passe requis",
        })
        .min(8, { message: "Au moins 8 caractères" }),
      confirmPassword:
        type === "register"
          ? z
              .string({
                required_error: "Confirmeation requise",
              })
              .min(8, { message: "Au moins 8 caractères" })
          : z.undefined(),
    })
    .refine(
      (data) => {
        if (type === "register") {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
      },
    );
};

export const LoginForm = ({ type }: { type: "login" | "register" }) => {
  const insets = useSafeAreaInsets();
  const isSmall = useIsWidthLessThan400();

  const posthog = usePostHog();
  useEffect(() => {
    if (posthog) {
      if (type !== "login") {
        posthog?.capture("signup_started", {
          description: "Début du processus d'inscription",
          source: "mobile",
          method: "email",
          tags: ["Auth / Login", "Accueil / Inscription", "Haute"],
        });
      }
    }
  }, [posthog]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getLoginFormSchema(type)),
  });
  const [loginMutation, { error }] = useMutation(LoginMutation, {
    fetchPolicy: "network-only",
  });
  const [registerMutation, { error: errorReg }] = useMutation(
    RegisterMutation,
    {
      fetchPolicy: "network-only",
    },
  );

  const [loadingCurrentUser] = useLazyQuery(CurrentUserQuery);

  const onSubmitLogin = (data: any) => {
    if (type === "login") {
      loginMutation({
        variables: { email: data?.email, password: data?.password },
        refetchQueries: ["CurrentUserQuery"],
      })
        .then(async (res) => {
          console.log("res", res?.data?.login?.accessToken);
          if (res.data?.login?.accessToken && res.data?.login?.refreshToken) {
            await setStoreItemAsync("access_token", res.data.login.accessToken);
            await setStoreItemAsync(
              "refresh_token",
              res.data.login.refreshToken,
            );
            await client.clearStore();
          }
          const { data } = await loadingCurrentUser();
          posthog?.capture("Login", {
            description: "Login",
            properties: [{ service: "feder", email: data?.currentUser?.email }],
            tags: ["Auth / Login", "Fin inscription", "Haute"],
            type: "event",
          });
          console.log("data", data?.currentUser);
          if (
            data?.currentUser?.profileValidated &&
            data?.currentUser?.isPhoneCodeUsed
          ) {
            router.push("/(auth)/(tabs)/events");
          } else if (
            data?.currentUser?.profileValidated &&
            !data?.currentUser?.isPhoneCodeUsed
          ) {
            router.push("/(auth)/(tabs)/squad?tab=onboarding");
          } else {
            router.push("/(auth)/profile/profile");
          }
        })
        .catch((err) => {
          console.log("err", err?.message);
        })
        .finally(() => {
          console.log("finally");
        });
    } else {
      registerMutation({
        variables: { email: data?.email, password: data?.password },
        refetchQueries: ["CurrentUserQuery"],
      })
        .then(async (res) => {
          console.log("res", res?.data?.register?.accessToken);
          if (
            res.data?.register?.accessToken &&
            res.data?.register?.refreshToken
          ) {
            await setStoreItemAsync(
              "access_token",
              res.data.register.accessToken,
            );
            await setStoreItemAsync(
              "refresh_token",
              res.data.register.refreshToken,
            );
            await client.clearStore();
          }
          const { data } = await loadingCurrentUser();
          posthog?.capture("signup_completed", {
            description: "Inscription complète avec succès",
            properties: [{ service: "feder", email: data?.currentUser?.email }],
            tags: ["Auth / Login", "Fin inscription", "Haute"],
            type: "event",
          });
          console.log("data", data?.currentUser);
          router.push("/(auth)/profile/profile");
        })
        .catch((err) => {
          console.log("err", err?.message);
          posthog?.capture("signup_failed", {
            description: "échec lors de l'inscription",
            properties: { error: err.message },
            tags: ["Auth / Login", "Inscription", "Moyenne"],
            type: "event",
          });
        })
        .finally(() => {
          console.log("finally");
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flexGrow: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className={`grow ${isSmall ? "mt-[33px]" : "mt-[84px]"}`}>
          <ThemedView>
            <TierAuthSection
              title={type === "login" ? "Se connecter avec" : "S'inscrire avec"}
            />
          </ThemedView>
          <ThemedView
            className={`flex flex-row items-center justify-center gap-6 ${isSmall ? "my-4" : "my-[38px]"}`}
          >
            <ThemedView className="border-primary-100 w-2/5 border-b" />
            <ThemedText>OU</ThemedText>
            <ThemedView className="border-primary-100 w-2/5 border-b" />
          </ThemedView>
          <ThemedView className="grow gap-10">
            <InputField
              control={control}
              errors={
                errors?.email?.message
                  ? (errors?.email?.message?.toString() ?? "Champ erroné")
                  : ""
              }
              name="email"
              title="Email"
              placeHolder="Email"
              type="text"
            />
            <InputField
              control={control}
              errors={
                errors?.password?.message
                  ? (errors?.password?.message?.toString() ?? "Champ erroné")
                  : ""
              }
              name="password"
              title="Mot de passe"
              placeHolder="Mot de passe"
              type="password"
              onSubmitEditing={() => handleSubmit(onSubmitLogin)()}
            />
            {type === "register" ? (
              <InputField
                control={control}
                errors={
                  errors?.confirmPassword?.message
                    ? (errors?.confirmPassword?.message?.toString() ??
                      "Champ erroné")
                    : ""
                }
                name="confirmPassword"
                title="Confirmez le mot de passe"
                placeHolder="Confirmez votre mot de passe"
                type="password"
                onSubmitEditing={() => handleSubmit(onSubmitLogin)()}
              />
            ) : null}
            <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
              <Text className="text-blue-link font-inter text-sm font-medium">
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          </ThemedView>
          {error || errorReg ? (
            <Text className="py-2 font-semibold text-red-500">
              {error?.message === "CREDS"
                ? "Identifiants incorrects"
                : errorReg?.message === "TAKEN"
                  ? "Email déjà utilisé"
                  : "Erreur de connexion"}
            </Text>
          ) : null}
        </View>
        <ThemedView
          className={`w-full items-center gap-4 pt-2`}
          style={{ paddingBottom: insets.bottom || 10 }}
        >
          <BaseButton
            type="solid"
            title={type === "login" ? "Me connecter" : "Créer mon compte"}
            onPress={() => {
              type === "login"
                ? handleSubmit(onSubmitLogin)()
                : handleSubmit(onSubmitLogin)();
            }}
          />
          <BaseButton
            type="outlined"
            title={
              type === "login" ? "Créer mon compte" : "J'ai déjà un compte"
            }
            onPress={() => {
              type === "login"
                ? router.push("/register")
                : router.push("/login");
            }}
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
