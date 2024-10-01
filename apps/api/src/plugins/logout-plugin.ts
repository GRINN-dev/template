import { gql, makeExtendSchemaPlugin, Resolvers } from "postgraphile/utils";

const LogoutPlugin = makeExtendSchemaPlugin((build) => {
  const typeDefs = gql`
    type LogoutPayload {
      success: Boolean
    }

    extend type Mutation {
      """
      Use this mutation to logout from your account. Don't forget to clear the client state!
      """
      logout: LogoutPayload
    }
  `;
  const resolvers: Resolvers = {
    Mutation: {
      async logout(_mutation, _args, context: Grafast.Context, _resolveInfo) {
        const { withPgClient, setCookie } = context;

        // clear cookies refresh_token access_token
        setCookie([
          {
            name: "refresh_token",
            value: "",
            options: {
              path: "/",
              expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
              domain: process.env.DOMAIN,
              secure: true,
              httpOnly: true,
              sameSite: "none",
            },
          },
          {
            name: "access_token",
            value: "",
            options: {
              path: "/",
              expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
              domain: process.env.DOMAIN,
              secure: true,
              sameSite: "none",
            },
          },
        ]);

        // drop the session in the database
        await context.rootPgPool.query("select hidd.logout();");

        withPgClient({}, async (pgClient) => {
          await pgClient.query({
            text: "select hidd.logout();",
          });
        });
        return {
          success: true,
        };
      },
    },
  };
  return {
    typeDefs,
    resolvers,
  };
});

export default LogoutPlugin;
