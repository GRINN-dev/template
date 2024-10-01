import { Task } from "graphile-worker";

import { SendEmailPayload } from "./send_email";

interface UserSendAccountDeletionEmailPayload {
  /**
   * email address
   */
  email: string;

  /**
   * secret token
   */
  token: string;
}

const task: Task = async (inPayload, { addJob }) => {
  const payload: UserSendAccountDeletionEmailPayload = inPayload as any;
  const { email, token } = payload;
  const sendEmailPayload: SendEmailPayload = {
    mailData: {
      to: [{ email: email }],
      params: {
        subject: "Confirmation required: really delete account?",
        deleteAccountLink: `${
          process.env.SITE_URL
        }/settings/delete?token=${encodeURIComponent(token)}`,
      },
      templateId: 1,
    },
  };
  await addJob("send_email", sendEmailPayload);
};

export default task;
