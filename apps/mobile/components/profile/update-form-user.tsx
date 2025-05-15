import { useEffect, useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";

import LeftIconTrash from "@/assets/svg/leftIconTrash.svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { VariablesOf } from "@/graphql";
import { CurrentUserQuery } from "@/graphql/current-user";
import { UpdateUserMutation } from "@/graphql/mutations/user";
import { setStoreItemAsync } from "@/utils/secure-store";
import CarrouselColors from "../form/CarrousselColor";
import { InputField } from "../form/InputField";
import { BaseButton } from "../ui/base-button";
import { AvatarProfile } from "./avatarProfile";
import { LogoutButton } from "./LogoutButton";
import { UploadImageEvent } from "./upload-image-user";

const updateForm = z.object({
  firstname: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastname: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  gender: z.enum(["HOMME", "FEMME", "AUTRE", "NOTSPECIFIED"]),
});

const UpdateUser = () => {
  const [uploadImage, setUploadImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [updateMutation] = useMutation(UpdateUserMutation, {
    fetchPolicy: "network-only",
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateForm),
  });
  const posthog = usePostHog();

  const {
    data,
    loading: loadingUser,
    refetch,
  } = useQuery(CurrentUserQuery, {
    onCompleted: (data) => {
      setValue("firstname", data?.currentUser?.firstname ?? "");
      setValue("lastname", data?.currentUser?.lastname ?? "");
      setValue("gender", data?.currentUser?.gender ?? "NOTSPECIFIED");
      setUploadImage(data?.currentUser?.avatarUrl ?? "");
      setSelectedColor(data?.currentUser?.avatarColor ?? "");
    },
  });
  const [selectedColor, setSelectedColor] = useState(
    data?.currentUser?.avatarColor
      ? data?.currentUser?.avatarColor
      : "rgba(148, 163, 184, 1)",
  );

  const handleColorSelect = (color: any) => {
    setSelectedColor(color);
  };

  const onUploadedPicture = async (url: string) => {
    setUploadImage(url);
    try {
      await updateMutation({
        variables: {
          input: {
            id: data?.currentUser?.id ?? "",
            patch: { avatarUrl: url },
          },
        },
      });
      await refetch();
    } catch (err) {
      console.log("Erreur suppression image", err);
    }
  };

  useEffect(() => {
    if (data?.currentUser) {
      reset({
        firstname: data.currentUser.firstname ?? "",
        lastname: data.currentUser.lastname ?? "",
        gender: data.currentUser.gender ?? "NOTSPECIFIED",
      });
      setUploadImage(data.currentUser.avatarUrl ?? "");
      setSelectedColor(
        data.currentUser.avatarColor ?? "rgba(148, 163, 184, 1)",
      );
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    console.log("formData", formData);
    setLoading(true);
    const isProfileAlreadyComplete = data?.currentUser?.profileValidated;
    try {
      const res = await updateMutation({
        variables: {
          input: {
            id: data?.currentUser?.id ?? "",
            patch: {
              firstname: formData?.firstname,
              lastname: formData?.lastname,
              gender: formData?.gender,
              avatarUrl: !!uploadImage ? uploadImage : null,
              avatarColor: selectedColor ?? "red",
              ...(data?.currentUser?.profileValidated
                ? {}
                : {
                    profileValidated: true,
                    profileValidatedAt: new Date().toISOString(),
                  }),
            },
          },
        },
        refetchQueries: ["CurrentUserQuery"],
      });
    } catch (err) {
      console.log("err", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
      await refetch().then(({ data }) => {
        if (!isProfileAlreadyComplete) {
          posthog?.capture("profile_completed", {
            name: "profile_created",
            description: "Création complète du profil",
            properties: {
              firstname: data?.currentUser?.firstname,
              lastname: data?.currentUser?.lastname,
              hasPhoto: !!data?.currentUser?.avatarUrl,
            },
            tags: ["Profil / Création", "ProfileScreen", "Haute"],
            type: "event",
          });
          router.push("/(auth)/(tabs)/squad");
        } else {
          posthog?.capture("profile_updated", {
            description: "Modification du profil utilisateur",
            // properties: ["fields_updated"],
            tags: ["Profil / édition", "ProfileScreen", "Moyenne"],
            type: "event",
          });
          router.push("/(auth)/(tabs)/events");
        }
      });
    }
  };

  const handleRemoveImage = async () => {
    setUploadImage("");

    try {
      await updateMutation({
        variables: {
          input: {
            id: data?.currentUser?.id ?? "",
            patch: { avatarUrl: null },
          },
        },
      });

      await refetch();
    } catch (err) {
      console.log("Erreur suppression image", err);
    }
  };

  if (loadingUser) {
    return <Text>Loading...</Text>;
  }

  const handlePress = (() => {
    let clickCount = 0;
    let timer: NodeJS.Timeout | null = null;

    return () => {
      clickCount++;

      if (timer) clearTimeout(timer);

      timer = setTimeout(async () => {
        if (clickCount > 4) {
          await setStoreItemAsync("launched_before", "");
        }
        clickCount = 0;
      }, 200); // 300ms pour distinguer les clics multiples
    };
  })();

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView className="mb-10 flex items-center justify-center gap-6">
        <ThemedView className="flex-row items-center gap-4">
          <UploadImageEvent
            imageUrl={uploadImage}
            setUploadImage={onUploadedPicture}
            defaultImage={data?.currentUser?.avatarUrl ?? ""}
            title=""
            avatarChildren={
              <AvatarProfile
                selectColor={selectedColor ?? "rgba(148, 163, 184, 1)"}
                avatarUrl={uploadImage}
                firstName={data?.currentUser?.firstname ?? ""}
                lastName={data?.currentUser?.lastname ?? ""}
                size="lg"
              />
            }
          />
          <ThemedText
            className="w-[55%] text-center text-xs"
            type="default"
            onPress={handlePress}
          >
            Ajoutez une photo de vous dans votre sport favoris ou utilisez une
            couleur d’avatar
          </ThemedText>
        </ThemedView>

        {data?.currentUser?.avatarUrl ? (
          <ThemedView className="mx-5 mt-8 flex w-full flex-row justify-between">
            <BaseButton
              type="outlined-danger"
              title="Supprimer"
              onPress={() => handleRemoveImage()}
              logo={<LeftIconTrash />}
              width="w-[160px]"
            />
            <UploadImageEvent
              imageUrl={uploadImage}
              setUploadImage={onUploadedPicture}
              defaultImage={data?.currentUser?.avatarUrl ?? ""}
              title="Modifier"
            />
          </ThemedView>
        ) : (
          <UploadImageEvent
            imageUrl={uploadImage}
            setUploadImage={onUploadedPicture}
            defaultImage={data?.currentUser?.avatarUrl ?? ""}
            title="Ajouter une photo"
          />
        )}
      </ThemedView>

      {data?.currentUser?.avatarUrl ? null : (
        <ThemedView className="mb-6">
          <CarrouselColors onColorSelect={handleColorSelect} />
        </ThemedView>
      )}

      <ThemedView className="flex gap-6 pb-6">
        <ThemedView className="flex w-full gap-4">
          <ThemedView style={{ flex: 1 }}>
            <InputField
              control={control}
              errors={JSON.stringify(errors?.firstname?.message)}
              name="firstname"
              title="Prénom"
              placeHolder="Prénom"
              type="text"
            />
          </ThemedView>
          <ThemedView style={{ flex: 1 }}>
            <InputField
              control={control}
              errors={JSON.stringify(errors?.lastname?.message)}
              name="lastname"
              title="Nom"
              placeHolder="Nom"
              type="text"
            />
          </ThemedView>
        </ThemedView>
        <ThemedView style={{ flex: 1 }} className="gap-2">
          <ThemedText>Genre</ThemedText>
          <InputField
            control={control}
            errors=""
            name="gender"
            title="Genre"
            placeHolder="Choisir un genre"
            type="select"
            items={[
              { label: "Homme", value: "HOMME" },
              { label: "Femme", value: "FEMME" },
              { label: "Autre", value: "AUTRE" },
            ]}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView className="mb-6 gap-4 pb-6">
        <BaseButton
          type="solid"
          loading={loadingUser || loading}
          // title={
          //   data?.currentUser?.firstname && data?.currentUser?.lastname
          //     ? "Mettre à jour"
          //     : "Valider mon profil"
          // }
          title="Valider mon profil"
          onPress={() => handleSubmit(onSubmit)()}
        />
        <LogoutButton />
      </ThemedView>
    </ThemedView>
  );
};

export default UpdateUser;
