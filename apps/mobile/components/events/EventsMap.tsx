import React, { useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { EventsQueryProps } from "@/components/old/(auth)/(tabs)/events";
import { getStoredEvent } from "@/utils/event-calendar-edition";
import { mapStyle } from "@/utils/utils";
import useStore from "../layout/useStore";
import { ModalSession } from "../sessions/ModalSession";
import { ThemedView } from "../ThemedView";
import { EventCluster } from "./EventCluster";
import { EventMarker } from "./EventMarker";

export default function EventsMap({ events }: { events: EventsQueryProps }) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const { setFilterRegion, filterRegion, isFilteringPositionOrSportOpen } =
    useStore();
  const [info, setInfo] = useState<boolean>(true);
  const [infoClosedManually, setInfoClosedManually] = useState<boolean>(false);

  const [modalSessionOpen, setModalSessionOpen] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  const hideInfoWithDelay = () => {
    setTimeout(() => {
      setInfo(false);
      setInfoClosedManually(true);
    }, 1000);
  };

  const [storedEvent, setStoredEvent] = useState<any>(null);

  const onRegionChangeComplete = (newRegion: any) => {
    if (
      Math.abs(newRegion.latitude - filterRegion.latitude) > 0.001 ||
      Math.abs(newRegion.longitude - filterRegion.longitude) > 0.001
    ) {
      setFilterRegion(newRegion);
      hideInfoWithDelay();
    }
  };
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
      style={styles.container}
      pointerEvents={isFilteringPositionOrSportOpen ? "none" : "auto"}
    >
      <MapView
        style={styles.map}
        provider={Platform.OS === "ios" ? undefined : PROVIDER_GOOGLE}
        ref={mapRef}
        onRegionChangeComplete={onRegionChangeComplete}
        region={filterRegion}
        initialRegion={filterRegion}
        customMapStyle={Platform.OS === "ios" ? undefined : mapStyle}
        renderCluster={(cluster) => (
          <EventCluster cluster={cluster} key={cluster.id} />
        )}
      >
        {events?.events?.nodes.map((event) => (
          <Marker
            key={event?.id}
            coordinate={{
              latitude: event?.addresses?.latitude || 0,
              longitude: event?.addresses?.longitude || 0,
            }}
            onPress={() => {
              fetchStoredEvent(event?.id);
              setSelectedSessionId(event?.id!);
              setModalSessionOpen(true);
            }}
          >
            <EventMarker event={event} />
          </Marker>
        ))}
      </MapView>

      <ModalSession
        selectedSessionId={selectedSessionId ?? ""}
        modalOpen={modalSessionOpen}
        setModal={setModalSessionOpen}
        setselectdId={setSelectedSessionId}
        setStoredEvent={setStoredEvent}
        storedEvent={storedEvent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
