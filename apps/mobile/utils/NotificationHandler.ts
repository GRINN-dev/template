import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export const registerForPushNotificationsAsync = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus === "denied") {
      throw new Error("Permission not granted!");
    }
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error("Permission not granted!");
    }
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "0358bbf1-b1d2-421c-8160-3784167f6094",
      })
    ).data;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("feder", {
        name: "feder",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  } catch (error) {
    console.error(error);
  }
};
