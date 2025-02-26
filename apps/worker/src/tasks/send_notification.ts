import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { Task } from "graphile-worker";

let expo = new Expo({ accessToken: process.env.EXPO_TOKEN, useFcmV1: true });

export interface SendNotificationPayload {
  id: string; // id de la notif
  pushToken: string; // user qui va recevoir la notif
  body: string; // contenu de la notif
  title: string; // titre de la notif
  picture?: string;
  data: any; // comportement de la notification ex : compaignId
}

export const send_notification: Task = async (payload, { withPgClient }) => {
  const myPayload = payload as SendNotificationPayload;
  const { id, pushToken, body, title, data } = myPayload;

  if (process.env.NODE_ENV === "development") {
    return;
  }
  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  // Construct the message that you will send to the user
  const message = [
    {
      to: pushToken,
      sound: "default",
      title,
      body,
      data: { ...data, id },
    },
  ] as ExpoPushMessage[];

  // Create the 'ticket' that will send notification to the user and tell us if it worked or not
  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(message);
    console.log("ticketChunk \n", ticketChunk);
    if (ticketChunk?.[0]?.status === "error") {
      console.log("message expo", ticketChunk?.[0]?.message);
      withPgClient(async (pgClient) => {
        await pgClient.query(
          `update publ.notifications set status = 'ERROR' where id = $1`,
          [id],
        );
      });
      return;
    } else if (ticketChunk?.[0]?.status === "ok") {
      withPgClient(async (pgClient) => {
        await pgClient.query(
          `update publ.notifications set status = 'SENT', expo_ticket_id = $2 where id = $1`,
          //disable typescript pour cette ligne
          // @ts-ignore
          [id, ticketChunk?.[0]?.id],
        );
      });
    } else {
      //disable typescript pour cette ligne
      // @ts-ignore
      console.log("message expo", ticketChunk?.[0]?.message);
    }

    // stocker le ticket id dans la column expo_ticket_id de la table publ.notifications si status = 'ok'
  } catch (err) {
    console.log("error expo", err);
    withPgClient(async (pgClient) => {
      await pgClient.query(
        `update publ.notifications set status = 'ERROR' where id = $1`,
        [id],
      );
    });
  }
};

// dans la table publ.notifications changement de status de la notification en 'SENT' ou 'ERROR' si le job a été appelé puis ajout du expo_ticket_id si le job a été appelé avec succès
