/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  access,
  constant,
  context,
  object,
  sideEffect,
} from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

import { handleSafeError } from "../utils/handle-errors";
import { createTokensAndSetCookies } from "../utils/jwt";

export const LoginMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { users } = build.input.pgRegistry.pgResources;
  return {
    typeDefs: gql`
      input LoginInput {
        email: String!
        password: String!
      }

      type LoginPayload {
        user: User
        accessToken: String
        refreshToken: String
        query: Query
      }

      extend type Mutation {
        login(input: LoginInput!): LoginPayload
      }
    `,
    plans: {
      Mutation: {
        login(_, fieldArgs) {
          const $input = fieldArgs.getRaw("input");

          const $rootPgPool = context().get("rootPgPool");
          const $setCookies = context().get("setCookies");
          const $ipAddr = context().get("ipAddr");
          const $userAgent = context().get("userAgent");

          const $userSession = sideEffect(
            [$rootPgPool, $input, $setCookies, $ipAddr, $userAgent],
            async ([rootPgPool, input, setCookies, ipAddr, userAgent]) => {
              try {
                await rootPgPool.query("begin;");
                const {
                  rows: [userSession],
                } = await rootPgPool.query<{
                  user_id: string;
                  uuid: string;
                }>(
                  `select sessions.* from priv.login($1, $2) sessions where not (sessions is null)`,

                  [input.email, input.password],
                );

                if (!userSession?.uuid || !userSession.user_id) {
                  console.error(userSession);
                  throw Object.assign(new Error("Incorrect email/password"), {
                    code: "CREDS",
                  });
                }

                const { accessToken, refreshToken } = createTokensAndSetCookies(
                  {
                    userId: userSession.user_id,
                    sessionId: userSession.uuid,
                    setCookies,
                  },
                );

                // we update the session with the refresh token
                await rootPgPool.query({
                  text: `
                        update priv.sessions
                        set refresh_token = $1,
                        ip_address = $3,
                        user_agent = $4
                        where uuid = $2;
                        `,
                  values: [refreshToken, userSession.uuid, ipAddr, userAgent],
                });
                await rootPgPool.query("commit;");

                return { ...userSession, accessToken, refreshToken };
              } catch (e: unknown) {
                await rootPgPool.query("rollback;");
                handleSafeError(
                  e,
                  "Unrecognised error in LoginMutationPlugin; replacing with sanitized version",
                );
              }
            },
          );

          // To allow for future expansion (and for the `clientMutationId`
          // field to work), we'll return an object step containing our data:
          return object({ userSession: $userSession });
        },
      },

      // The payload also needs plans detailing how to resolve its fields:
      LoginPayload: {
        user($data) {
          const $userSession = $data.get("userSession");
          // Get the '.id' property from $user:
          const $userId = access($userSession, "user_id");

          // Return a step representing this row in the database.
          return users?.get({ id: $userId });
        },
        query(_) {
          // Anything truthy should work for the `query: Query` field.
          return constant(true);
        },
        accessToken($data) {
          const $userSession = $data.get("userSession");
          return access($userSession, "accessToken");
        },
        refreshToken($data) {
          const $userSession = $data.get("userSession");
          return access($userSession, "refreshToken");
        },
      },
    },
  };
});
