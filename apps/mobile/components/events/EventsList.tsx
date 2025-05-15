import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ApolloQueryResult,
  NetworkStatus,
  OperationVariables,
} from "@apollo/client";

import { EventsQueryProps } from "@/components/old/(auth)/(tabs)/events";
import { colorSlate50, colorSurfaceBorderLight } from "@/constants/ColorsFeder";
import { getStoredEvent } from "@/utils/event-calendar-edition";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ModalSession } from "../sessions/ModalSession";
import { ThemedView } from "../ThemedView";
import { CardActivity } from "../ui/CardActivity";

const EventsList = ({
  events,
  refresh,
  networkStatus,
}: {
  events: EventsQueryProps;
  refresh: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<any>>;
  networkStatus: NetworkStatus;
}) => {
  const isWidthLessThan400 = useIsWidthLessThan400();
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalSessionOpen, setModalSessionOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [storedEvent, setStoredEvent] = useState<any>(null);

  const fetchStoredEvent = async (eventId: any) => {
    try {
      const event = await getStoredEvent(eventId);
      if (event) {
        setStoredEvent(event);
      } else {
        setStoredEvent(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération ou vérification de l'event stocké",
        error,
      );
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: colorSurfaceBorderLight,
        backgroundColor: colorSlate50,
        overflow: "hidden",
        paddingTop: 16,
        paddingHorizontal: 16,
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
        data={events?.events?.nodes}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={
          <View style={{ height: isWidthLessThan400 ? 110 : 150 }} />
        }
        onRefresh={refresh}
        refreshing={networkStatus === NetworkStatus.refetch}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              fetchStoredEvent(item?.id);
              setSelectedSessionId(item?.id!);

              setModalSessionOpen(true);
            }}
          >
            <CardActivity event={item} key={item?.id} />
          </TouchableOpacity>
        )}
        onScroll={({ nativeEvent }) => {
          setIsScrolled(nativeEvent.contentOffset.y > 100);
        }}
        scrollEventThrottle={16}
      />
      <ModalSession
        selectedSessionId={selectedSessionId ?? ""}
        modalOpen={modalSessionOpen}
        setModal={setModalSessionOpen}
        setselectdId={setSelectedSessionId}
        storedEvent={storedEvent}
        setStoredEvent={setStoredEvent}
      />
    </ThemedView>
  );
};

export default EventsList;
