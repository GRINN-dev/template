import { useState } from "react";
import { useQuery } from "@apollo/client";

import Calendar from "@/assets/svg/calendarEventSuccess.svg";
import { ResultOf } from "@/graphql";
import { EventByIdQuery } from "@/graphql/queries-content";
import { createEventCalendar } from "@/utils/event-calendar-edition";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "../ui/base-button";
import { BottomSheet } from "../ui/Bottom-sheet";
import { ContainerButtonSheet } from "../ui/containerButtonSheet";

export type GetEventByIdStore = ResultOf<typeof EventByIdQuery>;

export const SuccessEventModal = ({ eventId }: { eventId: string }) => {
  const isSmall = useIsWidthLessThan400();
  const [modalNewEventOpen, setModalNewEventOpen] = useState(
    eventId ? true : false,
  );

  const { data: event } = useQuery<GetEventByIdStore>(EventByIdQuery, {
    variables: { id: eventId },
    skip: !eventId,
  });

  return (
    <BottomSheet
      openModal={modalNewEventOpen}
      onClose={() => setModalNewEventOpen(false)}
      titleHeader="Activité visible sur Feder !"
    >
      <ThemedView className="grow items-center justify-center">
        <ThemedView className="mb-4">
          <Calendar />
        </ThemedView>
        <ThemedText type={isSmall ? "sm/brand/semibold" : "lg/brand/semibold"}>
          {event?.event?.title}
        </ThemedText>
        <ThemedText
          className={"text-center"}
          type={isSmall ? "smallText" : "medium"}
        >
          Votre activité vient d’être créée, vous pouvez ajouter cette dernière
          à votre calendrier pour ne pas l’oublier
        </ThemedText>
      </ThemedView>
      <ContainerButtonSheet>
        <BaseButton
          onPress={() => {
            setModalNewEventOpen(false);
          }}
          title="Passer"
          type="outlined"
        />

        <BaseButton
          onPress={async () => {
            try {
              await createEventCalendar({ event: event?.event }, eventId);
              setModalNewEventOpen(false);
            } catch (error) {
              console.error("Erreur lors de l'ajout au calendrier :", error);
            }
          }}
          title="Ajouter au calendrier"
          type="solid"
        />
      </ContainerButtonSheet>
    </BottomSheet>
  );
};
