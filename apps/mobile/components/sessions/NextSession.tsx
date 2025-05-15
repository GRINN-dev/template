import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NetworkStatus, useQuery } from "@apollo/client";

import { colorSlate50 } from "@/constants/ColorsFeder";
import { ResultOf } from "@/graphql";
import { CurrentUserQuery } from "@/graphql/current-user";
import { UpcomingEventsQuery } from "@/graphql/queries-content";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { statusEnum } from "@/utils/utils";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { CardActivity } from "../ui/CardActivity";
import { EmptyActivityList } from "../ui/empty-activity-list";

// Définissez le type des props pour NextSession
interface NextSessionProps {
  onItemPress?: (id: string) => void;
}

type UpcomingEventsResults = ResultOf<typeof UpcomingEventsQuery>;

export const NextSession = ({ onItemPress }: NextSessionProps) => {
  const isWidthLessThan400 = useIsWidthLessThan400();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: currentUser } = useQuery(CurrentUserQuery);
  const { data, loading, fetchMore, refetch, networkStatus } = useQuery(
    UpcomingEventsQuery,
    {
      variables: {
        offset: 0,
      },
      skip: !currentUser?.currentUser?.id,
      fetchPolicy: "network-only",
    },
  );

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return data?.getUpcomingEvents?.nodes?.length !== 0 ? (
    <ThemedView
      style={{
        flex: 1,
        backgroundColor: colorSlate50,
        overflow: "hidden",
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    >
      {isScrolled && (
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            zIndex: 1,
          }}
        />
      )}

      <FlatList
        data={data?.getUpcomingEvents?.nodes}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={
          <View
            style={{
              height:
                data?.getUpcomingEvents?.nodes?.length === 0
                  ? 0
                  : isWidthLessThan400
                    ? 110
                    : 150,
            }}
          />
        }
        onScroll={({ nativeEvent }) => {
          setIsScrolled(nativeEvent.contentOffset.y > 100);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (onItemPress) {
                onItemPress(item?.id ?? "");
              }
            }}
          >
            <CardActivity
              event={item}
              invitation={
                item?.organizerId === currentUser?.currentUser?.id
                  ? "Organisateur"
                  : "Participant"
              }
            />
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (!data?.getUpcomingEvents?.nodes?.length) return;
          fetchMore({
            variables: {
              offset: data?.getUpcomingEvents?.nodes?.length ?? 0,
            },
            updateQuery: (
              previousQueryResult,
              options: {
                fetchMoreResult: UpcomingEventsResults;
                variables: any;
              },
            ) => {
              if (!options?.fetchMoreResult?.getUpcomingEvents?.nodes?.[0])
                return previousQueryResult;
              return {
                ...previousQueryResult,
                getUpcomingEvents: {
                  nodes: [
                    ...(previousQueryResult?.getUpcomingEvents?.nodes ?? []),
                    ...options?.fetchMoreResult?.getUpcomingEvents?.nodes,
                  ],
                },
              };
            },
          });
        }}
        onRefresh={refetch}
        refreshing={networkStatus === NetworkStatus.refetch}
        ListEmptyComponent={
          <EmptyActivityList
            title="Vous n’avez pas encore d’activités"
            content={
              "Créons ou explorons vos prochaines activités ! Vous pourrez ensuite les retrouver ici"
            }
          />
        }
      />
    </ThemedView>
  ) : null;
};
