import type { PgClassExpressionStep } from "postgraphile/@dataplan/pg";
import type { Plans, Resolvers } from "postgraphile/utils";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

import { login as loginUtils } from "../utils/login";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const LoginPlugin = makeExtendSchemaPlugin((build) => {
  const typeDefs = gql`
    input LoginInput {
      username: String!
      password: String!
    }

    type LoginPayload {
      accessToken: String
      refreshToken: String
      user: User
    }

    extend type Mutation {
      """
      Use this mutation to log in to your account; this login uses sessions so you do not need to take further action.
      """
      login(input: LoginInput!): LoginPayload
    }
  `;
  const userResource = build.input.pgRegistry.pgResources.users;
  const currentUserIdResource =
    build.input.pgRegistry.pgResources.current_user_id;
  if (!userResource || !currentUserIdResource) {
    throw new Error(
      "Couldn't find either the 'users' or 'current_user_id' source",
    );
  }
  const plans: Plans = {
    LoginPayload: {
      user() {
        const $userId =
          currentUserIdResource.execute() as PgClassExpressionStep<any, any>;
        return userResource.get({ id: $userId });
      },
    },
  };
  const resolvers: Resolvers = {
    Mutation: {
      // eslint-disable-next-line no-unused-vars
      async login(_mutation, args, context: Grafast.Context, _resolveInfo) {
        const { username, password } = args.input;
        const { rootPgPool, setCookie, pgSettings } = context;
        try {
          // Call our login function to find out if the email/password combination exists
          const {
            rows: [session],
          } = await rootPgPool.query(
            `select sessions.* from priv.login($1, $2) sessions where not (sessions is null)`,
            [username, password],
          );

          if (!session) {
            throw Object.assign(new Error("Incorrect email/password"), {
              code: "CREDS",
            });
          }

          // TODO: do the token thing
          const { accessToken, refreshToken } = await loginUtils({
            payload: {
              sessionId: session.uuid,
              userId: session.user_id,
            },
            pool: rootPgPool,
            setCookie,
            at_secret: ACCESS_TOKEN_SECRET!,
            rt_secret: REFRESH_TOKEN_SECRET!,
          });

          // Get session_id from PG
          pgSettings!["jwt.claims.session_id"] = session.uuid;

          return {
            accessToken,
            refreshToken,
          };
        } catch (e: any) {
          const code = e.extensions?.code ?? e.code;
          const safeErrorCodes = ["LOCKD", "CREDS"];
          if (safeErrorCodes.includes(code)) {
            throw e;
          } else {
            console.error(e);
            throw Object.assign(new Error("Login failed"), {
              code,
            });
          }
        }
      },
    },
  };
  return {
    typeDefs,
    resolvers,
    plans,
  };
});

export default LoginPlugin;
