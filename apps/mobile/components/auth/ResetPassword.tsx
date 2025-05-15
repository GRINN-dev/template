import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

import { ThemedText } from "@/components/ThemedText";
import { ResetPasswordMutation } from "@/graphql/mutations/auth";
import { InputField } from "../form/InputField";
import { BaseButton } from "../ui/base-button";

const updateForm = z
  .object({
    token: z.string().min(2, {
      message: "Votre code reçu par SMS",
    }),
    newPassword: z.string().min(2, {
      message: "Le nouveau mot de passe doit contenir au moins 2 caractères",
    }),
    checkPassword: z.string().min(2, {
      message: "La confirmation doit contenir au moins 2 caractères",
    }),
  })
  .refine((data) => data.newPassword === data.checkPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["checkPassword"],
  });

export const ResetPassword = ({ userId }: { userId: String }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateForm),
  });
  const insets = useSafeAreaInsets();

  const [resetPassword] = useMutation(ResetPasswordMutation);

  const [loading, setLoading] = useState(false);

  const submitReset = async (data: any) => {
    setLoading(true);
    if (data.newPassword !== data.checkPassword) {
      return;
    } else {
      resetPassword({
        variables: {
          input: {
            userId: userId,
            resetToken: data?.token,
            newPassword: data?.newPassword,
          },
        },
        onCompleted: (data: any) => {
          reset();
          setLoading(false);
          router.push("/login");
        },
      });
    }
    setLoading(false);
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <View className="grow">
        <View className="grow">
          <ThemedText type="smallText">Modifiez votre mot de passe</ThemedText>
          <View className="my-6 flex gap-6">
            <InputField
              control={control}
              errors={JSON.stringify(errors?.oldPassword?.message)}
              name="token"
              title="Code de vérification reçu pas SMS"
              placeHolder="Code de vérification"
              type="text"
            />
            <InputField
              control={control}
              errors={JSON.stringify(errors?.newPassword?.message)}
              name="newPassword"
              title="Nouveau mot de passe"
              placeHolder="Nouveau mot de passe"
              type="password"
            />
            <InputField
              control={control}
              errors={JSON.stringify(errors?.checkPassword?.message)}
              name="checkPassword"
              title="Confirmation du mot de passe"
              placeHolder="Confirmation du mot de passe"
              type="password"
            />
          </View>
        </View>
        <View
          className={`w-full items-center gap-4 pt-2`}
          style={{ paddingBottom: insets.bottom || 10 }}
        >
          <BaseButton
            disable={loading}
            type="solid"
            title={"Valider"}
            onPress={handleSubmit(submitReset)}
          />
        </View>
      </View>
    </View>
  );
};
