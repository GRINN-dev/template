import { useEffect } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import * as Calendar from "expo-calendar";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

import CalendarSimple from "@/assets/svg/calendarSimple.svg";
import {
  colorPrimary300,
  colorSecondary500,
  colorSlate50,
} from "@/constants/ColorsFeder";
import { ResultOf } from "@/graphql";
import { CurrentUserQuery } from "@/graphql/current-user";
import { UpdateAnswerUserEvents } from "@/graphql/mutations/event";
import { EventByIdQuery } from "@/graphql/queries-content";
import { createEventCalendar } from "@/utils/event-calendar-edition";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import {
  deleteStoreEventItemAsync,
  getStoreEventItemAsync,
} from "@/utils/secure-store-event";
import { formatDateWithMonth } from "@/utils/utils";
import { EventMapRappel } from "../events/EventMapRappel";
import { ContactCard } from "../squad/contact-card";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "../ui/base-button";
import { BottomSheet } from "../ui/Bottom-sheet";
import { CardActivityByUser } from "../ui/CardActivityByUser";
import { ContainerButtonSheet } from "../ui/containerButtonSheet";

export type GetEventByIdResult = ResultOf<typeof EventByIdQuery>;
export const ModalSession = ({
  selectedSessionId,
  modalOpen,
  setModal,
  setselectdId,
  storedEvent,
  setStoredEvent,
}: {
  selectedSessionId: string;
  modalOpen: boolean;
  setModal: (value: boolean) => void;
  setselectdId: (value: string) => void;
  storedEvent: boolean;
  setStoredEvent: (value: boolean) => void;
}) => {
  const isWidthLessThan400 = useIsWidthLessThan400();
  const posthog = usePostHog();
  useEffect(() => {
    if (posthog && selectedSessionId) {
      posthog?.capture("activity_viewed", {
        description: "Détail d'une activité consulté",
        properties: { activity: selectedSessionId },
        tags: ["Activités / Vue", "ActivityDetailScreen", "Haute"],
        type: "event",
      });
    }
  }, [selectedSessionId, posthog]);

  const { data: eventById } = useQuery<GetEventByIdResult>(EventByIdQuery, {
    variables: { id: selectedSessionId },
    skip: !selectedSessionId,
  });

  const [answerEventInvitation] = useMutation(UpdateAnswerUserEvents, {
    refetchQueries: [
      "UpcomingEventsQuery",
      "GetEventByIdQuery",
      "GetAwaitingReplies",
    ],
  });
  const { data, loading } = useQuery(CurrentUserQuery);

  const submitAnswer = async (status: any) => {
    try {
      const result = await answerEventInvitation({
        variables: {
          input: {
            pStatus: status,
            pEventId: selectedSessionId,
          },
        },
        refetchQueries: ["EventsQuery"],
      });
      console.log("result", result);
    } catch (error) {
      console.log("error", error);
    } finally {
      console.log("finally");
    }
  };
  const handleUnsubscribe = async () => {
    try {
      const stored = await getStoreEventItemAsync(eventById?.event?.id!);
      if (stored && stored.eventCalendarId) {
        try {
          await Calendar.deleteEventAsync(stored.eventCalendarId);
        } catch (error) {
          console.error(
            "Erreur lors de la suppression de l'événement du calendrier",
            error,
          );
        }
        await deleteStoreEventItemAsync(eventById?.event?.id!);
        setStoredEvent(false);
      }
    } catch (error) {
      console.error("Erreur lors de la désinscription", error);
    }
  };

  const openMaps = () => {
    const address = eventById?.event?.addresses;
    if (address) {
      const { latitude, longitude, formattedAddress } = address;
      const label = formattedAddress || "Destination";
      let url = "";

      if (Platform.OS === "ios") {
        // Pour Apple Maps sur iOS
        url = `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(label)}`;
      } else {
        // Pour Google Maps sur Android
        url = `http://maps.google.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(label)}`;
      }

      Linking.openURL(url).catch((err) =>
        console.error("Erreur lors de l'ouverture de la carte", err),
      );
    } else {
      console.warn("Adresse non disponible");
    }
  };

  const participationDisabled =
    (eventById?.event?.startAt &&
      eventById?.event?.startAt < new Date().toISOString()) ||
    eventById?.event?.userEvents.totalCount ===
      eventById?.event?.maxParticipants ||
    eventById?.event?.organizer?.id === data?.currentUser?.id;

  return (
    <BottomSheet
      openModal={modalOpen}
      onClose={() => {
        setModal(false);
        setselectdId("");
      }}
      titleHeader={eventById?.event?.sport?.name ?? ""}
      color={eventById?.event?.sport?.color ?? "#545F66"}
      border={true}
      sport={eventById?.event?.sport?.code}
    >
      <ThemedView
        style={{
          flex: 1,
        }}
      >
        {eventById?.event ? (
          <ScrollView className="p-4">
            <ThemedView style={{ gap: 10 }}>
              <ThemedView className="flex-row items-center gap-2">
                {/* <ThemedText>
                  {new Date(eventById?.event?.startAt) < new Date()
                    ? "Terminé"
                    : eventById?.event?.getStatusOnEvent
                      ? statusEnum[eventById?.event?.getStatusOnEvent]
                      : "À venir"}
                </ThemedText> */}
                <View
                  className="items-center justify-center"
                  style={{
                    height: 24,
                    width: 24,
                    borderWidth: 1,
                    borderColor: colorSecondary500,
                    borderRadius: 4,
                  }}
                >
                  <CalendarSimple />
                </View>
                <ThemedText
                  type="xs/brand/semibold"
                  style={{
                    color: colorSecondary500,
                  }}
                >
                  {formatDateWithMonth(eventById?.event?.startAt)}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={{
                  gap: 8,
                }}
              >
                <ThemedText type="title">{eventById?.event?.title}</ThemedText>
                <ThemedText
                  style={{
                    color: colorPrimary300,
                  }}
                  type="xs/brand/medium"
                >
                  {eventById?.event?.description}
                </ThemedText>
              </ThemedView>
              <TouchableOpacity
                onPress={() => {
                  router.push(
                    `/(auth)/user/${eventById?.event?.organizer?.id}`,
                  );
                  setModal(false);
                }}
              >
                <CardActivityByUser
                  firstname={eventById?.event?.organizer?.firstname ?? ""}
                  lastname={eventById?.event?.organizer?.lastname ?? ""}
                  avatarColor={eventById?.event?.organizer?.avatarColor ?? ""}
                  avatarUrl={eventById?.event?.organizer?.avatarUrl ?? ""}
                />
              </TouchableOpacity>
              <ThemedView>
                <EventMapRappel
                  addressId={eventById?.event?.addressesId ?? ""}
                  goGoogleMap
                />
              </ThemedView>
              <ThemedView
                style={{
                  gap: 12,
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: colorSlate50,
                }}
              >
                <ThemedText
                  type={
                    isWidthLessThan400
                      ? "xs/brand/semibold"
                      : "sm/brand/semibold"
                  }
                  style={{ marginBottom: 12, color: colorPrimary300 }}
                >
                  {eventById?.event?.goingUsers.totalCount
                    ? `Ils participent (${eventById?.event?.goingUsers.totalCount})`
                    : `Aucun participant`}
                </ThemedText>
                {eventById?.event?.goingUsers?.nodes &&
                  eventById?.event.goingUsers?.nodes.map((userEvent, i) => (
                    <ContactCard
                      key={i}
                      contact={userEvent?.user as any}
                      onPress={() => {
                        setModal(false);
                        router.push({
                          pathname: "/user/[userId]",
                          params: { userId: userEvent?.user?.id as string },
                        });
                      }}
                    />
                  ))}
              </ThemedView>
            </ThemedView>
            {eventById.event.getStatusOnEvent === "GO" ? (
              <View className="pb-6">
                <BaseButton
                  title="Me désinscrire"
                  onPress={() => {
                    submitAnswer("NO");
                    posthog?.capture("activity_unjoined", {
                      description: "Désinscription d'une activité",
                      properties: [{ activity: selectedSessionId }],
                      tags: [
                        "Activités / Vue",
                        "ActivityDetailScreen",
                        "Moyenne",
                      ],
                      type: "event",
                    });
                    setModal(false);
                    handleUnsubscribe();
                  }}
                  type={"destructive"}
                />
              </View>
            ) : null}
          </ScrollView>
        ) : null}

        {eventById?.event?.getStatusOnEvent === "GO" ? (
          <ContainerButtonSheet shadow>
            <BaseButton
              disable={!!storedEvent}
              onPress={async () => {
                try {
                  await createEventCalendar(
                    { event: eventById?.event },
                    selectedSessionId,
                  );
                  setStoredEvent(!storedEvent);
                } catch (error) {
                  console.error(
                    "Erreur lors de l'ajout au calendrier :",
                    error,
                  );
                }
              }}
              title={
                storedEvent ? "Dans votre calendrier" : "Ajouter au calendrier"
              }
              type="outlined"
            />

            <BaseButton
              title="Me rendre sur place"
              onPress={openMaps}
              type="solid"
            />
          </ContainerButtonSheet>
        ) : eventById?.event?.getStatusOnEvent === "INV" ? (
          <ContainerButtonSheet classNameStyle="gap-4">
            <BaseButton
              title="Décliner l'invitation"
              disable={eventById?.event?.startAt < new Date().toISOString()}
              onPress={() => {
                submitAnswer("NO");
                posthog?.capture("activity_invitation_declined", {
                  description: "Invitation à activité refusée",
                  properties: [
                    {
                      activity: selectedSessionId,
                      organizerId: eventById?.event?.organizerId,
                    },
                  ],
                  tags: [
                    "Activités / Invitations",
                    "ActivityDetailScreen",
                    "Moyenne",
                  ],
                  type: "event",
                });
                setTimeout(() => {
                  setModal(false);
                  setselectdId("");
                }, 500);
              }}
              type="destructive"
            />
            <BaseButton
              title="Accepter l'invitation"
              disable={participationDisabled}
              onPress={() => {
                posthog?.capture("activity_invitation_accepted", {
                  description: "Invitation à activité acceptée",
                  properties: {
                    activity: selectedSessionId,
                    organizerId: eventById?.event?.organizerId,
                  },
                  tags: [
                    "Activités / Invitations",
                    "ActivityDetailScreen",
                    "Moyenne",
                  ],
                  type: "event",
                });
                submitAnswer("GO");
              }}
              type="success"
            />
          </ContainerButtonSheet>
        ) : eventById?.event?.getStatusOnEvent === "NO" ||
          eventById?.event?.getStatusOnEvent === null ? (
          <ContainerButtonSheet
            classNameStyle="gap-4"
            shadow={true}
            CardChipL="publique"
            CardChipR="places"
            number={eventById?.event?.goingUsers.totalCount.toString()}
          >
            <BaseButton
              title="Participer"
              type="solid"
              onPress={() => {
                submitAnswer("GO");
              }}
              disable={participationDisabled}
            />
          </ContainerButtonSheet>
        ) : null}
      </ThemedView>
    </BottomSheet>
  );
};
