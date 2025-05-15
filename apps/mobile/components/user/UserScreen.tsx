import { View } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

import { UserProps } from "@/components/old/(auth)/pre-registered-user/[userId]";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { CurrentUserQuery } from "@/graphql/current-user";
import {
  AddInMyContacts,
  DeletePreRegisteredContact,
  RemoveFromMyContacts,
} from "@/graphql/mutations/user";
import { getGender } from "@/utils/getGender";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { onShare } from "@/utils/utils";
import { AvatarProfile } from "../profile/avatarProfile";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseArea } from "../ui/base-area";
import { BaseButton } from "../ui/base-button";

const UserComponent = ({
  user,
  source,
}: {
  user: UserProps;
  source: string;
}) => {
  console.log("user", user);
  const isSmall = useIsWidthLessThan400();
  const router = useRouter();
  const posthog = usePostHog();
  const { data } = useQuery(CurrentUserQuery);
  const [removeFromMyContacts, { loading: loadingRmv }] = useMutation(
    RemoveFromMyContacts,
    {
      variables: {
        id: user?.id,
      },
      refetchQueries: [
        "GetUserById",
        "GetUserContactViews",
        "GetSuggestions",
        "CheckExistingPhoneContact",
        "GetContactsFederByPhoneNumber",
      ],
    },
  );
  const [deletePreRegisteredContact, { loading: loadingDlt }] = useMutation(
    DeletePreRegisteredContact,
    {
      variables: {
        id: user?.id,
      },
      refetchQueries: [
        "GetUserById",
        "GetUserContactViews",
        "CheckExistingPhoneContact",
        "GetSuggestions",
        "GetContactsFederByPhoneNumber",
      ],
      onCompleted() {
        router.back();
      },
    },
  );

  const [addToMyContacts, { loading: loadingAdd }] = useMutation(
    AddInMyContacts,
    {
      variables: {
        userId: user?.id,
      },
      refetchQueries: [
        "GetUserById",
        "GetUserContactViews",
        "CheckExistingPhoneContact",
        "GetSuggestions",
        "GetContactsFederByPhoneNumber",
      ],
    },
  );

  return (
    <ThemedView
      className="grow"
      style={{
        backgroundColor: colorSlate50,
        alignItems: "center",
        paddingTop: isSmall ? 23 : 87,
        paddingHorizontal: 16,
      }}
    >
      <View className="flex-col items-center justify-center gap-4">
        <AvatarProfile
          firstName={user?.firstname}
          lastName={user?.lastname}
          avatarUrl={user?.avatarUrl}
          size="lg"
        />
        <ThemedText className="!text-xl font-bold">
          {user?.firstname} {user?.lastname}
        </ThemedText>
        {source === "user" ? (
          <ThemedText className="text-sm">
            {getGender(user?.gender ?? "NOTSPECIFIED")}
          </ThemedText>
        ) : null}
      </View>
      {source === "pre_registered_contact" ? (
        <View className="items-center justify-center gap-3">
          <ThemedText
            type={isSmall ? "sm/brand/semibold" : "lg/brand/semibold"}
          >
            Ce membre n’est pas encore sur Feder
          </ThemedText>
          <ThemedText
            type={isSmall ? "smallText" : "medium"}
            style={{
              textAlign: "center",
            }}
          >
            Envoyez-lui une invitation par message qu’il vous rejoigne sur
            l’application
          </ThemedText>
        </View>
      ) : null}
      <BaseArea>
        <View className="items-center justify-center gap-4">
          {source === "pre_registered_contact" && (
            <BaseButton
              title="Retirer de mon équipe"
              type="destructive"
              onPress={deletePreRegisteredContact}
              disable={loadingAdd || loadingDlt}
            />
          )}
          <BaseButton
            title={
              source === "pre_registered_contact"
                ? "Envoyer une invitation"
                : user?.isInMySquad
                  ? "Retirer de mon équipe"
                  : "Ajouter à mon équipe"
            }
            type={user?.isInMySquad ? "destructive" : "solid"}
            onPress={() => {
              if (source === "pre_registered_contact") {
                posthog.capture("invite_to_feder", {
                  path: "user_page",
                  link: "",
                });
                onShare();
              } else if (user?.isInMySquad) {
                removeFromMyContacts();
              } else {
                posthog.capture("add_contact", {
                  path: "user_page",
                  link: "",
                });
                addToMyContacts();
              }
            }}
            disable={
              loadingRmv || loadingAdd || data?.currentUser?.id === user?.id
            }
          />
        </View>
      </BaseArea>
    </ThemedView>
  );
};

export default UserComponent;
