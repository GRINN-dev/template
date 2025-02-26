import React from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import Config from "@/constants/Configs";
import { registerForPushNotificationsAsync } from "@/utils/NotificationHandler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

/**
 * composant créé à l'initialisation de l'application pour gérer les notifications et la version de l'application
 * peut inclure un hook sur le pathname pour faire du tracking
 */
export function AppInitialiserNotifAndVersion({
  children,
}: {
  children: React.ReactNode;
}) {
  const [markAsRead] = useMutation(UpdateNotification);
  const [updateUser] = useMutation(UpdateUser);

  const { data } = useQuery(CurrentUserQuery, {
    fetchPolicy: "cache-and-network",
  });

  React.useEffect(() => {
    if (!data) return;

    function redirect(notification: Notifications.Notification) {
      const url = notification?.request?.content?.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response?.notification) {
        return;
      }
      if (response.notification.request.content.data?.id) {
        markAsRead({
          variables: {
            id: response.notification.request.content.data?.id,
          },
        });
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (!response.notification) {
          return;
        }
        if (response.notification.request.content.data?.id) {
          markAsRead({
            variables: {
              id: response.notification.request.content.data?.id,
            },
          });
        }
        redirect(response.notification);
      },
    );

    async function checkAndUpdateUser() {
      const { currentUser } = data ?? {};
      if (!currentUser?.id) return;

      const updatePatch: {
        pushToken?: string;
        appVersion?: number;
      } = {};

      // Handle push token registration and update if necessary
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken && pushToken !== currentUser.pushToken) {
        updatePatch.pushToken = pushToken;
      }

      // Handle app version update if necessary
      const currentVersion = Config.VERSION_CODE;
      if (currentVersion && currentVersion !== currentUser.appVersion) {
        updatePatch.appVersion = currentVersion;
      }

      // Update user if there's anything to update
      if (Object.keys(updatePatch).length > 0) {
        await updateUser({
          variables: {
            input: {
              id: currentUser.id,
              patch: updatePatch,
            },
          },
        });
      }
    }
    checkAndUpdateUser();

    return () => {
      subscription.remove();
    };
  }, [data]);

  return <>{children}</>;
}

const CurrentUserQuery = graphql(`
  query CurrentUserQuery {
    currentUser {
      id
      pushToken
      appVersion
    }
  }
`);

const UpdateNotification = graphql(`
  mutation UpdateNotification($id: UUID!) {
    updateNotification(input: { id: $id, patch: { read: true } }) {
      clientMutationId
    }
  }
`);

const UpdateUser = graphql(`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      clientMutationId
    }
  }
`);
