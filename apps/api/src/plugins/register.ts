/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

export const RegisterMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { users } = build.input.pgRegistry.pgResources;
  return {
    typeDefs: gql`
      input RegisterInput {
        email: String!
        password: String!
      }

      type RegisterPayload {
        user: User
        accessToken: String
        refreshToken: String
        query: Query
      }

      extend type Mutation {
        register(input: RegisterInput!): RegisterPayload
      }
    `,
    plans: {
      Mutation: {
        register(_, fieldArgs) {
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
                  rows: [row],
                } = await rootPgPool.query<{
                  user_id: string;
                  session_id: string;
                }>({
                  text: `
                    with new_user as (
                    select users.* from priv.really_create_user(
                        email => $1,
                        password => $2
                    ) users where not (users is null)
                    ), new_session as (
                    insert into priv.sessions (user_id)
                    select id from new_user
                    returning *
                    )
                    select new_user.id as user_id, new_session.uuid as session_id
                    from new_user, new_session`,

                  values: [input.email, input.password],
                });

                if (!row?.session_id && !row?.user_id) {
                  throw new Error("Registration failed");
                }

                const { accessToken, refreshToken } = createTokensAndSetCookies(
                  {
                    userId: row.user_id,
                    sessionId: row.session_id,
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
                  values: [refreshToken, row.session_id, ipAddr, userAgent],
                });
                await rootPgPool.query("commit;");

                return {
                  ...row,
                  accessToken,
                  refreshToken,
                };
              } catch (e: unknown) {
                await rootPgPool.query("rollback;");
                handleSafeError(
                  e,
                  "Unrecognised error in RegisterMutationPlugin; replacing with sanitized version",
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
      RegisterPayload: {
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
