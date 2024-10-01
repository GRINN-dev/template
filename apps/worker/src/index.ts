import { run } from "graphile-worker";

import { send_email } from "./tasks/send_email";
import user__audit from "./tasks/user__audit";
import user__forgot_password from "./tasks/user__forgot_password";
import user__forgot_password_unregistered_email from "./tasks/user__forgot_password_unregistered_email";
import user__send_delete_account_email from "./tasks/user__send_delete_account_email";
import user_emails__send_verification from "./tasks/user_emails__send_verification";

const main = async () => {
  const runner = await run({
    connectionString: process.env.DATABASE_URL,
    concurrency: 5,
    noHandleSignals: false,
    pollInterval: 1000,
    crontabFile: `${__dirname}/../crontab`,
    taskList: {
      send_email,
      user__audit,
      user__forgot_password,
      user__forgot_password_unregistered_email,
      user__send_delete_account_email,
      user_emails__send_verification,
    },
  });
  await runner.promise;
};
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
