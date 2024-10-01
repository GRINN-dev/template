import { Task } from "graphile-worker";

import { projectName } from "../config";
import { SendEmailPayload } from "./send_email";

interface UserForgotPasswordUnregisteredEmailPayload {
  email: string;
}

const task: Task = async (inPayload, { addJob }) => {
  const payload: UserForgotPasswordUnregisteredEmailPayload = inPayload as any;
  const { email } = payload;

  const sendEmailPayload: SendEmailPayload = {
    mailData: {
      to: [{ email }],
      params: {
        subject: `Password reset request failed: you don't have a ${projectName} account`,
        url: process.env.SITE_URL,
      },
      templateId: 1,
    },
  };
  await addJob("send_email", sendEmailPayload);
};

export default task;
