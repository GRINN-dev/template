import type { Plans, Resolvers } from "postgraphile/utils";
import { access } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

import { ERROR_MESSAGE_OVERRIDES } from "../utils/handleErrors";
import { login as loginUtils } from "../utils/login";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// eslint-disable-next-line no-unused-vars
const RegisterPlugin = makeExtendSchemaPlugin((build) => {
  const userResource = build.input.pgRegistry.pgResources.users;
  if (!userResource) {
    throw new Error(
      "Couldn't find either the 'users' or 'current_user_id' source",
    );
  }
  const plans: Plans = {
    RegisterPayload: {
      user($obj) {
        const $userId = access($obj, "userId");
        return userResource.get({ id: $userId });
      },
    },
  };
  const typeDefs = gql`
    input RegisterInput {
      username: String!
      email: String!
      password: String!
      name: String
      avatarUrl: String
    }

    type RegisterPayload {
      user: User!
      accessToken: String
      refreshToken: String
    }

    extend type Mutation {
      """
      Use this mutation to create an account on our system. This may only be used if you are logged out.
      """
      register(input: RegisterInput!): RegisterPayload
    }
  `;
  const resolvers: Resolvers = {
    Mutation: {
      // eslint-disable-next-line no-unused-vars
      async register(_mutation, args, context: Grafast.Context, _resolveInfo) {
        const { password, email, username, name, avatarUrl } = args.input;
        const { rootPgPool, setCookie, pgSettings } = context;
        try {
          // Create a user and create a session for it in the proccess
          const {
            rows: [details],
          } = await rootPgPool.query<{ user_id: string; session_id: string }>(
            `
            with new_user as (
              select users.* from priv.really_create_user(
                username => $1,
                email => $2,
                email_is_verified => false,
                name => $3,
                avatar_url => $4,
                password => $5
              ) users where not (users is null)
            ), new_session as (
              insert into priv.sessions (user_id)
              select id from new_user
              returning *
            )
            select new_user.id as user_id, new_session.uuid as session_id
            from new_user, new_session`,
            [username, email, name, avatarUrl, password],
          );

          if (!details?.user_id) {
            throw Object.assign(new Error("Registration failed"), {
              code: "FFFFF",
            });
          }

          // TODO: do the token thing
          const { accessToken, refreshToken } = await loginUtils({
            payload: {
              sessionId: details.session_id,
              userId: details.user_id,
            },
            pool: rootPgPool,
            setCookie,
            at_secret: ACCESS_TOKEN_SECRET!,
            rt_secret: REFRESH_TOKEN_SECRET!,
          });

          // Get session_id from PG
          pgSettings!["jwt.claims.session_id"] = details.session_id;

          return {
            userId: details.user_id,

            accessToken,
            refreshToken,
          };
        } catch (e: any) {
          const { code } = e;
          const safeErrorCodes = [
            "WEAKP",
            "LOCKD",
            "EMTKN",
            ...Object.keys(ERROR_MESSAGE_OVERRIDES),
          ];
          if (safeErrorCodes.includes(code)) {
            throw e;
          } else {
            console.error(
              "Unrecognised error in AuthPlugin; replacing with sanitized version",
            );
            console.error(e);
            throw Object.assign(new Error("Registration failed"), {
              code,
            });
          }
        }
      },
    },
  };
  return {
    plans,
    typeDefs,
    resolvers,
  };
});

export default RegisterPlugin;
