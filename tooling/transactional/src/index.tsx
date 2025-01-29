import { render } from "@react-email/components";

import AccountValidation from "./emails/account-validation";
import ConfirmationDeleteAccount from "./emails/confirmation-delete-account";
import MyEmail from "./emails/my-email-test";
import ResetPasswordExistingEmail from "./emails/reset-password-existing-email";
import ResetPasswordNoEmail from "./emails/reset-password-no-email";

const templates = {
  ACCOUNT_VALIDATION: AccountValidation,
  CONFIRMATION_DELETE_ACCOUNT: ConfirmationDeleteAccount,
  RESET_PASSWORD_NO_EMAIL: ResetPasswordNoEmail,
  RESET_PASSWORD_EXISTING_EMAIL: ResetPasswordExistingEmail,
  MY_EMAIL: MyEmail,
};

export { render, templates };
