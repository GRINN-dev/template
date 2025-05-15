import * as Calendar from "expo-calendar";

import {
  deleteStoreEventItemAsync,
  EventCalendarType,
  getStoreEventItemAsync,
  setStoreEventItemAsync,
} from "./secure-store-event";

export const createEventCalendar = async (event: any, eventId: string) => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée pour accéder au calendrier");
      return;
    }
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );
    const editableCalendar = calendars.find((cal) => cal.allowsModifications);
    if (!editableCalendar) {
      alert("Aucun calendrier modifiable trouvé");
      return;
    }
    const startDate = new Date(event?.event?.startAt ?? Date.now());
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const eventDetails: EventCalendarType["event"] = {
      title: "feder : " + event?.event?.title,
      startDate,
      endDate,
      timeZone: "Europe/Paris",
      location: event?.event?.addresses?.formattedAddress,
      id: event?.event?.id,
    };

    // Stockage de l'ID de l'événement créé
    const eventCalendarId = await Calendar.createEventAsync(
      editableCalendar.id,
      eventDetails,
    );

    const dataToStore = {
      event: event?.event ?? null,
      calendarId: editableCalendar.id,
      eventCalendarId: eventCalendarId,
    };
    await setStoreEventItemAsync(eventId, dataToStore);

    console.log("Données stockées :", dataToStore);
    alert("Événement ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout au calendrier :", error);
    alert("Une erreur est survenue lors de l'ajout de l'événement");
  }
};
export const updateCalendar = async (createForm: any, eventId: string) => {
  try {
    const storedEvent = await getStoreEventItemAsync(eventId!);
    if (!storedEvent) {
      console.log("Aucun événement trouvé dans le stockage");
      return;
    }
    const { calendarId, eventCalendarId } = storedEvent;

    if (!eventCalendarId) {
      console.log("Aucun eventCalendarId trouvé dans le stockage");
      return;
    }
    const calendarEvent = await Calendar.getEventAsync(eventCalendarId);
    if (!calendarEvent) {
      deleteStoreEventItemAsync(eventId!);
      console.log("Aucun événement trouvé dans le calendrier");
      return;
    }

    // Calculer la nouvelle date de début et de fin
    const calendarStartDate = new Date(calendarEvent.startDate);
    let newStartDate;
    if (createForm.date && createForm.time) {
      const selectedDate = createForm.date.split("T")[0];
      const selectedTime = createForm.time.split("T")[1];
      const dateStr = `${selectedDate}T${selectedTime}`;
      newStartDate = new Date(dateStr);
    } else {
      newStartDate = calendarStartDate;
    }
    // la duration c'est initialisé à 1 heure dans le calendrier : ici on récupere la durée du calendrier (qui à pu être modifiée) pour garder la même durée.
    const duration =
      new Date(calendarEvent.endDate).getTime() - calendarStartDate.getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);

    // Préparer les détails mis à jour (on utilise la valeur du formulaire si elle est présente)
    const updatedEventDetails: EventCalendarType["event"] = {
      id: eventId,
      title: "feder : " + createForm.title,
      startDate: newStartDate,
      endDate: newEndDate,
      timeZone: "Europe/Paris",
      location: createForm.location || calendarEvent.location,
    };

    // Mettre à jour l'événement dans le calendrier
    await Calendar.updateEventAsync(eventCalendarId, updatedEventDetails);
    // Mettre à jour les données stockées pour refléter les changements
    const updatedStoredData: EventCalendarType = {
      calendarId,
      eventCalendarId,
      event: updatedEventDetails,
    };

    await setStoreEventItemAsync(eventId!, updatedStoredData);
    console.log("Mise à jour réussie :", updatedStoredData);
    alert("Événement mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    alert("Une erreur est survenue lors de la mise à jour de l'événement");
  }
};

export const getStoredEvent = async (
  eventId: any,
): Promise<EventCalendarType | undefined> => {
  if (eventId) {
    try {
      const event = await getStoreEventItemAsync(eventId);
      if (event) {
        // setStoredEvent(event);
        const { eventCalendarId } = event;
        if (!eventCalendarId) {
          console.log("Aucun eventCalendarId trouvé dans le stockage");
          return undefined;
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
            return undefined;
          } else {
            throw error;
          }
        }
        if (!calendarEvent) {
          await deleteStoreEventItemAsync(eventId);
          // setStoredEvent(null);
          console.log("Aucun événement trouvé dans le calendrier");
        }
        return event;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération ou vérification de l'event stocké",
        error,
      );
    }
    return undefined;
  }
};
