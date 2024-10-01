import * as SibApiV3Sdk from "@getbrevo/brevo";
import { Task } from "graphile-worker";

export interface SendEmailPayload {
  mailData: SibApiV3Sdk.SendSmtpEmail;
}

const isDev = process.env.NODE_ENV === "development";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!,
);

export const send_email: Task = async (payload) => {
  if (!isDev && !process.env.BREVO_API_KEY) {
    console.log("api key brevo not set, email will not be sent");
    return;
  }

  const { mailData } = payload as SendEmailPayload;
  console.log("is dev ?? ", isDev);

  if (!isDev) {
    try {
      apiInstance.sendTransacEmail(mailData).then((data) => {
        console.log(
          "API called successfully. Returned data: ",
          data.response.statusCode,
        );
      });
    } catch (e: any) {
      console.log("Error send_email: \n", e?.message);
    }
  } else {
    console.log(
      "\n\n============ Brevo ============\n",
      mailData,
      "\n===============================\n\n",
    );
  }
};
