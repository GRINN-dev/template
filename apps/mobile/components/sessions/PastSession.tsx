import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@apollo/client";

import CalendarNoResult from "@/assets/svg/calendarNoResult.svg";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { ResultOf } from "@/graphql";
import { CurrentUserQuery } from "@/graphql/current-user";
import { PastEventsQuery } from "@/graphql/queries-content";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { statusEnum } from "@/utils/utils";
import { EventNoResult } from "../events/EventNoResult";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { CardActivity } from "../ui/CardActivity";

// Définissez le type des props pour NextSession
interface NextSessionProps {
  onItemPress?: (id: string) => void;
}
type PastEventsResults = ResultOf<typeof PastEventsQuery>;

export const PastSession = ({ onItemPress }: NextSessionProps) => {
  const isWidthLessThan400 = useIsWidthLessThan400();
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: currentUser } = useQuery(CurrentUserQuery);
  const { data, loading, fetchMore, refetch, networkStatus } = useQuery(
    PastEventsQuery,
    {
      variables: {
        offset: 0,
      },
      skip: !currentUser?.currentUser?.id,
    },
  );

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return (
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
        data={data?.getPastEvents?.nodes}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={
          <View style={{ height: isWidthLessThan400 ? 110 : 150 }} />
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
          if (!data?.getPastEvents?.nodes?.length) return;
          fetchMore({
            variables: {
              offset: data?.getPastEvents?.nodes?.length ?? 0,
            },
            updateQuery: (
              previousQueryResult,
              options: {
                fetchMoreResult: PastEventsResults;
                variables: any;
              },
            ) => {
              if (!options?.fetchMoreResult?.getPastEvents?.nodes?.[0])
                return previousQueryResult;
              return {
                ...previousQueryResult,
                getUpcomingEvents: {
                  nodes: [
                    ...(previousQueryResult?.getPastEvents?.nodes ?? []),
                    ...options?.fetchMoreResult?.getPastEvents?.nodes,
                  ],
                },
              };
            },
          });
        }}
        ListEmptyComponent={
          <EventNoResult
            title="Aucune activité terminée"
            descrition="Vous n’avez pas encore terminé d’activité, retrouvez ici votre historique"
            logo={<CalendarNoResult />}
            topBar={false}
            networkStatus={networkStatus}
            refresh={refetch}
          />
        }
      />
    </ThemedView>
  );
};
