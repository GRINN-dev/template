import * as SecureStore from "expo-secure-store";

const secureStoreKeys = ["access_token", "refresh_token"] as const;
type SecureStoreKeys = (typeof secureStoreKeys)[number];

export const setStoreItemAsync = async (
  key: SecureStoreKeys,
  value: string,
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("secure store set item error: ", error);
  }
};

export const deleteStoreItemAsync = async (
  key: SecureStoreKeys,
): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("secure store delete item error: ", error);
  }
};

export const getStoreItemAsync = async (
  key: SecureStoreKeys,
): Promise<string | null> => {
  try {
    const item = await SecureStore.getItemAsync(key);
    if (item) {
      console.log(`${key} was used 🔐 \n`);
    } else {
      console.log("No values stored under key: " + key);
    }
    return item;
  } catch (error) {
    console.error("secure store get item error: ", error);
    await deleteStoreItemAsync(key); // HERE!
    return null;
  }
};
