import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import { useMutation, useQuery } from "@apollo/client";
import { Entypo } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CurrentUserQuery } from "@/graphql/current-user";
import {
  ChangePasswordMutation,
  DeleteCurrentUserMutation,
  LogoutMutation,
} from "@/graphql/mutations/auth";
import { client } from "../apollo";
import { InputField } from "../form/InputField";
import { BaseButton } from "../ui/base-button";

const updateForm = z
  .object({
    oldPassword: z.string().min(2, {
      message: "L'ancien mot de passe doit contenir au moins 2 caractères",
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

export const UpdatePassword = () => {
  const insets = useSafeAreaInsets();
  const [openDeleteModale, setOpenDeleteModale] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateForm),
  });

  const { data } = useQuery(CurrentUserQuery, {
    onCompleted: ({ currentUser }) => {
      console.log(currentUser?.userAuthentications?.nodes?.[0]?.service);
    },
  });
  const [logout] = useMutation(LogoutMutation, {
    fetchPolicy: "network-only",
  });
  const delCacheAndGoHome = async () => {
    await logout();
    await deleteItemAsync("access_token");
    await deleteItemAsync("refresh_token");
    client.clearStore();
    router.push("/login");
  };
  const [changePassword] = useMutation(ChangePasswordMutation);
  const [deleteCurrentUser] = useMutation(DeleteCurrentUserMutation);

  const submitDeleteUser = async () => {
    await deleteCurrentUser({
      variables: { input: {} },
      onCompleted: (data: any) => {
        console.log(data);
        setOpenDeleteModale(false);
        delCacheAndGoHome();
      },
    });
  };

  const submitReset = async (data: any) => {
    if (data.newPassword !== data.checkPassword) {
      return;
    } else {
      changePassword({
        variables: {
          input: {
            oldPassword: data?.oldPassword,
            newPassword: data?.newPassword,
          },
        },
        onCompleted: (data: any) => {
          console.log(data);
          reset();
        },
      });
    }
  };

  const openBrowser = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ThemedView style={{ flexGrow: 1 }}>
      <ThemedView className="mt-2 flex gap-4">
        <TouchableOpacity
          onPress={() => openBrowser("https://feder.app/mentions-legales/")}
          className={`flex-1 flex-row items-center justify-center rounded-full border border-[#1F94A3] bg-white py-2`}
        >
          <Text className={`text-lg font-semibold text-[#1F94A3]`}>
            Voir les CGU
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openBrowser("https://feder.app/")}
          className={`border-brand-secondary flex-1 flex-row items-center justify-center rounded-full border bg-white py-2`}
        >
          <Text className={`text-lg font-semibold text-[#F3A712]`}>
            À propos de Feder
          </Text>
        </TouchableOpacity>
      </ThemedView>
      {data?.currentUser?.userAuthentications?.nodes?.[0]?.service !==
        "google" &&
      data?.currentUser?.userAuthentications?.nodes?.[0]?.service !==
        "apple" ? (
        <View className="grow">
          <View className="grow">
            <ThemedText type="subtitle" className="mt-8">
              Mot de passe
            </ThemedText>
            <ThemedText type="smallText">
              Modifiez votre mot de passe
            </ThemedText>
            <ThemedView className="my-6 flex gap-6">
              <InputField
                control={control}
                errors={JSON.stringify(errors?.oldPassword?.message)}
                name="oldPassword"
                title="Ancien mot de passe"
                placeHolder="Ancien mot de passe"
                type="password"
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
            </ThemedView>
          </View>

          <ThemedView
            className="my-4 flex gap-4"
            style={{
              paddingBottom: insets.bottom || 10,
            }}
          >
            <BaseButton
              type="solid"
              // title="Mettre à jour"
              title="Valider mon profil"
              onPress={() => handleSubmit(submitReset)()}
            />
            <BaseButton
              type="destructive"
              title="Supprimer mon compte"
              onPress={() => {
                setOpenDeleteModale(true);
              }}
            />
          </ThemedView>
        </View>
      ) : null}
      <Modal
        animationType="fade"
        transparent={true}
        visible={openDeleteModale}
        onRequestClose={() => {
          setOpenDeleteModale(!openDeleteModale);
        }}
      >
        <View className="flex flex-1 items-center justify-center bg-black/20 px-6">
          <View className="w-full rounded-2xl bg-white p-4 shadow">
            <TouchableOpacity
              onPress={() => setOpenDeleteModale(false)}
              className="self-end"
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
            <Text className="p-2 text-base">
              Attention, toute suppression de compte entrainera la perte des
              données de votre compte de façon définitive.
            </Text>
            <BaseButton
              onPress={() => submitDeleteUser()}
              type="destructive"
              title="Supprimer le compte"
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};
