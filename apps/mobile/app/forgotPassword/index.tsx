import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ResetPassword } from "@/components/auth/ResetPassword";
import { InputField } from "@/components/form/InputField";
import { BaseButton } from "@/components/ui/base-button";
import { LogoFederComp } from "@/components/ui/LogoFederComp";
import { ForgotPasswordSmsMutation } from "@/graphql/mutations/auth";

const resetForm = z.object({
  email: z.string().min(2, {
    message: "Votre identifiant Email",
  }),
});

const ForgotPassword = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetForm),
  });

  const [forgotPassword, { error, loading, data }] = useMutation(
    ForgotPasswordSmsMutation,
  );

  const onPressSubmit = async (data: any) => {
    console.log("onPressSubmit");
    forgotPassword({
      variables: {
        email: data?.email,
      },
    });
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
      className="bg-surface h-full px-4"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LogoFederComp />
        <View className="grow justify-center">
          <View className="gap-4">
            <InputField
              control={control}
              errors={JSON.stringify(errors?.email?.message)}
              name="email"
              title="Email"
              placeHolder="Email"
              type="text"
            />
          </View>
        </View>
        {data?.forgotPasswordSms?.userId ? (
          <ResetPassword userId={data?.forgotPasswordSms?.userId} />
        ) : (
          <Text className="font-inter text-justify">
            ⚠️ Vous ne pouvez pas réinitialiser les identifiants d'un compte
            Apple ou Google.
          </Text>
        )}
        {error ? (
          <Text className="text-danger font-semibold">
            {error?.graphQLErrors?.[0]?.extensions?.exception &&
            (error.graphQLErrors[0].extensions.exception as { code?: string })
              .code === "NOUSR"
              ? "Email non reconnu ou utilisé avec Apple ou Google"
              : "Une erreur est survenue"}
          </Text>
        ) : null}
        {!data?.userId && !data?.forgotPasswordSms?.userId ? (
          <View
            className={`w-full items-center gap-4 pt-2`}
            style={{ paddingBottom: insets.bottom || 10 }}
          >
            <BaseButton
              type="outlined"
              title={"Retour"}
              onPress={() => router.back()}
            />
            <BaseButton
              disable={loading}
              type="solid"
              title={"Envoyer un SMS de reset"}
              onPress={handleSubmit(onPressSubmit)}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;
