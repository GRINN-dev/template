import * as SecureStore from "expo-secure-store";

type EventStoreKey = `${string}`;

export type EventCalendarType = {
  calendarId: string;
  eventCalendarId: string;

  event: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    timeZone: "Europe/Paris";
    location: string;
  };
};
export const setStoreEventItemAsync = async (
  key: EventStoreKey,
  value: EventCalendarType,
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error("secure store set item error: ", error);
  }
};

export const deleteStoreEventItemAsync = async (
  key: EventStoreKey,
): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("secure store delete item error: ", error);
  }
};

export const getStoreEventItemAsync = async (
  key: EventStoreKey,
): Promise<EventCalendarType | null> => {
  try {
    const item = await SecureStore.getItemAsync(key);
    if (item) {
      console.log(`${key} was used 🔐 \n`);
      return JSON.parse(item) as EventCalendarType;
    } else {
      console.log("No values stored under key: " + key);
      return null;
    }
  } catch (error) {
    console.error("secure store get item error: ", error);
    await deleteStoreEventItemAsync(key);
    return null;
  }
};
