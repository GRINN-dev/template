import { graphql } from "@/graphql";

const ForgotPasswordSmsMutationUnpersisted = graphql(`
  mutation ForgotPassword($email: String!) {
    forgotPasswordSms(input: { email: $email }) {
      userId: result
    }
  }
`);

const RegisterWithTierAuthMutationUnpersisted = graphql(`
  mutation RegisterWithTierAuth(
    $token: String!
    $profile: String!
    $service: String!
  ) {
    registerWithTierAuth(
      input: { profile: $profile, service: $service, token: $token }
    ) {
      accessToken
      refreshToken
    }
  }
`);

const LoginMutationUnpersisted = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`);

const RegisterMutationUnpersisted = graphql(`
  mutation Register($email: String!, $password: String!) {
    register(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`);

const ResetPasswordMutationUnpersisted = graphql(`
  mutation ChangePassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
    }
  }
`);

const LogoutMutationUnpersisted = graphql(`
  mutation Logout {
    logout {
      success
    }
  }
`);

const ChangePasswordMutationUnpersisted = graphql(`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      clientMutationId
    }
  }
`);

const DeleteCurrentUserMutationUnpersisted = graphql(`
  mutation DeleteCurrentUser($input: DeleteCurrentUserInput!) {
    deleteCurrentUser(input: $input) {
      result
    }
  }
`);

const SendVerificationCodeUnpersisted = graphql(`
  mutation ValidateCode($code: String!) {
    validateCode(input: { pCode: $code }) {
      result
    }
  }
`);

const UpdateMyPhoneNumberUnpersisted = graphql(`
  mutation UpdateMyPhoneNumber($input: UpdateMyPhoneNumberInput!) {
    updateMyPhoneNumber(input: $input) {
      clientMutationId
    }
  }
`);

export const ForgotPasswordSmsMutation = graphql.persisted(
  "sha256:51cd2fa209a2ab6ce47d297e98ea9170c57fe4f9cc05d3d67f009da66047346a",
  ForgotPasswordSmsMutationUnpersisted,
);

export const RegisterWithTierAuthMutation = graphql.persisted(
  "sha256:37f1ff04b3e061f7a2d3dc5befe542aad31c441f6726d7739d5733d8122b311d",
  RegisterWithTierAuthMutationUnpersisted,
);

export const LoginMutation = graphql.persisted(
  "sha256:043454c690fbdc53b707f847a856b47ae18a8bd309fd1497bcd2e2f6bcf51414",
  LoginMutationUnpersisted,
);
export const RegisterMutation = graphql.persisted(
  "sha256:618dbd7e00c15504ce6237ce348986976ec743f434c3db23f9caf347c87217e3",
  RegisterMutationUnpersisted,
);

export const ResetPasswordMutation = graphql.persisted(
  "sha256:00cd04a40361a43364da221ca2030d65d61480771dce39dc3ff8e6b0c74e41d6",
  ResetPasswordMutationUnpersisted,
);

export const LogoutMutation = graphql.persisted(
  "sha256:907a96ebe50412c30efb76945fc03e85fbc9747ccf8a5ea4d46ecc7724397283",
  LogoutMutationUnpersisted,
);

export const ChangePasswordMutation = graphql.persisted(
  "sha256:4b891244e5f1c48394da0429252d297f20ecf7c93d7095ad667dc5e60254363e",
  ChangePasswordMutationUnpersisted,
);

export const DeleteCurrentUserMutation = graphql.persisted(
  "sha256:02ed123e953ca501ff9c660e4930673e297913ddb93db89342fc6bc5c083856b",
  DeleteCurrentUserMutationUnpersisted,
);

export const SendVerificationCodeMutation = graphql.persisted(
  "sha256:dd625fd54d69227ee797cb692d7bd701309c6e1c567ffd541537370b6977c672",
  SendVerificationCodeUnpersisted,
);

export const UpdateMyPhoneNumberMutation = graphql.persisted(
  "sha256:5ec1b74a12e70150f0763e90e90f81415c9e204060b163a590c15259ed6b4366",
  UpdateMyPhoneNumberUnpersisted,
);
