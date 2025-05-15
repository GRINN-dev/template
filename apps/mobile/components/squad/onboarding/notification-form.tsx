import { View } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

import NotificationActive from "@/assets/svg/NotificationActive.svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BaseButton } from "@/components/ui/base-button";
import { ContainerButtonSheet } from "@/components/ui/containerButtonSheet";
import { CurrentUserQuery } from "@/graphql/current-user";
import { UpdateUserMutation } from "@/graphql/mutations/user";
import { registerForPushNotificationsAsync } from "@/utils/notificationHandler";

export const NotificationForm = ({
  handleOnPressNext,
}: {
  handleOnPressNext: () => void;
}) => {
  const posthog = usePostHog();
  const { data: currentUserData, refetch } = useQuery(CurrentUserQuery);
  const [updateUser] = useMutation(UpdateUserMutation);

  const refuseNotificationPermission = async () => {
    await updateUser({
      variables: {
        input: {
          id: currentUserData?.currentUser?.id!,
          patch: {
            isNotificationOk: false,
            notificationResponseDate: new Date().toISOString(),
          },
        },
      },
    });
    posthog?.capture("notification_permission_set", {
      name: "notification_permission_set",
      description: "Permission de notifications définie",
      properties: [{ answer: "status refusé" }],
      tags: ["Permissions", "Global", "Haute"],
      type: "event",
    });
    await refetch();
    handleOnPressNext();
  };

  const getNotificationPermission = async () => {
    const pushToken = await registerForPushNotificationsAsync();
    await updateUser({
      variables: {
        input: {
          id: currentUserData?.currentUser?.id!,
          patch: {
            pushToken: pushToken,
            isNotificationOk: true,
            notificationResponseDate: new Date()?.toISOString(),
          },
        },
      },
      refetchQueries: ["CurrentUser"],
    });
    posthog?.capture("notification_permission_set", {
      name: "notification_permission_set",
      description: "Permission de notifications définie",
      properties: { answer: "status granted" },
      tags: ["Permissions", "Global", "Haute"],
      type: "event",
    });
    await refetch();
    handleOnPressNext();
  };
  return (
    <ThemedView className="flex-1 items-center justify-center gap-8 px-4">
      <View className="grow items-center justify-center gap-16">
        <NotificationActive />
        <View className="gap-3">
          <ThemedText
            className="text-center align-middle text-lg text-primary"
            style={{ fontFamily: "Figtree_700Bold_Italic" }}
          >
            Restez informé !
          </ThemedText>
          <ThemedText className="text-center align-middle text-sm font-medium">
            Feder s'engage à vous envoyer uniquement les notifications
            concernant vos activités et votre équipe
          </ThemedText>
        </View>
      </View>
      <ContainerButtonSheet>
        <BaseButton
          title="Passer"
          type="outlined"
          onPress={refuseNotificationPermission}
        />
        <BaseButton
          title="Activer les notifications"
          type="solid"
          onPress={getNotificationPermission}
        />
      </ContainerButtonSheet>
    </ThemedView>
  );
};
