import { Task } from "graphile-worker";

import { SendEmailPayload } from "./send_email";

interface UserForgotPasswordPayload {
  /**
   * user id
   */
  id: string;

  /**
   * email address
   */
  email: string;

  /**
   * secret token
   */
  token: string;
}

const task: Task = async (inPayload, { addJob, withPgClient }) => {
  const payload: UserForgotPasswordPayload = inPayload as any;
  const { id: userId, email, token } = payload;
  const {
    rows: [user],
  } = await withPgClient((pgClient) =>
    pgClient.query(
      `
        select users.*
        from publ.users
        where id = $1
      `,
      [userId],
    ),
  );

  if (!user) {
    console.error("User not found; aborting");
    return;
  }
  const sendEmailPayload: SendEmailPayload = {
    mailData: {
      to: [{ email: email }],
      params: {
        subject: "Password reset",
        actionDescription: "reset your password",
        verifyLink: `${
          process.env.SITE_URL
        }/fr/reset-password?user_id=${encodeURIComponent(
          user.id,
        )}&token=${encodeURIComponent(token)}`,
      },
      templateId: 1,
    },
  };
  await addJob("send_email", sendEmailPayload);
};

export default task;
