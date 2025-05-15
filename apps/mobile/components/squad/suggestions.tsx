import { Dispatch, SetStateAction } from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";

import { SquadTabStatus } from "@/components/old/(auth)/(tabs)/squad";
import { ThemedView } from "@/components/ThemedView";
import { ResultOf } from "@/graphql";
import { UpdateUserMutation } from "@/graphql/mutations/user";
import { GetSuggestions } from "@/graphql/queries-content";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { EmptyComponentList } from "../ui/empty-component-list";
import { SegmentSelector } from "../ui/segment-selector-item";
import { ContactCard } from "./contact-card";

export type GetUserContactViewsResult = ResultOf<typeof GetSuggestions>;

export const Suggestions = ({
  setTabStatus,
  tabStatus,
  suggestionsDot,
}: {
  setTabStatus: Dispatch<SetStateAction<SquadTabStatus["tab"]>>;
  tabStatus: SquadTabStatus["tab"];
  suggestionsDot: boolean;
}) => {
  const isSmall = useIsWidthLessThan400();
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GetSuggestions, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "network-only",
  });

  const [updateUser] = useMutation(UpdateUserMutation, {
    variables: {
      input: {
        id: data?.currentUserId ?? "",
        patch: {
          lastSuggestionActivity: new Date().toISOString(),
        },
      },
    },
    refetchQueries: ["GetNewSuggestionCount"],
  });

  return (
    <ThemedView className="!bg-surface grow">
      <SegmentSelector
        items={[
          { title: "Mon équipe", selected: tabStatus === "squad" },
          {
            title: "Suggestions",
            selected: tabStatus === "suggestions",
            hasNotification: suggestionsDot,
          },
        ]}
        onSelect={(index) => {
          setTabStatus(index === 0 ? "squad" : "suggestions");
          if (index === 1) {
            updateUser();
          }
        }}
        borderBottom
      />

      <FlatList
        data={data?.getSuggestions?.nodes}
        ItemSeparatorComponent={() => (
          <View className={isSmall ? "h-3" : "h-4"} />
        )}
        className="overflow-visible pt-6"
        renderItem={({ item }) =>
          item ? (
            <ContactCard
              key={item.id}
              contact={item}
              onPress={() => {
                router.push({
                  pathname: "/user/[userId]",
                  params: { userId: item.id as string },
                });
              }}
            />
          ) : null
        }
        ListEmptyComponent={
          <EmptyComponentList
            title="Aucune suggestion"
            content="Vous retrouverez ici les personnes qui vous ont dans leur équipe ou avec qui vous avez partagé une activité"
          />
        }
      />
    </ThemedView>
  );
};
