import { Task } from "graphile-worker";

import { render, templates } from "@grinn/transactional";

export const test_email: Task = async (inPayload, { addJob, withPgClient }) => {
  const emailHTML = await render(templates.MY_EMAIL());

  console.log(emailHTML);

  return;
};
