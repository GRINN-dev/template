import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router, useGlobalSearchParams, usePathname } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";
import { PostHogProvider, usePostHog } from "posthog-react-native";

import Config from "@/constants/Config";
import { CurrentUserQuery } from "@/graphql/current-user";
import { UpdateNotification } from "@/graphql/mutations/other";
import { UpdateUserMutation } from "@/graphql/mutations/user";
import { registerForPushNotificationsAsync } from "@/utils/notificationHandler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export function AppInitialiserNotifAndVersion({
  children,
}: {
  children: React.ReactNode;
}) {
  const [markAsRead] = useMutation(UpdateNotification);
  const [updateUser] = useMutation(UpdateUserMutation);

  const { data } = useQuery(CurrentUserQuery);

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
            patch: {
              status: "READ",
            },
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
        isNotificationOk?: boolean;
        notificationResponseDate?: Date;
        appVersion?: number;
      } = {};

      // Handle push token registration and update if necessary
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken && pushToken !== currentUser.pushToken) {
        updatePatch.pushToken = pushToken;
        updatePatch.isNotificationOk = true;
        updatePatch.notificationResponseDate = new Date();
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

  return (
    <>
      <PostHogProvider
        apiKey="phc_xqi159ZLZor0uWPOgJCcUZrmhluDhEEpyXaC4CFdwwQ"
        options={{
          host: "https://eu.i.posthog.com",
          disabled: !Config.IS_PROD,
        }}
        // autocapture
      >
        <PostHogTracker />
        {children}
      </PostHogProvider>
    </>
  );
}

const PostHogTracker = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;
    posthog.capture("Pageview", {
      $pathname: pathname,
      properties: { pathname: pathname, params: params },
    });
  }, [pathname, params]);

  return null;
};
