import { useState } from "react";
import { View } from "react-native";
import * as Calendar from "expo-calendar";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";

import { ModalSession } from "@/components/sessions/ModalSession";
import { NextSession } from "@/components/sessions/NextSession";
import { PastSession } from "@/components/sessions/PastSession";
import { SuccessEventModal } from "@/components/sessions/SuccessEventModal";
import { ThemedView } from "@/components/ThemedView";
import { SegmentSelector } from "@/components/ui/segment-selector-item";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { GetAwaitingReplies } from "@/graphql/current-user";
import {
  deleteStoreEventItemAsync,
  getStoreEventItemAsync,
} from "@/utils/secure-store-event";

export interface SquadTabStatus {
  tab: "index" | "past-sessions";
}

export default function Sessions() {
  const { tab, eventId } = useLocalSearchParams();
  const [tabStatus, setTabStatus] = useState<SquadTabStatus["tab"]>("index");
  const [storedEvent, setStoredEvent] = useState<any>(null);
  const { data } = useQuery(GetAwaitingReplies);

  // Variable pour stocker l'id de la session sélectionnée
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [modalSessionOpen, setModalSessionOpen] = useState(false);

  const fetchStoredEvent = async (eventId: any) => {
    if (eventId) {
      try {
        const event = await getStoreEventItemAsync(eventId);
        if (event) {
          setStoredEvent(event);
          const { eventCalendarId } = event;
          if (!eventCalendarId) {
            console.log("Aucun eventCalendarId trouvé dans le stockage");
            return;
          }
          let calendarEvent;
          try {
            calendarEvent = await Calendar.getEventAsync(eventCalendarId);
          } catch (error: any) {
            if (error.message.includes("could not be found")) {
              console.log(
                "L'événement n'existe plus dans le calendrier, suppression de la donnée locale",
              );
              await deleteStoreEventItemAsync(eventId);
              setStoredEvent(null);
              return;
            } else {
              throw error;
            }
          }
          if (!calendarEvent) {
            await deleteStoreEventItemAsync(eventId);
            setStoredEvent(null);
            console.log("Aucun événement trouvé dans le calendrier");
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération ou vérification de l'event stocké",
          error,
        );
      }
    }
  };
  const { event_id } = useLocalSearchParams();
  if (event_id) {
    setSelectedSessionId(event_id as string);
    setModalSessionOpen(true);
  }

  if (tab && tab !== tabStatus) {
    // Pour éviter une boucle infinie
    setTabStatus(tab as SquadTabStatus["tab"]);
  }

  let content;
  switch (tabStatus) {
    case "index":
      content = (
        <NextSession
          onItemPress={(id) => {
            fetchStoredEvent(id);
            setSelectedSessionId(id);
            setModalSessionOpen(true);
          }}
        />
      );
      break;
    case "past-sessions":
      content = (
        <PastSession
          onItemPress={(id) => {
            setSelectedSessionId(id);
            setModalSessionOpen(true);
          }}
        />
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: colorSlate50 }}>
      <View className="px-4 py-2">
        <SegmentSelector
          items={[
            {
              title: "À venir",
              selected: tabStatus === "index",
              hasNotification: !!data?.getAwaitingReplies,
            },
            { title: "Terminées", selected: tabStatus === "past-sessions" },
          ]}
          onSelect={(index) =>
            setTabStatus(index === 0 ? "index" : "past-sessions")
          }
          orientation="horizontal"
          borderBottom
        />
      </View>
      <View className="flex-1">{content}</View>
      <ModalSession
        selectedSessionId={selectedSessionId}
        modalOpen={modalSessionOpen}
        setModal={setModalSessionOpen}
        setselectdId={setSelectedSessionId}
        storedEvent={storedEvent}
        setStoredEvent={setStoredEvent}
      />
      <SuccessEventModal eventId={eventId as string} />
    </ThemedView>
  );
}
